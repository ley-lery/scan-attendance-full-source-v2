import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";
import { cn } from "@/lib/utils";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import Filter from "./Filter";
import { Chip, type Selection } from "@heroui/react";
import { Button } from "@/components/hero-ui";
import { MdFilterTiltShift } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { useFetch } from "@/hooks/useFetch";

// ============ Types ============
type DataFilter = {
  course: number | null
  session: string | null
  classStudentStatus: string | null
  transferred: number | null
  page: number
  limit: number
}

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
      course: null,
      session: "s1",
      classStudentStatus: null,
      transferred: 0,
      page: pagination.page,
      limit: pagination.limit,
    }),
    [pagination.page, pagination.limit]
  );

  const [filter, setFilter] = useState<any>(defaultFilter);

  // ==== API Calls ====
  const { data: fetchList, loading: fetchListLoading } = useFetch<{ rows: any[]; total_count: number }>("/lecturer/markattstudent/list", 
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
    console.log(fetchList, "fetchList");
    
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
      setTimeout(()=>{
        ShowToast({ color: "success", title: "Success", description: res.response?.data?.message || "Attendance marked successfully" });
      }, 500);      
      await refetch();
      setSelectedIds(new Set([]));
    },
    onError: (err) => {
      setTimeout(()=>{
        ShowToast({ color: "error", title: "Error", description: err.response?.data?.message || "Failed to mark attendance" });
      }, 500);
    },
  });

  const { mutate: filterData, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
      setIsFiltered(true);
      onClose();
    },
    onError: (err) => {
      ShowToast({ color: "error", title: "Error", description: err.message || "Failed to apply filter" });
    },
  });

  // ==== Helper Functions ====


  const FilterData = (formData: DataFilter, t: (key: string) => string) => {
    const newErrors: Record<string, string> = {};

    if (!formData.session?.trim()) {
      newErrors.session = t("validation.required");
    }

    return newErrors;
  };
  const applyFilterWithPagination = async (page: number) => {
    const validationErrors = FilterData(filter, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const payload = {
      course: filter.course ? parseInt(filter.course) : null,
      session: filter.session ? String(filter.session) : null,
      classStudentStatus: filter.classStudentStatus ? String(filter.classStudentStatus) : null,
      transferred: filter.transferred ? parseInt(filter.transferred) : 0,
      page: page,
      limit: pagination.limit,
    };

    const filtered = await filterData(`/lecturer/markattstudent/filter`, payload, "POST");
    console.log(filtered, "filtered");
    
    if (filtered?.data?.rows?.length > 0) {
      setMarkMultiAttendanceData({
        classId: filtered.data.rows[0].class_id,
        course: filtered.data.rows[0].course_id,
      });
      setSession(filtered.data.rows[0].session_name);
    }
  };

  const refetch = async () => {
    const payload = {
      course: filter.course ? parseInt(filter.course) : null,
      session: filter.session ? String(filter.session) : null,
      classStudentStatus: filter.classStudentStatus ? String(filter.classStudentStatus) : null,
      transferred: filter.transferred ? parseInt(filter.transferred) : 0,
      page: pagination.page,
      limit: pagination.limit,
    };

    await filterData(`/lecturer/markattstudent/filter`, payload, "POST");
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
    console.log(payload, "payload");

    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  }, [sessionNumber]);
  const onMarkAbsent = useCallback(async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.student_id,
      session: sessionNumber,
      status: "A",
    };
    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  }, [sessionNumber]);
  const onMarkLate = useCallback(async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.student_id,
      session: sessionNumber,
      status: "L",
    };
    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  }, [sessionNumber]);
  const onMarkPermission = useCallback(async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.student_id,
      session: sessionNumber,
      status: "P",
    };
    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  }, [sessionNumber]);



  // ==== Multi Mark Attendance Handlers ====

  const onSetPresentStatus = () => onMultiMarkAttendance("1");
  const onSetAbsentStatus = () => onMultiMarkAttendance("A");
  const onSetLateStatus = () => onMultiMarkAttendance("L");
  const onSetPermissionStatus = () => onMultiMarkAttendance("P");

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
    setSearchKeyword(e.target.value);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
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
      { name: t("classStudentStatus"), uid: "class_student_status", sortable: true },
      { name: t("transferred"), uid: "transfer_status", sortable: true },
      { name: t("transferDate"), uid: "transfer_date", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = [
    "id",
    "student_code",
    "student_name_en",
    "gender",
    "class_name",
    "session_name",
    "attendance_status",
    "class_student_status",
    "transfer_status",
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
  const customizeColTransferred = (data: any) => {
    return (
      <Chip color={data.transfer_status === "Transferred" ? "warning" : "success"} variant="flat" size="sm" classNames={{base: 'border-none'}}>
        {data.transfer_status}
      </Chip>
    );
  };
  const customizeColClassStudentStatus = useCallback(
    (data: any) => {
      return (
        <Chip color={data.class_student_status === "Active" ? "success" : data.class_student_status === "Complete" ? "primary" : "danger"} variant="dot" classNames={{base: 'border-none'}}>
          {data.class_student_status}
        </Chip>
      );
    },
    [t]
  );
  

  const colsKeys = [
    { key: "attendance_status", value: (data: any) => customizeCols(data) },
    { key: "session_name", value: (data: any) => customizeColSession(data) },
    { key: "transfer_status", value: (data: any) => customizeColTransferred(data) },
    { key: "class_student_status", value: (data: any) => customizeColClassStudentStatus(data) },
  ];

  const selectedLength = Array.from(selectedIds).length;

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
        rowKey="id"
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
        handleSearch={refetch}
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