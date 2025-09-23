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
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  type Selection,
  type ChipProps,
  type SortDescriptor,
  Input,
  Pagination,
  Spinner,
  Tooltip,
  ScrollShadow,
  // Popover,
  // PopoverTrigger,
  // PopoverContent,
} from "@heroui/react";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { CiCalendar, CiSearch } from "react-icons/ci";
import { RiSettings6Line } from "react-icons/ri";
import { useToggleStore } from "@/stores/userToggleStore";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import ButtonDelete from "../button/ButtonDelete";
import ButtonEdit from "../button/ButtonEdit";
import ButtonView from "../button/ButtonView";
import ButtonAdd from "../button/ButtonAdd";
// import { FaFilter } from "react-icons/fa6";

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
  onCreate?: () => void;
  onView?: (data: object) => void;
  onEdit?: (data: object) => void;
  onDelete?: (id: number, loadData: () => void) => void;
  onCreateSchedule?: (data: object) => void;
  loadData?: () => void;
  onPermission?: (permission: string) => void;
  permissionCreate?: string;
  permissionEdit?: string;
  permissionView?: string;
  permissionDelete?: string;
  searchKeyword?: string;
  onSearchInputChange?: React.ChangeEventHandler<HTMLInputElement>;
  initialPage?: number;
  totalPages?: number;
  page?: number;
  onChangePage?: (page: number) => void;
  handleSearch?: () => void;
  handleClearSearch?: () => void;
  loading?: boolean;
  scrollable?: boolean;
}

const DataTable = ({
  dataApi,
  cols,
  visibleCols,
  status,
  selectRow = false,
  lenghtOf,
  colKeys = [],
  short,
  onCreate,
  onView,
  onEdit,
  onDelete,
  onCreateSchedule,
  onPermission,
  loadData,
  permissionCreate,
  permissionEdit,
  permissionView,
  permissionDelete,
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
}: DataTableProps) => {
  const { t } = useTranslation();
  const useToggle = useToggleStore((state) => state.isOpen);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
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
              // color={data.status ? statusColorMap[data.status] : undefined}
              size="sm"
              color={
                data.status === "Active"
                  ? "success"
                  : data.status === "Inactive"
                    ? "danger"
                    : "default"
              }
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
                  onPress={() => {
                    onEdit(data);
                    // alert(`Editing ${data}`);
                  }}
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
                    size="md"
                    onPress={() => onPermission(data.permission)}
                    isIconOnly
                  >
                    <RiSettings6Line size={20} />
                  </Button>
                </Tooltip>
              )}
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
      loadData,
      permissionView,
      permissionEdit,
      permissionDelete,
      onPermission,
      t,
    ],
  );

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
    }),
    [],
  );

  // handle scrollable
  const handleScroll = (direction: "left" | "right") => {
    const tableContainer = document.querySelector(".ui-table-container");
    if (tableContainer) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tableContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  return (
    <div className="relative h-[35rem]">
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
                inputWrapper:
                  "border-default-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 bg-default-50 border border-default-200 dark:bg-white/10 shadow-none",
                input: "px-2 font-normal",
              }}
              startContent={<CiSearch className="text-lg text-default-500" />}
            />
          </div>
          <div className="flex gap-2">
            {status && (
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    className="px-[1.2rem] py-[1.1rem] text-[.8rem]"
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
                    <DropdownItem key={status.uid} className="capitalize">
                      {capitalize(status.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="px-[1.2rem] py-[1.1rem] text-[.8rem]"
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
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <ButtonAdd permissionType={permissionCreate} onPress={onCreate} />
          </div>
        </div>
        <span className="text-small text-default-400">
          Total {sortedItems.length} {lenghtOf}
        </span>
      </div>
      <div
        className={`${useToggle ? "w-[1415px]" : "w-[1200px]"} has-scrollbar h-full w-[1200px] overflow-hidden overflow-x-auto transition-all duration-300 3xl:w-full`}
      >
        <ScrollShadow
          className="has-scrollbar ui-table-container h-full w-full"
          orientation="horizontal"
          offset={0}
          size={150}
        >
          <Table
            isCompact
            removeWrapper
            aria-label="Simple Table"
            checkboxesProps={{ color: "primary" }}
            classNames={classNames}
            selectionMode={selectRow ? "multiple" : "none"}
            selectedKeys={selectRow ? selectedKeys : undefined}
            sortDescriptor={sortDescriptor}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  className="text-xs capitalize"
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                  {/* <div className="flex items-center gap-2">
                  <div>
                  </div>
                  <Popover placement="bottom" showArrow>
                    <PopoverTrigger>
                      <Button variant="light" radius="full" size="sm" isIconOnly startContent={<FaFilter />}/>
                    </PopoverTrigger>
                    <PopoverContent className="p-2 rounded-md border border-default-200  ">
                      <div>
                        <Input placeholder="Filter" size="sm" radius="sm"/>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div> */}
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
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollShadow>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Pagination
          initialPage={initialPage}
          variant="light"
          total={totalPages}
          page={page}
          onChange={onChangePage}
          showControls
          hidden={totalPages < 2}
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
