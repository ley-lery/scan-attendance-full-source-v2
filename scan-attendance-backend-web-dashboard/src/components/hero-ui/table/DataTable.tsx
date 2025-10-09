// DataTable.tsx - Updated component
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type SVGProps } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  type Selection,
  type ChipProps,
  type SortDescriptor,
  Input,
  Pagination,
  Spinner,
  Tooltip,
  ScrollShadow,
} from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, ShowToast } from "@/components/hero-ui";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { CiCalendar, CiFilter, CiSearch } from "react-icons/ci";
import { RiCheckLine, RiCloseLine, RiFilter2Fill, RiSettings6Line } from "react-icons/ri";
import { useToggleStore } from "@/stores/userToggleStore";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { ButtonAdd, ButtonEdit, ButtonView, ButtonDelete, ButtonCancelLeave, ButtonReqLeave, ButtonMarkPresent, ButtonMarkAbsent, ButtonMarkLate, ButtonMarkPermission } from "../button-permission";
import { cn } from "@/lib/utils";
import { PiSealWarning } from "react-icons/pi";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

type Data = Record<string, any>;

interface Columns {
  name: string;
  uid: string;
  sortable?: boolean;
}

interface DataTableProps {
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
  onCreate?: () => void;
  onView?: (data: object) => void;
  onEdit?: (data: object) => void;
  onDelete?: (id: number, loadData: () => void) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onCreateSchedule?: (data: object) => void;
  loadData?: () => void;
  onPermission?: (id: number) => void;
  onOpenFilter?: () => void;
  onReqLeave?: () => void;
  onCancelLeave?: (id: number) => void;
  onMarkPresent?: (data: object) => void;
  onMarkPermission?: (data: object) => void;
  onMarkLate?: (data: object) => void;
  onMarkAbsent?: (data: object) => void;
  // Permissions actions
  permissionCreate?: string;
  permissionEdit?: string;
  permissionView?: string;
  permissionDelete?: string;
  permissionRequest?: string;
  permissionApprove?: string;
  permissionReject?: string;
  permissionCancel?: string;
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
  customizes?:{
    header?: React.ReactNode;
    action?: React.ReactNode;
  }
  isFiltered?: boolean;
  loadingButton?: boolean;
}

const DataTable = ({
  dataApi,
  cols,
  visibleCols,
  status,
  selectRow = false,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange: controlledOnSelectionChange,
  lenghtOf,
  colKeys = [],
  short,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onCancelLeave,
  onCreateSchedule,
  onPermission,
  onOpenFilter,
  onReqLeave,
  onMarkPresent,
  onMarkPermission,
  onMarkLate,
  onMarkAbsent,
  isFiltered,
  loadData,
  permissionCreate,
  permissionEdit,
  permissionView,
  permissionDelete,
  permissionRequest,
  permissionCancel,
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
  scrollable = false,
  customizes,
  loadingButton = false,
}: DataTableProps) => {
  const { t } = useTranslation();
  const useToggle = useToggleStore((state) => state.isOpen);
  
  // Internal state for uncontrolled mode
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>(
    short || { column: "", direction: "ascending" },
  );

  const columns = React.useMemo(() => cols || [], [cols]);
  const statusOptions = React.useMemo(() => status || [], [status]);
  const data = React.useMemo(() => dataApi || [], [dataApi]);
  const INITIAL_VISIBLE_COLUMNS = visibleCols || [];

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledSelectedKeys !== undefined;
  const selectedKeys = isControlled ? controlledSelectedKeys : internalSelectedKeys;

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [columns, visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...data];
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filtered = filtered.filter(
        (item) =>
          item.status !== undefined &&
          Array.from(statusFilter).includes(String(item.status)),
      );
    }
    return filtered;
  }, [data, statusFilter, statusOptions.length]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Data, b: Data) => {
      const first = a[sortDescriptor.column as keyof Data];
      const second = b[sortDescriptor.column as keyof Data];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const statusColorMap = {
    Pending: "warning",
    Approved: "success",
    Rejected: "danger",
    Active: "success",
    Inactive: "danger",
    Cancelled: "secondary",
  };

  const renderCell = React.useCallback(
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
              color={data.status ? statusColorMap[data.status as keyof typeof statusColorMap] as any : undefined}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-1">
              {onView && (
                <ButtonView
                  permissionType={permissionView}
                  onPress={() => onView(data)}
                />
              )}
              {onEdit && (
                <ButtonEdit
                  permissionType={permissionEdit}
                  onPress={() => onEdit(data)}
                  content="Edit"
                  radius="full"
                  variant="light"
                  color="secondary"
                  tooltipColor="secondary"
                />
              )}
              {onDelete && loadData && (
                <ButtonDelete
                  confirmDelete={() => onDelete(data.id, loadData)}
                  id={data.id}
                  permissionType={permissionDelete}
                />
              )}
              {onCreateSchedule && (
                <Tooltip
                  showArrow
                  content={t("shedule")}
                  color="primary"
                  placement="top"
                  closeDelay={0}
                >
                  <Button
                    onPress={() => onCreateSchedule(data)}
                    startContent={<CiCalendar size={20}/>}
                    isIconOnly
                    variant="light"
                    color="primary"
                    radius="full"
                  />
                </Tooltip>
              )}
              {onPermission && (
                <Tooltip
                  showArrow
                  content={t("permission")}
                  color="primary"
                  placement="top"
                  closeDelay={0}
                >
                  <Button
                    variant="light"
                    color="primary"
                    radius="full"
                    size="sm"
                    onPress={() => onPermission(data.id)}
                    isIconOnly
                  >
                    <RiSettings6Line size={20} />
                  </Button>
                </Tooltip>
              )}
              {onApprove && loadData && (
                <Tooltip
                  showArrow
                  content={t(data.status === "Pending" ? "approve" : "approved")}
                  color="primary"
                  placement="top"
                  closeDelay={0}
                >
                  {data.status === "Pending" ? (
                    <Button
                      variant="light"
                      color="primary"
                      radius="full"
                      size="sm"
                      onPress={() => onApprove(data.id)}
                      isIconOnly
                      startContent={<RiCheckLine size={20} />}
                    />
                  ) : (
                    <Button
                      variant="light"
                      color="primary"
                      radius="full"
                      size="sm"
                      onPress={() => ShowToast({
                        title: "Approved",
                        description: "This leave request is already approved.",
                        color: "warning",
                        icon: <PiSealWarning size={20} />,
                      })}
                      className="opacity-50"
                      isIconOnly
                      startContent={<RiCheckLine size={20} />}
                    />
                  )}
                </Tooltip>
              )}
              {onReject && loadData && (
                <Tooltip
                  showArrow
                  content={t(data.status === "Pending" ? "reject" : "rejected")}
                  color="danger"
                  placement="top"
                  closeDelay={0}
                >
                  {data.status === "Pending" ? (
                    <Button
                      variant="light"
                      color="danger"
                      radius="full"
                      size="sm"
                      onPress={() => onReject(data.id)}
                      isIconOnly
                      startContent={<RiCloseLine size={20} />}
                    />
                  ) : (
                    <Button
                      variant="light"
                      color="danger"
                      radius="full"
                      size="sm"
                      onPress={() => ShowToast({
                        title: "Rejected",
                        description: "This leave request is already rejected.",
                        color: "warning",
                        icon: <PiSealWarning size={20} />,
                      })}
                      className="opacity-50"
                      isIconOnly
                      startContent={<RiCloseLine size={20} />}
                    />
                  )}
                </Tooltip>
              )}
              {
                permissionCancel && (
                 <ButtonCancelLeave
                    permissionType={permissionCancel}
                    onPress={() => onCancelLeave?.(data.id)}
                    isDisabled={data.status !== "Pending" || loadingButton}
                    isLoading={loadingButton}
                 />
                )
              }
              {
                permissionMarkPresent && (
                 <ButtonMarkPresent
                    permissionType={permissionMarkPresent}
                    onPress={() => onMarkPresent?.(data)}
                    isLoading={loadingButton}
                 />
                )
              }
              {
                permissionMarkAbsent && (
                 <ButtonMarkAbsent
                    permissionType={permissionMarkAbsent}
                    onPress={() => onMarkAbsent?.(data)}
                    isLoading={loadingButton}
                 />
                )
              }
              {
                permissionMarkLate && (
                 <ButtonMarkLate
                    permissionType={permissionMarkLate}
                    onPress={() => onMarkLate?.(data)}
                    isLoading={loadingButton}
                 />
                )
              }
              {
                permissionMarkPermission && (
                 <ButtonMarkPermission
                    permissionType={permissionMarkPermission}
                    onPress={() => onMarkPermission?.(data)}
                    isLoading={loadingButton}
                 />
                )
              }


              {customizes?.action}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [
      colKeys,
      onView,
      onEdit,
      onDelete,
      onApprove,
      onReject,
      loadData,
      permissionView,
      permissionEdit,
      permissionDelete,
      onPermission,
      onCreateSchedule,
      t,
    ],
  );

  const handleSelectionChange = React.useCallback((keys: Selection) => {
    if (isControlled) {
      controlledOnSelectionChange?.(keys);
    } else {
      setInternalSelectedKeys(keys);
    }
  }, [isControlled, controlledOnSelectionChange]);

  const capitalize = (s: string): string =>
    typeof s !== "string"
      ? String(s ?? "")
      : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const classNames = React.useMemo(
    () => ({
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
    }),
    [],
  );

  const handleScroll = (direction: "left" | "right") => {
    const tableContainer = document.querySelector(".ui-table-container");
    if (tableContainer) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tableContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-[35rem] ">
      <div className="flex flex-col gap-4">
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
                inputWrapper: 'bg-zinc-200 dark:bg-zinc-800 shadow-none focus:bg-zinc-200',
                input: "px-2 font-normal",
              }}
              radius="md"
              startContent={<CiSearch className="text-lg text-default-500" />}
            />
          </div>
          <div className="flex gap-2">
            {customizes?.header}
            {status && (
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    radius="md"
                    endContent={<FiChevronDown />}
                    size="sm"
                    variant="flat"
                    color={statusFilter === "all" ? "default" : "default"}
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
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize" closeOnSelect={false}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full flex", `bg-${statusColorMap[status.name as keyof typeof statusColorMap]}`)} />
                        {status.name}
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  radius="md"
                  endContent={<FiChevronDown />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                selectionMode="multiple"
                selectedKeys={visibleColumns}
                onSelectionChange={setVisibleColumns}
                classNames={{
                  base: "max-h-96 overflow-y-auto has-scrollbar"
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
            {onCreate && <ButtonAdd permissionType={permissionCreate} onPress={onCreate} />}
            {onReqLeave && <ButtonReqLeave permissionType={permissionRequest} onPress={onReqLeave} />}
          </div>
        </div>
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

      <div
        className={`
          has-scrollbar 
          h-[calc(100vh-19rem)] 
          overflow-hidden 
          overflow-x-auto 
          transition-all 
          duration-300
          ${useToggle ? "w-full max-w-full" : "max-w-full"}
        `}
      >
        {/* <ScrollShadow
          className="has-scrollbar ui-table-container h-full w-full"
          orientation="horizontal"
          offset={0}
          size={150}
        > */}
          <Table
            isCompact
            removeWrapper
            aria-label="Data Table"
            checkboxesProps={{ color: "primary" }}
            classNames={classNames}
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
              emptyContent={
                loading ? (
                  <div className="flex h-72 items-end justify-center">
                    <Spinner variant="spinner" size="sm" label={t("loading")} />
                  </div>
                ) : (
                  t("noData")
                )
              }
              items={sortedItems}
            >
              {(item) => (
                <TableRow key={item.id} >
                  {(columnKey) => (
                    <TableCell className="whitespace-nowrap">
                      {renderCell(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        {/* </ScrollShadow> */}
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
        {scrollable && (
          <div className="flex gap-2">
            <Button
              onPress={() => handleScroll("left")}
              isIconOnly
              radius="full"
              startContent={<IoChevronBackOutline />}
            />
            <Button
              onPress={() => handleScroll("right")}
              isIconOnly
              radius="full"
              startContent={<IoChevronForward />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;