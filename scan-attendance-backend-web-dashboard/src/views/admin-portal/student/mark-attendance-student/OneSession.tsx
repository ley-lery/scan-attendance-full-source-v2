// Mark Attendance
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, type Selection } from "@heroui/react";
import { DataTable, ShowToast, Button } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { MdFilterTiltShift } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import View from "./View";
import Filter from "./Filter";

// Types

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
  sessionNo?: string | null;
  page: number;
  limit: number;
};

type AttendanceStatus = "1" | "A" | "P" | "L";

type MarkMultiAttendanceData = {
  classId: number | null;
  course: number | null;
};

// Custom Hooks Modal Closure
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenView: isOpen, onOpenView: onOpen, onCloseView: onClose };
};


const Index = () => {
  const { t } = useTranslation();

  // ==== Modal State ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [viewRow, setViewRow] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Selection>(new Set([]));
  const [session, setSession] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [markMultiAttendanceData, setMarkMultiAttendanceData] = useState<Partial<MarkMultiAttendanceData>>({
    classId: null,
    course: null,
  });

  // ==== Pagination ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Default Filter ====
  const defaultFilter: DataFilter = useMemo(
    () => ({
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
      sessionNo: "s1",
      page: 1,
      limit: 10,
    }),
    []
  );
  const [filter, setFilter] = useState<DataFilter>(defaultFilter);



  // ================= Start Data Fetching Block =================

  const { data: fetchList, loading: fetchListLoading } = useFetch<{ rows: any[]; total_count: number }>(
    "/admin/markattstudent/list",
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
      },
      deps: [pagination.page, pagination.limit],
      enabled: !isFiltered && debouncedSearchKeyword.trim() === "",
    }
  );

  useEffect(() => {
    if (!isFiltered && fetchList?.data && debouncedSearchKeyword.trim() === "") {
      if (fetchList.data.rows.length > 0) {
        setMarkMultiAttendanceData({
          classId: fetchList.data.rows[0].class_id,
          course: fetchList.data.rows[0].course_id,
        });
        setSession(fetchList.data.rows[0].session_name);
      }
      setRows(fetchList.data.rows || []);
      setTotalPage(Math.ceil((fetchList.data.total || 0) / pagination.limit) || 1);
    }
  }, [fetchList, isFiltered, pagination.limit, debouncedSearchKeyword]);

  // Auto-trigger search when debounced keyword changes
  useEffect(() => {
    if (debouncedSearchKeyword.trim() !== "" || isFiltered) {
      refetch();
    }
  }, [debouncedSearchKeyword]);

  // ================= End Data Fetching Block =================



  // ================= Start Table Configuration Block =================
  const cols = useMemo(
    () => [
      { name: t("no"), uid: "id", sortable: true },
      { name: t("facultyNameKh"), uid: "faculty_name_kh", sortable: true },
      { name: t("facultyNameEn"), uid: "faculty_name_en", sortable: true },
      { name: t("fieldNameKh"), uid: "field_name_kh", sortable: true },
      { name: t("fieldNameEn"), uid: "field_name_en", sortable: true },
      { name: t("courseNameKh"), uid: "course_name_kh", sortable: true },
      { name: t("courseNameEn"), uid: "course_name_en", sortable: true },
      { name: t("courseCode"), uid: "course_code", sortable: true },
      { name: t("studentCode"), uid: "student_code", sortable: true },
      { name: t("studentNameKh"), uid: "student_name_kh", sortable: true },
      { name: t("studentNameEn"), uid: "student_name_en", sortable: true },
      { name: t("dob"), uid: "dob", sortable: true },
      { name: t("gender"), uid: "gender", sortable: true },
      { name: t("email"), uid: "email", sortable: false },
      { name: t("phoneNumber"), uid: "phone_number", sortable: false },
      { name: t("class"), uid: "class_name", sortable: true },
      { name: t("room"), uid: "room_name", sortable: true },
      { name: t("programType"), uid: "program_type", sortable: true },
      { name: t("promotionNo"), uid: "promotion_no", sortable: true },
      { name: t("termNo"), uid: "term_no", sortable: true },
      { name: t("session"), uid: "session_name", sortable: true },
      { name: t("attendanceStatus"), uid: "attendance_status", sortable: true },
      { name: t("actions"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = [
    "id",
    "course_name_en",
    "student_name_en",
    "student_name_kh",
    "gender",
    "dob",
    "email",
    "phone_number",
    "class_name",
    "room_name",
    "session_name",
    "attendance_status",
    "actions",
  ];


  // ================= End Table Configuration Block =================



  // ================= Start Mutations Block =================

  const { mutate: markAttendance, loading: markAttendanceLoading } = useMutation({
    onSuccess: (response) => {
      ShowToast({
        color: "success",
        title: "Success",
        description: response?.response?.data?.message || "Mark attendance successfully",
      });
      refetch();
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err?.response?.data?.message || "Failed to mark attendance",
      });
    },
  });

  const { mutate: multiAction, loading: multiActionLoading } = useMutation({
    onSuccess: async (res) => {
      await refetch();
      setSelectedIds(new Set([]));
      ShowToast({
        color: "success",
        title: "Success",
        description: res?.message[0]?.message,
      });
    },
    onError: (err) => {
      console.log(err, "err");
      ShowToast({
        color: "error",
        title: "Error",
        description: err.response?.data?.message ,
      });
    },
  });

  const { mutate: filterData, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      if (response?.data?.rows?.length > 0) {
        setMarkMultiAttendanceData({
          classId: response.data.rows[0].class_id,
          course: response.data.rows[0].course_id,
        });
        setSession(response.data.rows[0].session_name);
      }
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
      setIsFiltered(true);
      onClose();
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to apply filter",
      });
    },
  });

  // ================= End Mutations Block =================


  // ================= Start Event Handlers Block =================

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleView = useCallback(
    (row: any) => {
      setViewRow(row);
      onOpenView();
    },
    [onOpenView]
  );

  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedIds(keys);
  }, []);

  // ================= End Event Handlers Block =================


  // ================= Start Single Mark Attendance Block =================

  const sessionNumber = parseInt(session.replace(/^s/, ""), 10);

  const onMarkPresent = useCallback(
    async (data: any) => {
      const payload = {
        classId: data.class_id,
        course: data.course_id,
        student: data.student_id,
        session: sessionNumber,
        status: "1",
      };
      await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");
    },
    [sessionNumber, markAttendance]
  );

  const onMarkAbsent = useCallback(
    async (data: any) => {
      const payload = {
        classId: data.class_id,
        course: data.course_id,
        student: data.student_id,
        session: sessionNumber,
        status: "A",
      };
      await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");
    },
    [sessionNumber, markAttendance]
  );

  const onMarkLate = useCallback(
    async (data: any) => {
      const payload = {
        classId: data.class_id,
        course: data.course_id,
        student: data.student_id,
        session: sessionNumber,
        status: "L",
      };
      await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");
    },
    [sessionNumber, markAttendance]
  );

  const onMarkPermission = useCallback(
    async (data: any) => {
      const payload = {
        classId: data.class_id,
        course: data.course_id,
        student: data.student_id,
        session: sessionNumber,
        status: "P",
      };
      await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");
    },
    [sessionNumber, markAttendance]
  );

  // ================= End Single Mark Attendance Block =================


  // ================= Start Multi Mark Attendance Block =================

  const onMultiMarkAttendance = useCallback(
    async (status: AttendanceStatus) => {
      let ids: number[];

      if (selectedIds === "all") {
        ids = rows.map((row) => Number(row.id));

      } else {
        ids = Array.from(selectedIds).map((id) => Number(id));
      }

      const attendanceData = ids.map((id) => ({
        classAtt: Number(id),
        status: status,
      }));


      const payload = {
        classId: Number(markMultiAttendanceData.classId),
        course: Number(markMultiAttendanceData.course),
        session: sessionNumber,
        attData: attendanceData,
      };

      console.log(payload)


      await multiAction(`/admin/markattstudent/markmulti`, payload, "POST");
    },
    [selectedIds, rows, markMultiAttendanceData, sessionNumber, multiAction]
  );

  const onSetPresentStatus = () => onMultiMarkAttendance("1");
  const onSetAbsentStatus = () => onMultiMarkAttendance("A");
  const onSetLateStatus = () => onMultiMarkAttendance("L");
  const onSetPermissionStatus = () => onMultiMarkAttendance("P");

  // ================= End Multi Mark Attendance Block =================


  // ================= Start Filter Block =================

  const FilterData = (formData: DataFilter, t: (key: string) => string) => {
    const newErrors: Record<string, string> = {};

    if (!formData.sessionNo?.trim()) {
      newErrors.sessionNo = t("validation.required");
    }

    return newErrors;
  };

  const applyFilterWithPagination = useCallback(
    async (page: number) => {
      const validationErrors = FilterData(filter, t);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        ShowToast({
          color: "warning",
          title: "Warning",
          description: "Please select a session to apply filter",
        });
        return false;
      }

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
        sessionNo: filter.sessionNo ? String(filter.sessionNo) : null,
        page: page,
        limit: pagination.limit,
      };

      await filterData(`/admin/markattstudent/filter`, payload, "POST");
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
      sessionNo: filter.sessionNo ? String(filter.sessionNo) : null,
      page: pagination.page,
      limit: pagination.limit,
    };

    await filterData(`/admin/markattstudent/filter`, payload, "POST");
  };

  const onFilter = async () => {
    setSelectedIds(new Set());
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  };

  const resetFilter = useCallback(() => {
    setSelectedIds(new Set());
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  // ================= End Filter Block =================


  


  // ================= Start Column Customization Block =================

  const statusIcon = (action: string) => {
    switch (action) {
      case "1":
        return {
          icon: <GoDotFill />,
          text: t("present"),
          class: "text-success bg-success/20",
        };
      case "P":
        return {
          icon: <GoDotFill />,
          text: t("permission"),
          class: "text-primary bg-primary/20",
        };
      case "A":
        return {
          icon: <GoDotFill />,
          text: t("absent"),
          class: "text-danger bg-danger/20",
        };
      case "L":
        return {
          icon: <GoDotFill />,
          text: t("late"),
          class: "text-warning bg-warning/20",
        };
      case null:
        return {
          icon: <GoDotFill className="text-gray-400" />,
          text: t("notMarked"),
          class: "text-gray-500 bg-zinc-500/20",
        };
      default:
        return {
          icon: <GoDotFill className="text-gray-400" />,
          text: t("notMarked"),
          class: "text-gray-500 bg-zinc-500/20",
        };
    }
  };

  const customizeCols = useCallback(
    (data: any) => {
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-1",
            statusIcon(data.attendance_status).class
          )}
        >
          {statusIcon(data.attendance_status).icon} {statusIcon(data.attendance_status).text}
        </span>
      );
    },
    [t]
  );

  const customizeColSession = useCallback((data: any) => {
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full w-fit text-xs font-semibold inline-flex items-center gap-1 bg-black/10 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 uppercase"
        )}
      >
        {data.session_name}
      </span>
    );
  }, []);

  const colsKeys = useMemo(
    () => [
      { key: "attendance_status", value: (data: any) => customizeCols(data) },
      { key: "session_name", value: (data: any) => customizeColSession(data) },
    ],
    [customizeCols, customizeColSession]
  );

  // ================= End Column Customization Block =================


  // ================= Start Table Header Action Block =================

  const selectedLength = selectedIds === "all" ? rows.length : Array.from(selectedIds).length;

  const startContent = multiActionLoading ? (<Spinner variant="spinner" color="white" size="sm" />) : (<MdFilterTiltShift size={16} />);
  const isDisabled = selectedLength === 0 || multiActionLoading;
  const notSelected = () => ShowToast({ title: t("notSelected"), description: t("pleaseSelectAtLeastOne"), color: "warning", delay: 0 });

  const headerAction = (
    <div className="flex items-center gap-1 border-r border-zinc-200 dark:border-zinc-800 pr-2">
      {selectedLength > 0 ? (
        <>
          <Button
            onPress={onSetPresentStatus}
            color="success"
            startContent={startContent}
            isDisabled={isDisabled}
          >
            {t("markPresent")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetAbsentStatus}
            color="danger"
            startContent={startContent}
            isDisabled={isDisabled}
          >
            {t("markAbsent")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetLateStatus}
            color="warning"
            startContent={startContent}
            isDisabled={isDisabled}
          >
            {t("markLate")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetPermissionStatus}
            color="primary"
            startContent={startContent}
            isDisabled={isDisabled}
          >
            {t("markPermission")} ({selectedLength})
          </Button>
        </>
      ) : (
        <>
          <Button
            onPress={notSelected}
            color="success"
            startContent={startContent}
            className="opacity-50"
          >
            {t("markPresent")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="danger"
            startContent={startContent}
            className="opacity-50"
          >
            {t("markAbsent")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="warning"
            startContent={startContent}
            className="opacity-50"
          >
            {t("markLate")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="primary"
            startContent={startContent}
            className="opacity-50"
          >
            {t("markPermission")} ({selectedLength})
          </Button>
        </>
      )}
    </div>
  );

  // ================= End Table Header Action Block =================


  return (
    <>
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />
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
      />
      <DataTable
        rowKey="id"
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        loading={fetchListLoading || filterLoading}
        onView={handleView}
        onMarkPresent={onMarkPresent}
        onMarkAbsent={onMarkAbsent}
        onMarkPermission={onMarkPermission}
        onMarkLate={onMarkLate}
        loadData={refetch}
        selectRow={true}
        selectedKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        onOpenFilter={onOpen}
        isFiltered={isFiltered}
        colKeys={colsKeys}
        permissionView="view:attendance"
        permissionMarkPresent="present:attendance"
        permissionMarkAbsent="absent:attendance"
        permissionMarkLate="late:attendance"
        permissionMarkPermission="permission:attendance"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
        loadingButton={markAttendanceLoading || multiActionLoading}
        customizes={{
          header: headerAction,
        }}
      />
    </>
  );
};

export default Index;