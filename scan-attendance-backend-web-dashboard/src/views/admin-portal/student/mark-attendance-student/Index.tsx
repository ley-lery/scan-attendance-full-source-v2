import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";
import { cn } from "@/lib/utils";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import Filter from "./Filter";
import { type Selection } from "@heroui/react";
import { Button } from "@/components/hero-ui";
import { MdFilterTiltShift } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { useFetch } from "@/hooks/useFetch";

// ============ Types ============
type DataFilter = {
  faculty: number | null,
  field: number | null,
  classId: number | null,
  course: number | null,
  student: number | null,
  promotionNo: number | null,
  termNo: number | null,
  programType: string | null,
  gender: string | null,
  studentStatus: string | null,
  searchKeyword: string | null,
  sessionNo: string | null,
  page: number,
  limit: number
};

type AttendanceStatus = "1" | "A" | "P" | "L";

type MarkMultiAttendanceData = {
  classId: number | null;
  course: number | null;
};


// ============ Custom Hooks ============
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenView: isOpen, onOpenView: onOpen, onCloseView: onClose };
};

// ============ Main Component ============
const Index = () => {
  const { t } = useTranslation();

  // ==== Modal State ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState("");
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
      sessionNo: 's1',
      page: pagination.page,
      limit: pagination.limit,
    }),
    [pagination.page, pagination.limit]
  );

  const [filter, setFilter] = useState<any>(defaultFilter);

  // ==== Data fetching ====
  const { data: fetchList, loading: fetchListLoading } = useFetch<{ rows: any[]; total_count: number }>("/admin/markattstudent/list", 
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
      },
      deps: [pagination.page, pagination.limit],
      enabled: !isFiltered,
    }
  );
  useEffect(() => {
    if (fetchList?.data?.rows?.length > 0) {
      setMarkMultiAttendanceData({
        classId: fetchList.data.rows[0].class_id,
        course: fetchList.data.rows[0].course_id,
      });
      setSession(fetchList.data.rows[0].session_name);
    }
    setRows(fetchList?.data?.rows || []);
    setTotalPage(Math.ceil((fetchList?.data?.total || 0) / pagination.limit) || 1);
  }, [fetchList]);
  

  const { mutate: markAttendance, loading: markAttendanceLoading } = useMutation({
    onSuccess: (response) => {
      setTimeout(()=>{
        ShowToast({ color: "success", title: "Success", description: response?.response?.data?.message || "Mark attendance successfully" });
      }, 500);
      refetch();
    },
    onError: (err) => {
      setTimeout(()=>{
        ShowToast({ color: "error", title: "Error", description: err?.response?.data?.message || "Failed to mark attendance" });
      }, 500);
    },
  });

  const { mutate: multiAction, loading: multiActionLoading } = useMutation({
    onSuccess: async (res) => {
      await refetch();
      setSelectedIds(new Set([]));
      setTimeout(()=>{
        ShowToast({ color: "success", title: "Success", description: res.response?.data?.message || "Attendance marked successfully" });
      }, 500);      
    },
    onError: (err) => {
      setTimeout(()=>{
        ShowToast({ color: "error", title: "Error", description: err.response?.data?.message || "Failed to mark attendance" });
      }, 500);
    },
  });

  const { mutate: filterData, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      console.log(response, "response");
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
      setTimeout(()=>{
        ShowToast({ color: "error", title: "Error", description: err.message || "Failed to apply filter" });
      }, 500);
    },
  });

  const refetch = async () => {
    const payload: DataFilter = {
      faculty: filter.faculty ? parseInt(filter.faculty) : null,
      field: filter.field ? parseInt(filter.field) : null,
      classId: filter.classId ? parseInt(filter.classId) : null,
      course: filter.course ? parseInt(filter.course) : null,
      student: filter.student ? parseInt(filter.student) : null,
      promotionNo: filter.promotionNo ? parseInt(filter.promotionNo) : null,
      termNo: filter.termNo ? parseInt(filter.termNo) : null,
      programType: filter.programType,
      gender: filter.gender,
      studentStatus: filter.studentStatus,
      searchKeyword: searchKeyword?.trim() ? searchKeyword.trim() : null,
      sessionNo: filter.sessionNo ? String(filter.sessionNo) : null,
      page: pagination.page,
      limit: pagination.limit,
    };

    await filterData(`/admin/markattstudent/filter`, payload, "POST");
  };

  const FilterData = (formData: Filter, t: (key: string) => string) => {
    const newErrors: Record<string, string> = {};

    if (!formData.sessionNo?.trim()) {
      newErrors.sessionNo = t("validation.required");
    }

    return newErrors;
  };
  const applyFilterWithPagination = async (page: number) => {
    const validationErrors = FilterData(filter, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      ShowToast({color: "warning", title: "Warning", description: "Please select a session to apply filter"});
      return false;
    }

    const payload: DataFilter = {
      faculty: filter.faculty ? parseInt(filter.faculty) : null,
      field: filter.field ? parseInt(filter.field) : null,
      classId: filter.classId ? parseInt(filter.classId) : null,
      course: filter.course ? parseInt(filter.course) : null,
      student: filter.student ? parseInt(filter.student) : null,
      promotionNo: filter.promotionNo ? parseInt(filter.promotionNo) : null,
      termNo: filter.termNo ? parseInt(filter.termNo) : null,
      programType: filter.programType,
      gender: filter.gender,
      studentStatus: filter.studentStatus,
      searchKeyword:  searchKeyword?.trim() ? searchKeyword.trim() : null,
      sessionNo: filter.sessionNo ? String(filter.sessionNo) : null,
      page: page,
      limit: pagination.limit,
    };
    console.log(payload, "payload");

    await filterData(`/admin/markattstudent/filter`, payload, "POST");
    
  };

  // ==== Single Mark Attendance Handlers ====

  const sessionNumber = parseInt(session.replace(/^s/, ""), 10);

  const onMarkPresent = useCallback(async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.student_id,
      session: sessionNumber,
      status: "1",
    };

    await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");
  }, [sessionNumber]);

  const onMarkAbsent = useCallback(async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.student_id,
      session: sessionNumber,
      status: "A",
    };
    await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");
  }, [sessionNumber]);

  const onMarkLate = useCallback(async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.student_id,
      session: sessionNumber,
      status: "L",
    };
    await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");
  }, [sessionNumber]);

  const onMarkPermission = useCallback(async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.student_id,
      session: sessionNumber,
      status: "P",
    };
    await markAttendance(`/admin/markattstudent/marksignle`, payload, "POST");

  }, [sessionNumber]);



  // ==== Multi Mark Attendance Handlers ====

  const onSetPresentStatus = () => onMultiMarkAttendance("1");
  const onSetAbsentStatus = () => onMultiMarkAttendance("A");
  const onSetLateStatus = () => onMultiMarkAttendance("L");
  const onSetPermissionStatus = () => onMultiMarkAttendance("P");

  const onMultiMarkAttendance = useCallback(async (status: AttendanceStatus) => {

    let studentIds: number[];

    if (selectedIds === "all") {
      studentIds = rows.map((row) => Number(row.student_id));
    } else {
      studentIds = Array.from(selectedIds).map((id) => Number(id));
    }

    const attendanceData = studentIds.map((id) => ({
      student_id: Number(id),
      status: status,
    }));

    const payload = {
      classId: Number(markMultiAttendanceData.classId),
      course: Number(markMultiAttendanceData.course),
      session: sessionNumber,
      attData: attendanceData,
    };
    console.log(payload, "payload");

    await multiAction(`/admin/markattstudent/markmulti`, payload, "POST");
  }, [selectedIds]);

  // ==== Filter Handlers ====
  const onFilter = async () => {
    setSelectedIds(new Set());
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  };

  const resetFilter = () => {
    setSelectedIds(new Set());
    setFilter(defaultFilter);
    refetch();
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ==== Search Handlers ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    refetch();
    setSearchKeyword(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetch();
  };

  const handleSearch = async () => {
    await refetch();
  };


  // ==== View Handler ====
  const onView = useCallback((row: any) => {
    setViewRow(row);
    onOpenView();
  }, []);

  // ==== Pagination Handler ====
  const handlePageChange = async (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));

    if (isFiltered) {
      await applyFilterWithPagination(newPage);
    }
  };

  // ==== Selection Handler ====
  const handleSelectionChange = useCallback((keys: Selection) => {
    console.log(keys, "keys");
    setSelectedIds(keys);
  }, []);

  // ==== Effects ====
  useEffect(() => {
    if (!isFiltered) {
      refetch();
    }
  }, [pagination.page, pagination.limit]);

  // ==== Table Configuration ====
  const cols = useMemo(
    () => [
      { name: t("no"), uid: "id", sortable: true },
      { name: t("studentCode"), uid: "student_code", sortable: true },
      { name: t("studentName"), uid: "student_name_en", sortable: true },
      { name: t("gender"), uid: "gender", sortable: true },
      { name: t("dob"), uid: "dob", sortable: true },
      { name: t("email"), uid: "email", sortable: false },
      { name: t("phoneNumber"), uid: "phone_number", sortable: false },
      { name: t("class"), uid: "class_name", sortable: true },
      { name: t("session"), uid: "session_name", sortable: true },
      { name: t("attendanceStatus"), uid: "attendance_status", sortable: true },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = [
    "id",
    "student_code",
    "student_name_en",
    "gender",
    "dob",
    "email",
    "class_name",
    "session_name",
    "attendance_status",
    "status",
    "actions",
  ];

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

  const customizeCols = (data: any) => {
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-1",
          statusIcon(data.attendance_status).class,
        )}
      >
        {statusIcon(data.attendance_status).icon} {statusIcon(data.attendance_status).text}
      </span>
    );
  };

  const customizeColSession = (data: any) => {
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full w-fit text-xs font-semibold inline-flex items-center gap-1 bg-black/10 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 uppercase",
        )}
      >
        {data.session_name}
      </span>
    );
  };

  const colsKeys = [
    { key: "attendance_status", value: (data: any) => customizeCols(data) },
    { key: "session_name", value: (data: any) => customizeColSession(data) },
  ];
  
  const selectedLength = selectedIds === "all" ? rows.length : Array.from(selectedIds).length;

  const notSelected = () =>{
    ShowToast({
      title: t("notSelected"),
      description: t("pleaseSelectAtLeastOne"),
      color: "warning",
    });
  }

  // === Header Action ===
  const headerAction = (
    <div className="flex items-center gap-2">
      {selectedLength > 0 ? (
        <>
          <Button
            onPress={onSetPresentStatus}
            color="success"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
          >
            {t("markPresent")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetAbsentStatus}
            color="danger"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
          >
            {t("markAbsent")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetLateStatus}
            color="warning"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
          >
            {t("markLate")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetPermissionStatus}
            color="primary"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
          >
            {t("markPermission")} ({selectedLength})
          </Button>
        </>
      )
      : (
        <>
          <Button
            onPress={notSelected}
            color="success"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
            className="opacity-50"
          >
            {t("markPresent")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="danger"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
            className="opacity-50"
          >
            {t("markAbsent")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="warning"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
            className="opacity-50"
          >
            {t("markLate")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="primary"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
            className="opacity-50"

          >
            {t("markPermission")} ({selectedLength})
          </Button>
        </>
      )}
    </div>
  );


  // ==== Render ====
  return (
    <div className="p-4">
      {/* View Modal */}
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />

      {/* Filter Modal */}
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


      {/* Data Table */}
      <DataTable
        rowKey="student_id"
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        loading={fetchListLoading || filterLoading}
        onView={onView}
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
        // loadingButton={markAttendanceLoading || multiActionLoading}
        customizes={{
          header: headerAction,
        }}
      />
    </div>
  );
};

export default Index;