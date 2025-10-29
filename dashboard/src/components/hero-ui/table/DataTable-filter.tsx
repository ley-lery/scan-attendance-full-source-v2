import React, { type SVGProps, memo, useMemo, useCallback, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, type Selection, type ChipProps, type SortDescriptor, Input, Pagination, Spinner, Tooltip, Select, SelectItem } from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, ShowToast, Button } from "@/components/hero-ui";
import { Popover, PopoverTrigger, PopoverContent, PopoverCloseWrapper } from "@/components/ui";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { CiCalendar, CiFilter, CiSearch } from "react-icons/ci";
import { RiCheckLine, RiCloseLine, RiFilter2Fill, RiSettings6Line } from "react-icons/ri";
import { ButtonAdd, ButtonEdit, ButtonView, ButtonDelete, ButtonCancelLeave, ButtonReqLeave, ButtonMarkPresent, ButtonMarkAbsent, ButtonMarkLate, ButtonMarkPermission } from "../button-permission";
import { cn } from "@/lib/utils";
import { PiSealWarning } from "react-icons/pi";
import { useRenderCount } from "@/hooks/testing-render/useRenderCount";
import { AnimatePresence, motion } from "framer-motion";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline, IoOptions, IoCloseCircleOutline } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TiFilter } from "react-icons/ti";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

type Data = Record<string, any>;

interface Columns {
  name: string;
  uid: string;
  sortable?: boolean;
  filter?: boolean;
  filterType?: "text" | "number" | "autocomplete" | "select";
  filterOptions?: { label: string; value: string }[]; // For autocomplete/select
  label?: string; // For autocomplete display field
  value?: string; // For autocomplete value field
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
  rowKey?: string; 
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
  // Permissions
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
  customizes?: {
    header?: React.ReactNode;
    action?: React.ReactNode;
  };
  isFiltered?: boolean;
  loadingButton?: boolean;
  isPending?: boolean;
  filterSection?: React.ReactNode;
  showFilterSection?: boolean;
  // Column Filters
  onColumnFilter?: (filters: Record<string, any>) => void;
  columnFilters?: Record<string, any>;
}

// Memoize status color map
const STATUS_COLOR_MAP: Record<string, ChipProps["color"]> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
  Active: "success",
  Inactive: "danger",
  Cancelled: "secondary",
  Transferred: "warning",
  Complete: "secondary",
};

//  Memoize class names
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

// Column Filter Component
interface ColumnFilterProps {
  column: Columns;
  value: any;
  onChange: (value: any) => void;
  onApply: () => void;
  onClear: () => void;
  loading?: boolean;
}

const ColumnFilter = memo(({ column, value, onChange, onApply, onClear, loading }: ColumnFilterProps) => {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(value || "");

  const handleApply = useCallback(() => {
    onChange(localValue);
    onApply();
  }, [localValue, onChange, onApply]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
    onClear();
  }, [onChange, onClear]);

  const renderFilterInput = () => {
    switch (column.filterType) {
      case "number":
        return (
          <Input
            type="number"
            size="sm"
            placeholder={`Filter by ${column.name}`}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            classNames={{
              inputWrapper: "bg-zinc-100 dark:bg-zinc-800",
            }}
          />
        );
      
      case "autocomplete":
      case "select":
        return (
          <Select
            size="sm"
            placeholder={`Select ${column.name}`}
            selectedKeys={localValue ? [localValue] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              setLocalValue(selected || "");
            }}
            classNames={{
              trigger: "bg-zinc-100 dark:bg-zinc-800",
            }}
          >
            {(column.filterOptions || []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      
      case "text":
      default:
        return (
          <Input
            type="text"
            size="sm"
            placeholder={`Filter by ${column.name}`}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            classNames={{
              inputWrapper: "bg-zinc-100 dark:bg-zinc-800",
            }}
          />
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <button
          type="button"
          className={cn(
            "ml-2 p-1 rounded-full transition-colors duration-150",
            loading && "opacity-50 cursor-not-allowed",
            value
              ? "text-primary hover:bg-primary/10"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
        >
          {value ? <FaCircleCheck size={14} /> : <TiFilter size={16} />}
        </button>
      </PopoverTrigger>

      <PopoverContent className="min-w-60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm shadow-xl shadow-zinc-300/50 dark:shadow-transparent rounded-2xl p-3">
        <PopoverCloseWrapper>
          {({ close }) => (
            <>
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                Filter {column.name}
              </div>
              
              <div className="mb-3">
                {renderFilterInput()}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    handleClear();
                    close();
                  }}
                  className="w-full"
                  color="danger"
                  variant="flat"
                  size="sm"
                  isDisabled={!localValue || loading}
                  startContent={<IoCloseCircleOutline size={20} />}
                >
                  {t("clear")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    handleApply();
                    close();
                  }}
                  className="w-full"
                  color="primary"
                  size="sm"
                  isDisabled={loading}
                  startContent={<IoCheckmarkCircleOutline size={20} />}
                >
                  {t("apply")}
                </Button>
              </div>
            </>
          )}
        </PopoverCloseWrapper>
      </PopoverContent>
    </Popover>
  );
});

ColumnFilter.displayName = 'ColumnFilter';

// Separate ActionButtons component (unchanged)
interface ActionButtonsProps {
  data: Data;
  onView?: (data: object) => void;
  onEdit?: (data: object) => void;
  onDelete?: (id: number, loadData: () => void) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onCreateSchedule?: (data: object) => void;
  onPermission?: (id: number) => void;
  onCancelLeave?: (id: number) => void;
  onMarkPresent?: (data: object) => void;
  onMarkAbsent?: (data: object) => void;
  onMarkLate?: (data: object) => void;
  onMarkPermission?: (data: object) => void;
  loadData?: () => void;
  permissionView?: string;
  permissionEdit?: string;
  permissionDelete?: string;
  permissionCancel?: string;
  permissionMarkPresent?: string;
  permissionMarkAbsent?: string;
  permissionMarkLate?: string;
  permissionMarkPermission?: string;
  loadingButton?: boolean;
  customAction?: React.ReactNode;
  t: any;
}

const ActionButtons = memo(({
  data,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onCreateSchedule,
  onPermission,
  onCancelLeave,
  onMarkPresent,
  onMarkAbsent,
  onMarkLate,
  onMarkPermission,
  loadData,
  permissionView,
  permissionEdit,
  permissionDelete,
  permissionCancel,
  permissionMarkPresent,
  permissionMarkAbsent,
  permissionMarkLate,
  permissionMarkPermission,
  loadingButton,
  customAction,
  t,
}: ActionButtonsProps) => {
  const handleApproveClick = useCallback(() => {
    if (data.status === "Pending" && onApprove) {
      onApprove(data.id);
    } else {
      ShowToast({ title: "Approved", description: "Cannot approve this leave request.", color: "warning", icon: <PiSealWarning size={20} /> });
    }
  }, [data.status, data.id, onApprove]);

  const handleRejectClick = useCallback(() => {
    if (data.status === "Pending" && onReject) {
      onReject(data.id);
    } else {
      ShowToast({ title: "Rejected", description: "Cannot reject this leave request.", color: "warning", icon: <PiSealWarning size={20} /> });
    }
  }, [data.status, data.id, onReject]);

  return (
    <div className="relative flex items-center justify-center gap-1">
      {onView && (<ButtonView permissionType={permissionView} onPress={() => onView(data)} /> )}
      {onEdit && (<ButtonEdit permissionType={permissionEdit} onPress={() => onEdit(data)} content="Edit" radius="full" variant="light" color="secondary" tooltipColor="secondary" /> )}
      {onDelete && loadData && (<ButtonDelete confirmDelete={() => onDelete(data.id, loadData)} id={data.id} permissionType={permissionDelete} /> )}
      {onCreateSchedule && (
        <Tooltip showArrow content={t("shedule")} color="primary" placement="top" closeDelay={0} >
          <Button onPress={() => onCreateSchedule(data)} startContent={<CiCalendar size={20} />} isIconOnly variant="light" color="primary" radius="full" />
        </Tooltip>
      )}
      {onPermission && (
        <Tooltip showArrow content={t("permission")} color="primary" placement="top" closeDelay={0} >
          <Button variant="light" color="primary" radius="full" size="sm" onPress={() => onPermission(data.id)} isIconOnly>
            <RiSettings6Line size={20} />
          </Button>
        </Tooltip>
      )}
      {onApprove && loadData && (
        <Tooltip showArrow content={t(data.status === "Pending" ? "approve" : "approved")} color="primary" placement="top" closeDelay={0} >
          <Button variant="light" color="primary" radius="full" size="sm" onPress={handleApproveClick} isIconOnly className={data.status !== "Pending" ? "opacity-50" : ""} startContent={<IoCheckmarkCircleOutline size={20} />} />
        </Tooltip>
      )}
      {onReject && loadData && (
        <Tooltip showArrow content={t(data.status === "Pending" ? "reject" : "rejected")} color="danger" placement="top" closeDelay={0} >
          <Button variant="light" color="danger" radius="full" size="sm" onPress={handleRejectClick} isIconOnly className={data.status !== "Pending" ? "opacity-50" : ""} startContent={<IoIosCloseCircleOutline size={20} />}/>
        </Tooltip>
      )}
      {permissionCancel && (
        <ButtonCancelLeave permissionType={permissionCancel} onPress={() => onCancelLeave?.(data.id)} isDisabled={data.status !== "Pending" || loadingButton} isLoading={loadingButton} />
      )}
      {permissionMarkPresent && (
        <ButtonMarkPresent permissionType={permissionMarkPresent} onPress={() => onMarkPresent?.(data)} isLoading={loadingButton}/>
      )}
      {permissionMarkAbsent && (
        <ButtonMarkAbsent permissionType={permissionMarkAbsent} onPress={() => onMarkAbsent?.(data)} isLoading={loadingButton}/>
      )}
      {permissionMarkLate && (
        <ButtonMarkLate permissionType={permissionMarkLate} onPress={() => onMarkLate?.(data)} isLoading={loadingButton}/>
      )}
      {permissionMarkPermission && (
        <ButtonMarkPermission permissionType={permissionMarkPermission} onPress={() => onMarkPermission?.(data)} isLoading={loadingButton}/>
      )}
      {customAction}
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

// TableControls component (unchanged)
interface TableControlsProps {
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
  onCreate?: () => void;
  onReqLeave?: () => void;
  permissionCreate?: string;
  permissionRequest?: string;
  customHeader?: React.ReactNode;
  isLoading?: boolean;
  openFilter?: () => void;
  showFilterSection?: boolean;
  t: any;
}

const TableControls = memo(({
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
  onCreate,
  onReqLeave,
  permissionCreate,
  permissionRequest,
  customHeader,
  isLoading,
  openFilter,
  showFilterSection,
  t,
}: TableControlsProps) => {
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
          startContent={isLoading ? <Spinner size="sm" variant="default" color="warning"/> : <CiSearch className="text-lg text-default-500" />}
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
        {
          showFilterSection && (
            <Button
              onPress={openFilter}
              radius="md"
              color="primary"
              startContent={<IoOptions size={18} />}
              variant="flat"
              isDisabled={isLoading}
            >
              {t("filter")}
            </Button>
          )
        }
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
  );
});

TableControls.displayName = 'TableControls';

// MAIN COMPONENT
const DataTable = memo(({
  dataApi = [],
  cols = [],
  visibleCols = [],
  status,
  selectRow = false,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange: controlledOnSelectionChange,
  lenghtOf = "items",
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
  isFiltered = false,
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
  customizes,
  loadingButton = false,
  isPending = false,
  rowKey = "id",
  filterSection,
  showFilterSection,
  onColumnFilter,
  columnFilters = {},
}: DataTableProps) => {

  useRenderCount("DataTable");

  const { t } = useTranslation();

  // Memoize initial states
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(
    short || { column: "", direction: "ascending" }
  );
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(visibleCols));
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [localColumnFilters, setLocalColumnFilters] = useState<Record<string, any>>(columnFilters);

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

  // Handle column filter changes
  const handleColumnFilterChange = useCallback((columnUid: string, value: any) => {
    const newFilters = { ...localColumnFilters, [columnUid]: value };
    setLocalColumnFilters(newFilters);
  }, [localColumnFilters]);

  const handleApplyColumnFilter = useCallback(() => {
    if (onColumnFilter) {
      onColumnFilter(localColumnFilters);
    }
  }, [localColumnFilters, onColumnFilter]);

  const handleClearColumnFilter = useCallback((columnUid: string) => {
    const newFilters = { ...localColumnFilters };
    delete newFilters[columnUid];
    setLocalColumnFilters(newFilters);
    if (onColumnFilter) {
      onColumnFilter(newFilters);
    }
  }, [localColumnFilters, onColumnFilter]);

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

  //  Memoize sorted items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Data, b: Data) => {
      const first = a[sortDescriptor.column as keyof Data];
      const second = b[sortDescriptor.column as keyof Data];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  // Memoize renderCell with useCallback
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
            <ActionButtons
              data={data}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onApprove={onApprove}
              onReject={onReject}
              onCreateSchedule={onCreateSchedule}
              onPermission={onPermission}
              onCancelLeave={onCancelLeave}
              onMarkPresent={onMarkPresent}
              onMarkAbsent={onMarkAbsent}
              onMarkLate={onMarkLate}
              onMarkPermission={onMarkPermission}
              loadData={loadData}
              permissionView={permissionView}
              permissionEdit={permissionEdit}
              permissionDelete={permissionDelete}
              permissionCancel={permissionCancel}
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
      onEdit,
      onDelete,
      onApprove,
      onReject,
      onCreateSchedule,
      onPermission,
      onCancelLeave,
      onMarkPresent,
      onMarkAbsent,
      onMarkLate,
      onMarkPermission,
      loadData,
      permissionView,
      permissionEdit,
      permissionDelete,
      permissionCancel,
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
    <div className="relative flex flex-col h-full">
      <div className={cn("flex flex-col gap-4 flex-shrink-0", loading && "opacity-50")}>
        <TableControls
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
          onCreate={onCreate}
          onReqLeave={onReqLeave}
          permissionCreate={permissionCreate}
          permissionRequest={permissionRequest}
          customHeader={customizes?.header}
          isLoading={loading}
          openFilter={() => setIsOpenFilter(!isOpenFilter)}
          showFilterSection={showFilterSection}
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

      {/* Filter block  */}
      <AnimatePresence>
        {
          isOpenFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full border-y border-zinc-200 dark:border-zinc-800"
            >
              <div className="py-2">
                <div className="w-full h-full rounded-full bg-zinc-300/40 dark:bg-zinc-800 p-1">
                  {filterSection}
                </div>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence>

      {/* Loading */}
      {loading && !isPending  && (
        <div className="absolute inset-0 z-40 flex items-center justify-center ">
          <Spinner size="sm" variant="gradient" color="primary" label={t("loading")} classNames={{label: 'text-xs'}}/>
        </div>
      )}
      <div className={cn(
        "flex-1 has-scrollbar overflow-hidden overflow-x-auto transition-all duration-300 my-4",
        loading && "opacity-50"
      )}>        
        <Table
          isCompact
          removeWrapper
          aria-label="Data Table"
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
                <div className="flex items-center">
                  <span>{column.name}</span>
                  {column.filter && (
                    <ColumnFilter
                      column={column}
                      value={localColumnFilters[column.uid]}
                      onChange={(value) => handleColumnFilterChange(column.uid, value)}
                      onApply={handleApplyColumnFilter}
                      onClear={() => handleClearColumnFilter(column.uid)}
                      loading={loading}
                    />
                  )}
                </div>
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={!loading && t("noData")}
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item[rowKey]} >
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
      <div className={cn(
        "flex items-center justify-between flex-shrink-0 pt-4 ",
        loading && "opacity-50",
      )}>        
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

DataTable.displayName = 'DataTable';

export default DataTable;