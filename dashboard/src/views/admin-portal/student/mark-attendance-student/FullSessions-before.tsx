import { useCallback, useEffect, useMemo, useState, memo, useRef, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { Pagination, Spinner, Chip, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ShowToast, Button, Input } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { BiSave } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import { CiFilter, CiSearch } from "react-icons/ci";
import { IoChevronDown } from "react-icons/io5";
import { Popover, PopoverCloseWrapper, PopoverContent, PopoverTrigger } from "@/components/ui";
import View from "./View";
import Filter from "./Filter";
import { useStableCallback } from "@/hooks/useStableCallback";

// ==== Constants ==== 

const ATTENDANCE_STATUSES = ["1", "A", "P", "L", 0] as const;
const MAX_SESSIONS = 60;
const STATUS_CONFIG = {
  "1": { color: "bg-success/20 hover:bg-success/40 text-success", text: "P", label: "Present", ringColor: "ring-success" },
  A: { color: "bg-danger/20 hover:bg-danger/40 text-danger", text: "A", label: "Absent", ringColor: "ring-danger" },
  P: { color: "bg-primary/20 hover:bg-primary/40 text-primary", text: "Pe", label: "Permission", ringColor: "ring-primary" },
  L: { color: "bg-warning/20 hover:bg-warning/40 text-warning", text: "L", label: "Late", ringColor: "ring-warning" },
  default: { color: "bg-default/60 dark:hover:bg-default/40 dark:bg-default/20 hover:bg-default/70 text-default", text: "-", label: "Not Marked", ringColor: "ring-default" }
} as const;

// ==== Types ==== 

type AttendanceStatus = typeof ATTENDANCE_STATUSES[number];

type DataFilter = {
  faculty: number | null;
  field: number | null;
  classId: number | null;
  course: number | null;
  student: number | null;
  promotionNo: number | null;
  termNo: number | null;
  programType: string | null;
  gender: string | null;
  studentStatus: string | null;
  searchKeyword: string | null;
  page: number;
  limit: number;
};

interface AttendanceRow {
  id: number;
  student_id: number;
  student_code: string;
  student_name_kh: string;
  student_name_en: string;
  class_id: number;
  class_name: string;
  course_id: number;
  course_name_en: string;
  total_attended: number;
  total_sessions: number;
  [key: `s${number}`]: AttendanceStatus;
}

interface AttendanceCellProps {
  rowId: number;
  sessionKey: string;
  value: AttendanceStatus;
  onChange: (value: AttendanceStatus) => void;
  isChanged?: boolean;
  isUpdating?: boolean;
}

// ==== Utility Functions ==== 

const getStatusConfig = (status: AttendanceStatus) => 
  STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.default;

const getAttendanceColor = (attended: number, total: number): "success" | "warning" | "danger" | "default" => {
  if (total === 0) return "default";
  const ratio = attended / total;
  if (ratio >= 0.8) return "success";
  if (ratio >= 0.6) return "warning";
  return "danger";
};

// ==== Memoized Components ==== 

const AttendanceCell = memo(
  ({ value, onChange, isChanged, isUpdating }: AttendanceCellProps) => {
    const config = useMemo(() => getStatusConfig(value), [value]);
    const [localUpdating, setLocalUpdating] = useState(false);

    const handleClick = useStableCallback(
      async (status: AttendanceStatus, close: () => void) => {
        if (status === value) {
          close();
          return;
        }

        setLocalUpdating(true);
        requestAnimationFrame(() => {
          onChange(status);
          setLocalUpdating(false);
          // បិទបន្ទាប់ពី spinner តិចៗ
          setTimeout(close, 150);
        });
      }
    );

    return (
      <Popover>
        <PopoverTrigger>
          <button
            disabled={isUpdating || localUpdating}
            className={cn(
              "cursor-pointer w-7 h-7 rounded-full text-sm transition-all flex items-center justify-center relative",
              isChanged && "ring-1",
              (isUpdating || localUpdating) && "opacity-70",
              value === status && "ring-1 pointer-events-none disabled opacity-70",
              config.color,
              config.ringColor
            )}
          >
            {isUpdating || localUpdating ? (
              <Spinner size="sm" color="current" />
            ) : (
              config.text
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="bg-white dark:bg-black rounded-3xl shadow-lg p-2">
          <div className="flex gap-2">
            {ATTENDANCE_STATUSES.map((status) => {
              const s = getStatusConfig(status);
              return (
                <PopoverCloseWrapper key={status || "null"}>
                  {({ close }) => (
                    <Tooltip content={s.label} placement="bottom" size="sm" radius="full" color="primary" showArrow classNames={{base: 'pointer-events-none'}}>
                      <button
                        onClick={() => handleClick(status, close)}
                        disabled={isUpdating || localUpdating}
                        className={cn(
                          "w-8 h-8 rounded-[12px] font-semibold text-xs transition-all select-none cursor-pointer",
                          s.color,
                          value === status && "ring-1 pointer-events-none opacity-70"
                        )}
                        title={s.label}
                      >
                        {s.text}
                      </button>
                    </Tooltip>
                  )}
                </PopoverCloseWrapper>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);


AttendanceCell.displayName = "AttendanceCell";

const LegendChip = memo(({ color, label }: { color: "success" | "danger" | "primary" | "warning", label: string }) => (
  <Chip color={color} variant="dot" classNames={{ base: 'border-none' }}>
    <span>{label}</span>
  </Chip>
));

LegendChip.displayName = "LegendChip";

type TableRowProps = {
  row: AttendanceRow;
  rowNumber: number;
  changedCells: Map<string, AttendanceStatus>;
  updatingCells: Set<string>;
  handleCellChange: (rowId: number, sessionKey: string, value: AttendanceStatus) => void;
  handleViewDetails: (row: AttendanceRow) => void;
  t: any;
}

const TableRow = memo(({ row, rowNumber, changedCells,updatingCells,handleCellChange, handleViewDetails, t }: TableRowProps) =>
  {
  const attendedCount = row.total_attended ?? 0;
  const totalSessions = row.total_sessions ?? 0;
  const attendanceColor = useMemo(() => getAttendanceColor(attendedCount, totalSessions), [attendedCount, totalSessions]);

  return (
    <tr className="*:whitespace-nowrap">
      <td className="sticky left-0 px-4 py-1 text-sm bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm z-[40]">
        {rowNumber}
      </td>
      <td className="sticky left-12 px-4 py-1 text-sm bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm z-[40]">
        <div className="font-medium">{row.student_name_en || '-'}</div>
      </td>
      <td className="px-4 py-1 text-sm">
        {row.student_code || '-'}
      </td>
      <td className="px-4 py-1 text-sm">
        {row.course_name_en || '-'}
      </td>
      <td className="px-4 py-1 text-sm text-center">
        {totalSessions > 0 ? (
          <Chip
            color={attendanceColor}
            variant="flat"
            size="sm"
          >
            {attendedCount} / {totalSessions}
          </Chip>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      {Array.from({ length: MAX_SESSIONS }, (_, i) => {
        const sessionKey = `s${i + 1}` as keyof AttendanceRow;
        const sessionValue = row[sessionKey] as AttendanceStatus;
        const cellKey = `${row.id}_${sessionKey}`;
        
        return (
          <td key={sessionKey} className="px-2 py-1 text-center">
            <div className="flex justify-center">
              <AttendanceCell
                rowId={row.id}
                sessionKey={sessionKey}
                value={sessionValue}
                onChange={(value) => handleCellChange(row.id, sessionKey, value)}
                isChanged={changedCells.has(cellKey)}
                isUpdating={updatingCells.has(cellKey)}
              />
            </div>
          </td>
        );
      })}
      <td className="sticky right-0 z-10 px-4 py-1 text-center bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <Tooltip showArrow content={t("viewDetail")} color="success" placement="left" classNames={{base: "pointer-events-none"}} closeDelay={0} delay={0}>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => handleViewDetails(row)}
            color="success"
            radius="full"
          >
            <FiEye />
          </Button>
        </Tooltip>
      </td>
    </tr>
  );
});

TableRow.displayName = "TableRow";

// ==== Main Component ====

const FullSessions = () => {
  const { t } = useTranslation();

  // ==== State ====

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [viewRow, setViewRow] = useState<AttendanceRow | null>(null);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [changedCells, setChangedCells] = useState<Map<string, AttendanceStatus>>(new Map());
  const [updatingCells, setUpdatingCells] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  const prevSearchKeywordRef = useRef(debouncedSearchKeyword);
  const isFilteringRef = useRef(false);

  const defaultFilter: DataFilter = useMemo(() => ({
    faculty: null,
    field: null,
    classId: null,
    course: null,
    student: null,
    promotionNo: null,
    termNo: null,
    programType: null,
    gender: null,
    studentStatus: null,
    searchKeyword: null,
    sessionNo: null,
    page: 1,
    limit: 10,
  }), []);

  const [filter, setFilter] = useState<DataFilter>(defaultFilter);

  // ==== Modals ====

  const { isOpen: isOpenView, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== Data Fetching ====

  const shouldFetch = !isFiltered && debouncedSearchKeyword.trim() === "";
  
  const { data: fetchList, loading: fetchListLoading, refetch: refetchList } = useFetch<{ rows: AttendanceRow[]; total: number }>(
    "/admin/markattstudent/fullsessions",
    {
      params: { page: pagination.page, limit: pagination.limit },
      deps: [pagination.page, pagination.limit],
      enabled: shouldFetch,
    }
  );

  useEffect(() => {
    console.log("fetchList", fetchList);
    if (shouldFetch && fetchList?.data) {
      startTransition(() => {
        setRows(fetchList.data.rows || []);
        setTotalPage(Math.ceil((fetchList.data.total || 0) / pagination.limit) || 1);
      });
    }
  }, [fetchList, shouldFetch, pagination.limit]);

  // ==== Mutations ====

  const { mutate: filterData, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      startTransition(() => {
        setRows(response?.data?.rows || []);
        setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
        setIsFiltered(true);
        isFilteringRef.current = false;
      });
      onClose();
    },
    onError: (err) => {
      isFilteringRef.current = false;
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to apply filter",
      });
    },
  });

  const { mutate: saveAttendance, loading: saveLoading } = useMutation({
    onSuccess: () => {
      ShowToast({
        color: "success",
        title: "Success",
        description: "Attendance saved successfully",
      });
      setChangedCells(new Map());
      setUpdatingCells(new Set());
      if (!isFiltered) {
        refetchList();
      } else {
        refetch();
      }
    },
    onError: (err) => {
      setUpdatingCells(new Set());
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to save attendance",
      });
    },
  });

  // ==== Event Handlers ====

  const applyFilterWithPagination = useCallback(
    async (page: number) => {
    
      const payload: DataFilter = {
        faculty: filter.faculty ? parseInt(String(filter.faculty)) : null,
        field: filter.field ? parseInt(String(filter.field)) : null,
        classId: filter.classId ? parseInt(String(filter.classId)) : null,
        course: filter.course ? parseInt(String(filter.course)) : null,
        student: filter.student ? parseInt(String(filter.student)) : null,
        promotionNo: filter.promotionNo ? parseInt(String(filter.promotionNo)) : null,
        termNo: filter.termNo ? parseInt(String(filter.termNo)) : null,
        programType: filter.programType,
        gender: filter.gender,
        studentStatus: filter.studentStatus,
        searchKeyword: debouncedSearchKeyword?.trim() || null,
        page,
        limit: pagination.limit,
      };

      await filterData(`/admin/markattstudent/filterfullsessions`, payload, "POST");
    },
    [filter, pagination.limit, filterData, debouncedSearchKeyword, t]
  );

  const refetch = async () => {
    const payload: DataFilter = {
      faculty: filter.faculty ? parseInt(String(filter.faculty)) : null,
      field: filter.field ? parseInt(String(filter.field)) : null,
      classId: filter.classId ? parseInt(String(filter.classId)) : null,
      course: filter.course ? parseInt(String(filter.course)) : null,
      student: filter.student ? parseInt(String(filter.student)) : null,
      promotionNo: filter.promotionNo ? parseInt(String(filter.promotionNo)) : null,
      termNo: filter.termNo ? parseInt(String(filter.termNo)) : null,
      programType: filter.programType,
      gender: filter.gender,
      studentStatus: filter.studentStatus,
      searchKeyword: debouncedSearchKeyword?.trim() || null,
      page: pagination.page,
      limit: pagination.limit,
    };

    await filterData(`/admin/markattstudent/filterfullsessions`, payload, "POST");
  };

  useEffect(() => {
    const hasSearchKeywordChanged = prevSearchKeywordRef.current !== debouncedSearchKeyword;
    prevSearchKeywordRef.current = debouncedSearchKeyword;

    if (hasSearchKeywordChanged && (debouncedSearchKeyword.trim() !== "" || isFiltered)) {
      refetch();
    }
  }, [debouncedSearchKeyword, isFiltered, refetch]);

  const handleCellChange = useStableCallback(
    (rowId: number, sessionKey: string, value: AttendanceStatus) => {
      const cellKey = `${rowId}_${sessionKey}`;

      // Update state only for changed parts
      setChangedCells((prev) => {
        const next = new Map(prev);
        next.set(cellKey, value);
        return next;
      });

      setUpdatingCells((prev) => {
        const next = new Set(prev);
        next.add(cellKey);
        return next;
      });

      // Update only that row in rows
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, [sessionKey]: value } : row
        )
      );

      // Delay removing spinner lightly for better UX
      requestAnimationFrame(() => {
        setUpdatingCells((prev) => {
          const next = new Set(prev);
          next.delete(cellKey);
          return next;
        });
      });
    }
  );


  const handleSaveAttendance = useCallback(async () => {
    if (changedCells.size === 0) {
      ShowToast({ color: "warning", title: "Warning", description: "No changes to save" });
      return;
    }

    // Mark all changed cells as updating
    setUpdatingCells(new Set(changedCells.keys()));

    const groupedChanges = new Map<number, {
      classId: number;
      courseId: number;
      studentId: number;
      attData: { status: AttendanceStatus; session: string }[];
    }>();

    changedCells.forEach((value, key) => {
      const [rowId, sessionKey] = key.split("_");
      const attendanceId = parseInt(rowId);
      const row = rows.find(r => r.id === attendanceId);

      if (row) {
        if (!groupedChanges.has(attendanceId)) {
          groupedChanges.set(attendanceId, {
            classId: row.class_id,
            courseId: row.course_id,
            studentId: row.student_id,
            attData: [],
          });
        }
        groupedChanges.get(attendanceId)?.attData.push({ status: value || 0, session: sessionKey });
      }
    });

    const payload = {
      bulkData: Array.from(groupedChanges.entries()).map(([attendanceId, data]) => ({
        attendanceId,
        classId: data.classId,
        courseId: data.courseId,
        attData: data.attData,
      }))
    };

    await saveAttendance("/admin/markattstudent/markbulk", payload, "POST");
  }, [changedCells, rows, saveAttendance]);

  const handleView = useCallback(
    (row: any) => {
      setViewRow(row);
      onOpenView();
    },
    [onOpenView]
  );

  const onFilter = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  };

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setChangedCells(new Map());
    refetch();
  }, [defaultFilter]);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      if (isFiltered || debouncedSearchKeyword.trim() !== "") {
        await applyFilterWithPagination(newPage);
      }
    },
    [isFiltered, debouncedSearchKeyword, applyFilterWithPagination]
  );

  // === Memoized Values ===

  const sessionHeaders = useMemo(() => 
    Array.from({ length: MAX_SESSIONS }, (_, i) => (
      <th key={`s${i + 1}`} className="px-2 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 min-w-[50px]">
        S{i + 1}
      </th>
    ))
  , []);

  const isLoading = fetchListLoading || filterLoading;

  // === Render ===

  return (
    <div className={cn("space-y-4 h-full relative", isLoading && "pointer-events-none opacity-50")}>
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow || { student_id: 0, course_id: 0 }} />
      <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={onFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
        errors={errors}
        setErrors={setErrors}
        isBulkFilter={true}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          isClearable
          onClear={() => setSearchKeyword("")}
          startContent={<CiSearch className="text-zinc-500 dark:text-zinc-400" size={20} />}
          className="max-w-xs"
          classNames={{
            inputWrapper: 'bg-zinc-200 dark:bg-zinc-800'
          }}
        />

        <div className="flex gap-1 items-center">
          {changedCells.size > 0 && (
            <Chip color="warning" variant="flat" size="lg" radius="md" classNames={{base: 'py-1.5'}}>
              ({changedCells.size}) {t("unsavedChanges")}
            </Chip>
          )}
          <Button
            color="secondary"
            startContent={!saveLoading && <BiSave size={20} />}
            onClick={handleSaveAttendance}
            isLoading={saveLoading}
            isDisabled={changedCells.size === 0}
            spinner={
              <Spinner variant="spinner" color="white" size="sm" />
            }
          >
            {t("save")}
          </Button>
          <Button color="primary" startContent={<CiFilter size={20} />} onClick={onOpen} isDisabled={changedCells.size > 0 ? true : false}>
            {t("filter")}
          </Button>
        </div>
      </div>


      {/* Legend */}
      <div className="flex gap-4 items-center text-sm">
        <span className="font-semibold">{t("legend")}:</span>
        <div className="flex gap-3">
          <LegendChip color="success" label="Present (P)" />
          <LegendChip color="danger" label="Absent (A)" />
          <LegendChip color="primary" label="Permission (Pe)" />
          <LegendChip color="warning" label="Late (L)" />
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-10">
        <div className="overflow-x-auto pb-10 has-scrollbar h-[calc(100vh-340px)] ">
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center h-full ">
              <Spinner variant="gradient" size="sm" color="primary" label={t("loading")} />
            </div>
          )}
          <table className="w-full border-collapse border-spacing-0">
            <thead className="sticky top-0 z-[41] bg-zinc-100 dark:bg-zinc-900 border-b-2 border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="sticky left-0 z-30 bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 ">
                  {t("no")}
                </th>
                <th className="sticky left-12 z-30 bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 min-w-[120px] ">
                  {t("studentName")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 min-w-[120px]">
                  {t("studentCode")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 min-w-[180px]">
                  {t("course")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 min-w-[120px] whitespace-nowrap">
                  {t("attended")} / {t("total")}
                </th>
                {sessionHeaders}
                <th className="sticky right-0 z-30 px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.map((row, idx) => {
                if (!row?.id) return null;
                const rowNumber = (pagination.page - 1) * pagination.limit + idx + 1;
                
                return (
                  <TableRow
                    key={row.id}
                    row={row}
                    rowNumber={rowNumber}
                    changedCells={changedCells}
                    updatingCells={updatingCells}
                    handleCellChange={handleCellChange}
                    handleViewDetails={handleView}
                    t={t}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-start items-center">
        {/* Pagination */}
        {totalPage > 1 && (
          <Pagination
            total={totalPage}
            page={pagination.page}
            onChange={handlePageChange}
            showControls
            color="primary"
            size="sm"
            variant="light"
          />
            
        )}
        <Dropdown>
          <DropdownTrigger>
            <Button color="primary" variant="faded" size="sm" endContent={<IoChevronDown size={16} />}>
              {pagination.limit}
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="10" onClick={() => setPagination((prev) => ({ ...prev, limit: 10 }))}>
              10
            </DropdownItem>
            <DropdownItem key="20" onClick={() => setPagination((prev) => ({ ...prev, limit: 20 }))}>
              20
            </DropdownItem>
            <DropdownItem key="50" onClick={() => setPagination((prev) => ({ ...prev, limit: 50 }))}>
              50
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default FullSessions;