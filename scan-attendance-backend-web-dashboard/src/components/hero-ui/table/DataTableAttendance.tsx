import React, { type SVGProps, memo, useMemo, useCallback, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, type Selection, type ChipProps, type SortDescriptor, Input, Pagination, Spinner, Tooltip } from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@/components/hero-ui";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { CiFilter, CiSearch } from "react-icons/ci";
import { RiFilter2Fill } from "react-icons/ri";
import { ButtonView, ButtonMarkPresent, ButtonMarkAbsent, ButtonMarkLate, ButtonMarkPermission } from "../button-permission";
import { cn } from "@/lib/utils";
import { useRenderCount } from "@/hooks/testing-render/useRenderCount";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

type Data = Record<string, any>;

interface Columns {
  name: string;
  uid: string;
  sortable?: boolean;
}

interface DataTableAttendanceProps {
  dataApi?: Data[];
  cols?: Columns[];
  visibleCols?: string[];
  status?: { uid: string; name: string }[];
  selectRow?: boolean;
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  statusColors?: Record<string, ChipProps["color"]>;
  lenghtOf?: string;
  colKeys?: {
    key: string;
    value: React.ReactNode | ((data: Data) => React.ReactNode);
  }[];
  short?: {
    column: string;
    direction: "ascending" | "descending";
  };
  // Actions
  onView?: (data: object) => void;
  loadData?: () => void;
  onOpenFilter?: () => void;
  onMarkPresent?: (data: object) => void;
  onMarkPermission?: (data: object) => void;
  onMarkLate?: (data: object) => void;
  onMarkAbsent?: (data: object) => void;
  // Permissions
  permissionView?: string;
  permissionMarkPresent?: string;
  permissionMarkPermission?: string;
  permissionMarkLate?: string;
  permissionMarkAbsent?: string;
  // Search
  searchKeyword?: string;
  onSearchInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  handleSearch?: () => void;
  handleClearSearch?: () => void;
  // Pagination
  initialPage?: number;
  totalPages?: number;
  page?: number;
  onChangePage?: (page: number) => void;
  loading?: boolean;
  scrollable?: boolean;
  customizes?: {
    header?: React.ReactNode;
    action?: React.ReactNode;
  };
  isFiltered?: boolean;
  loadingButton?: boolean;
  isPending?: boolean;
}

// Memoize status color map
const STATUS_COLOR_MAP: Record<string, ChipProps["color"]> = {
  Present: "success",
  Absent: "danger",
  Late: "warning",
  Permission: "primary",
  Active: "success",
  Inactive: "danger",
};

// Memoize class names
const TABLE_CLASS_NAMES = {
  wrapper: ["max-h-[382px]", "max-w-3xl"],
  th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
  td: [
    "group-data-[first=true]/tr:first:before:rounded-none",
    "group-data-[first=true]/tr:last:before:rounded-none",
    "group-data-[middle=true]/tr:before:rounded-none",
    "group-data-[last=true]/tr:first:before:rounded-none",
    "group-data-[last=true]/tr:last:before:rounded-none",
  ],
  tr: ["p-0"],
};

// Attendance Action Buttons Component
interface AttendanceActionButtonsProps {
  data: Data;
  onView?: (data: object) => void;
  onMarkPresent?: (data: object) => void;
  onMarkAbsent?: (data: object) => void;
  onMarkLate?: (data: object) => void;
  onMarkPermission?: (data: object) => void;
  permissionView?: string;
  permissionMarkPresent?: string;
  permissionMarkAbsent?: string;
  permissionMarkLate?: string;
  permissionMarkPermission?: string;
  loadingButton?: boolean;
  customAction?: React.ReactNode;
  t: any;
}

const AttendanceActionButtons = memo(({
  data,
  onView,
  onMarkPresent,
  onMarkAbsent,
  onMarkLate,
  onMarkPermission,
  permissionView,
  permissionMarkPresent,
  permissionMarkAbsent,
  permissionMarkLate,
  permissionMarkPermission,
  loadingButton,
  customAction,
  t,
}: AttendanceActionButtonsProps) => {
  return (
    <div className="relative flex items-center justify-center gap-1">
      {onView && (
        <ButtonView 
          permissionType={permissionView} 
          onPress={() => onView(data)} 
        />
      )}
      {permissionMarkPresent && (
        <ButtonMarkPresent 
          permissionType={permissionMarkPresent} 
          onPress={() => onMarkPresent?.(data)} 
          isLoading={loadingButton}
        />
      )}
      {permissionMarkAbsent && (
        <ButtonMarkAbsent 
          permissionType={permissionMarkAbsent} 
          onPress={() => onMarkAbsent?.(data)} 
          isLoading={loadingButton}
        />
      )}
      {permissionMarkLate && (
        <ButtonMarkLate 
          permissionType={permissionMarkLate} 
          onPress={() => onMarkLate?.(data)} 
          isLoading={loadingButton}
        />
      )}
      {permissionMarkPermission && (
        <ButtonMarkPermission 
          permissionType={permissionMarkPermission} 
          onPress={() => onMarkPermission?.(data)} 
          isLoading={loadingButton}
        />
      )}
      {customAction}
    </div>
  );
});

AttendanceActionButtons.displayName = 'AttendanceActionButtons';

// Table Controls Component
interface AttendanceTableControlsProps {
  searchKeyword: string;
  onSearchInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  handleSearch: () => void;
  handleClearSearch: () => void;
  status?: { uid: string; name: string }[];
  statusFilter: Selection;
  setStatusFilter: (keys: Selection) => void;
  columns: Columns[];
  visibleColumns: Selection;
  setVisibleColumns: (keys: Selection) => void;
  onOpenFilter?: () => void;
  isFiltered?: boolean;
  customHeader?: React.ReactNode;
  t: any;
}

const AttendanceTableControls = memo(({
  searchKeyword,
  onSearchInputChange,
  handleSearch,
  handleClearSearch,
  status,
  statusFilter,
  setStatusFilter,
  columns,
  visibleColumns,
  setVisibleColumns,
  onOpenFilter,
  isFiltered,
  customHeader,
  t,
}: AttendanceTableControlsProps) => {
  const capitalize = useCallback(
    (s: string): string =>
      typeof s !== "string"
        ? String(s ?? "")
        : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
    []
  );

  return (
    <div className="flex items-end justify-between gap-3">
      <div className="relative w-1/3">
        <Input
          size="sm"
          placeholder={t("search")}
          value={searchKeyword}
          onChange={onSearchInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onClear={handleClearSearch}
          isClearable
          classNames={{
            clearButton: "text-default-500 hover:text-default-600",
            inputWrapper: "bg-zinc-200 dark:bg-zinc-800 shadow-none focus:bg-zinc-200",
            input: "px-2 font-normal",
          }}
          radius="md"
          startContent={<CiSearch className="text-lg text-default-500" />}
        />
      </div>
      <div className="flex gap-1">
        {customHeader}
        {status && (
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                radius="md"
                endContent={<FiChevronDown />}
                size="sm"
                variant="flat"
                color="default"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              closeOnSelect={false}
              selectionMode="multiple"
              selectedKeys={statusFilter}
              onSelectionChange={setStatusFilter}
            >
              {status.map((statusItem) => (
                <DropdownItem key={statusItem.uid} className="capitalize" closeOnSelect={false}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full flex",
                        `bg-${STATUS_COLOR_MAP[statusItem.name as keyof typeof STATUS_COLOR_MAP]}`
                      )}
                    />
                    {statusItem.name}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button radius="md" endContent={<FiChevronDown />} size="sm" variant="flat">
              Columns
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            selectionMode="multiple"
            selectedKeys={visibleColumns}
            onSelectionChange={setVisibleColumns}
            classNames={{
              base: "max-h-96 overflow-y-auto has-scrollbar-sm",
            }}
          >
            {columns.map((column) => (
              <DropdownItem key={column.uid} className="capitalize" closeOnSelect={false}>
                {capitalize(column.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {onOpenFilter && (
          <Button
            onPress={onOpenFilter}
            size="sm"
            radius="md"
            color={isFiltered ? "danger" : "primary"}
            startContent={isFiltered ? <RiFilter2Fill size={18} /> : <CiFilter size={18} />}
          >
            {isFiltered ? "Filtered" : "Filters"}
          </Button>
        )}
      </div>
    </div>
  );
});

AttendanceTableControls.displayName = 'AttendanceTableControls';

// MAIN COMPONENT
const DataTableAttendance = memo(({
  dataApi = [],
  cols = [],
  visibleCols = [],
  status,
  selectRow = false,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange: controlledOnSelectionChange,
  lenghtOf = "records",
  colKeys = [],
  short,
  onView,
  onOpenFilter,
  onMarkPresent,
  onMarkPermission,
  onMarkLate,
  onMarkAbsent,
  isFiltered = false,
  loadData,
  permissionView,
  permissionMarkPresent,
  permissionMarkPermission,
  permissionMarkLate,
  permissionMarkAbsent,
  searchKeyword = "",
  onSearchInputChange,
  initialPage = 1,
  totalPages = 0,
  page = 1,
  onChangePage = () => {},
  handleSearch = () => {},
  handleClearSearch = () => {},
  loading = true,
  customizes,
  loadingButton = false,
  isPending = false,
}: DataTableAttendanceProps) => {

  useRenderCount("DataTableAttendance");

  const { t } = useTranslation();

  // Internal state
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(
    short || { column: "", direction: "ascending" }
  );
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(visibleCols));

  // Memoize data and columns
  const columns = useMemo(() => cols, [cols]);
  const statusOptions = useMemo(() => status || [], [status]);
  const data = useMemo(() => dataApi, [dataApi]);

  // Determine if component is controlled
  const isControlled = controlledSelectedKeys !== undefined;
  const selectedKeys = isControlled ? controlledSelectedKeys : internalSelectedKeys;

  // Memoize header columns
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [columns, visibleColumns]);

  // Memoize filtered items
  const filteredItems = useMemo(() => {
    let filtered = [...data];
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filtered = filtered.filter(
        (item) =>
          item.status !== undefined &&
          Array.from(statusFilter).includes(String(item.status))
      );
    }
    return filtered;
  }, [data, statusFilter, statusOptions.length]);

  // Memoize sorted items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Data, b: Data) => {
      const first = a[sortDescriptor.column as keyof Data];
      const second = b[sortDescriptor.column as keyof Data];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  // Memoize renderCell
  const renderCell = useCallback(
    (data: Data, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof Data];
      const customCol = colKeys.find((col) => col.key === columnKey);

      if (customCol) {
        return typeof customCol.value === "function"
          ? customCol.value(data)
          : customCol.value;
      }

      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="gap-1 border-none capitalize text-default-600"
              color={
                data.status
                  ? (STATUS_COLOR_MAP[data.status as keyof typeof STATUS_COLOR_MAP] as any)
                  : undefined
              }
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <AttendanceActionButtons
              data={data}
              onView={onView}
              onMarkPresent={onMarkPresent}
              onMarkAbsent={onMarkAbsent}
              onMarkLate={onMarkLate}
              onMarkPermission={onMarkPermission}
              permissionView={permissionView}
              permissionMarkPresent={permissionMarkPresent}
              permissionMarkAbsent={permissionMarkAbsent}
              permissionMarkLate={permissionMarkLate}
              permissionMarkPermission={permissionMarkPermission}
              loadingButton={loadingButton}
              customAction={customizes?.action}
              t={t}
            />
          );
        default:
          return <span className="whitespace-nowrap text-zinc-600 dark:text-zinc-300 *:text-zinc-600 *:dark:text-zinc-300">{cellValue}</span>;
      }
    },
    [
      colKeys,
      onView,
      onMarkPresent,
      onMarkAbsent,
      onMarkLate,
      onMarkPermission,
      permissionView,
      permissionMarkPresent,
      permissionMarkAbsent,
      permissionMarkLate,
      permissionMarkPermission,
      loadingButton,
      customizes?.action,
      t,
    ]
  );

  // Memoize selection change handler
  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (isControlled) {
        controlledOnSelectionChange?.(keys);
      } else {
        setInternalSelectedKeys(keys);
      }
    },
    [isControlled, controlledOnSelectionChange]
  );

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        <AttendanceTableControls
          searchKeyword={searchKeyword}
          onSearchInputChange={onSearchInputChange}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
          status={status}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          onOpenFilter={onOpenFilter}
          isFiltered={isFiltered}
          customHeader={customizes?.header}
          t={t}
        />
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {sortedItems.length} {lenghtOf}
          </span>
          {selectRow && selectedKeys !== "all" && selectedKeys.size > 0 && (
            <span className="text-small text-primary">
              {selectedKeys.size} selected
            </span>
          )}
        </div>
      </div>
      {loading && !isPending && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <Spinner size="sm" variant="spinner" color="primary" label={t("loading")}/>
        </div>
      )}
      <div className="has-scrollbar overflow-hidden overflow-x-auto transition-all duration-300 pb-4 mb-4" style={{ minHeight: 'calc(100vh - 19rem)', maxHeight: 'calc(100vh - 19rem)' }}>
        <Table
          isCompact
          removeWrapper
          aria-label="Attendance Data Table"
          checkboxesProps={{ color: "primary" }}
          classNames={TABLE_CLASS_NAMES}
          selectionMode={selectRow ? "multiple" : "none"}
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          topContentPlacement="outside"
          onSelectionChange={handleSelectionChange}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                className="text-xs capitalize whitespace-nowrap"
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={!loading && t("noData")}
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className="whitespace-nowrap">
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Pagination
          initialPage={initialPage}
          variant="light"
          total={totalPages}
          page={page}
          onChange={onChangePage}
          showControls
          hidden={totalPages < 2}
          size="sm"
        />
      </div>
    </div>
  );
});

DataTableAttendance.displayName = 'DataTableAttendance';

export default DataTableAttendance;