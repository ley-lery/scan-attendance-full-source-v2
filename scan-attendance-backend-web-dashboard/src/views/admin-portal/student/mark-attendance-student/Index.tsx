import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { cn } from "@/lib/utils";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import Filter from "./Filter";
import { Button, type Selection } from "@heroui/react";
import { MdFilterTiltShift } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

// ============ Types ============
type DataFilter = {
  course: string;
  session: string;
  page: number;
  limit: number;
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

  // ==== useEffect ====
  useEffect(() => {
    onOpen();
  }, []);

  const defaultFilter: DataFilter = useMemo(
    () => ({
      course: "",
      session: "s1",
      page: pagination.page,
      limit: pagination.limit,
    }),
    [pagination.page, pagination.limit]
  );

  const [filter, setFilter] = useState<any>(defaultFilter);

  // ==== API Calls ====
  const { data: formLoad } = useFetch<{ courses: any[] }>(
    "/lecturer/markattstudent/formload"
  );
  

  const { mutate: fetchList, loading: fetchLoading } = useMutation({
    onSuccess: (response) => {
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to fetch data",
      });
    },
  });

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
        description: res.response?.data?.message || "Attendance marked successfully",
      });
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.response?.data?.message || "Failed to mark attendance",
      });
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
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to apply filter",
      });
    },
  });

  // ==== Helper Functions ====
  const refetch = async () => {
    const payload = {
      course: filter.course ? parseInt(filter.course) : undefined,
      session: filter.session ? String(filter.session) : undefined,
      page: pagination.page,
      limit: pagination.limit,
    };

    await fetchList(`/lecturer/markattstudent/list`, payload, "POST");
  };

  const FilterData = (formData: Filter, t: (key: string) => string) => {
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
      course: filter.course ? parseInt(filter.course) : undefined,
      session: filter.session ? String(filter.session) : undefined,
      page: page,
      limit: pagination.limit,
    };

    const filtered = await filterData(`/lecturer/markattstudent/list`, payload, "POST");
    console.log(filtered, "filtered");
    
    if (filtered?.data?.rows?.length > 0) {
      setMarkMultiAttendanceData({
        classId: filtered.data.rows[0].class_id,
        course: filtered.data.rows[0].course_id,
      });
      setSession(filtered.data.rows[0].session_name);
    }
  };

  // ==== Single Mark Attendance Handlers ====

  const sessionNumber = parseInt(session.replace(/^s/, ""), 10);
  const onMarkPresent = async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.id,
      session: sessionNumber,
      status: "1",
    };
    console.log(payload, "payload");

    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  };
  const onMarkAbsent = async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.id,
      session: sessionNumber,
      status: "A",
    };
    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  };
  const onMarkLate = async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.id,
      session: sessionNumber,
      status: "L",
    };
    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  };
  const onMarkPermission = async (data: any) => {
    const payload = {
      classId: data.class_id,
      course: data.course_id,
      student: data.id,
      session: sessionNumber,
      status: "P",
    };
    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");

  };



  // ==== Multi Mark Attendance Handlers ====

  const onSetPresentStatus = () => onMultiMarkAttendance("1");
  const onSetAbsentStatus = () => onMultiMarkAttendance("A");
  const onSetLateStatus = () => onMultiMarkAttendance("L");
  const onSetPermissionStatus = () => onMultiMarkAttendance("P");

  const onMultiMarkAttendance = async (status: AttendanceStatus) => {
    const selected = Array.from(selectedIds);
    const attendanceData = selected.map((id) => ({
      student_id: Number(id),
      status: status,
    }));

    const payload = {
      classId: Number(markMultiAttendanceData.classId),
      course: Number(markMultiAttendanceData.course),
      session: sessionNumber,
      attData: attendanceData,
    };

    await multiAction(`/lecturer/markattstudent/markmulti`, payload, "POST");
  };

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
  const onView = (row: any) => {
    setViewRow(row);
    onOpenView();
  };

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

  const colsKeys = [{ key: "attendance_status", value: (data: any) => customizeCols(data) }];

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
      {selectedLength > 1 ? (
        <>
          <Button
            onPress={onSetPresentStatus}
            size="sm"
            variant="solid"
            color="success"
            radius="lg"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
          >
            {t("markPresent")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetAbsentStatus}
            size="sm"
            variant="solid"
            color="danger"
            radius="lg"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
          >
            {t("markAbsent")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetLateStatus}
            size="sm"
            variant="solid"
            color="warning"
            radius="lg"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
          >
            {t("markLate")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetPermissionStatus}
            size="sm"
            variant="solid"
            color="primary"
            radius="lg"
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
            size="sm"
            variant="solid"
            color="success"
            radius="lg"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
            className="opacity-50"
          >
            {t("markPresent")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            size="sm"
            variant="solid"
            color="danger"
            radius="lg"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
            className="opacity-50"
          >
            {t("markAbsent")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            size="sm"
            variant="solid"
            color="warning"
            radius="lg"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={multiActionLoading}
            className="opacity-50"
          >
            {t("markLate")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            size="sm"
            variant="solid"
            color="primary"
            radius="lg"
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
        formLoad={formLoad}
        filterLoading={filterLoading}
        errors={errors}
        setErrors={setErrors}
      />


      {/* Data Table */}
      <DataTable
        loading={fetchLoading || filterLoading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
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
        loadingButton={markAttendanceLoading || multiActionLoading}
        customizes={{
          header: headerAction,
        }}
      />
    </div>
  );
};

export default Index;