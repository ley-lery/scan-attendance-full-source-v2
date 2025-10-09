import { useCallback, useEffect, useMemo, useState, type Key } from "react";
import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem, DataTable, Modal, ShowToast } from "@/components/hero-ui";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { cn } from "@/lib/utils";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import Filter from "./Filter";
import { Button, type Selection } from "@heroui/react";
import { MdFilterTiltShift } from "react-icons/md";

// ============ Types ============
type DataFilter = {
  course: string;
  page: number;
  limit: number;
};

type AttendanceStatus = "1" | "A" | "P" | "L";

type MarkAttendanceData = {
  classId: number | null;
  course: number | null;
  student: number | null;
  session: number | null;
  status: AttendanceStatus | null;
};

type MarkMultiAttendanceData = {
  classId: number | null;
  course: number | null;
};

// ============ Constants ============
const SESSION_LIST = Array.from({ length: 60 }, (_, i) => ({
  id: String(i + 1),
  label: `Session ${i + 1}`,
}));

const ATTENDANCE_STATUS_CONFIG = {
  "1": { label: "Present", color: "success" },
  A: { label: "Absent", color: "danger" },
  P: { label: "Permission", color: "warning" },
  L: { label: "Late", color: "info" },
} as const;

// ============ Custom Hooks ============
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenView: isOpen, onOpenView: onOpen, onCloseView: onClose };
};

const useSessionClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenSession: isOpen, onOpenSession: onOpen, onCloseSession: onClose };
};

// ============ Main Component ============
const Index = () => {
  const { t } = useTranslation();

  // ==== Modal State ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenSession, onOpenSession, onCloseSession } = useSessionClosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState("");
  const [viewRow, setViewRow] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | null>(null);
  const [selectedIds, setSelectedIds] = useState<Selection>(new Set([]));
  const [isMultiMark, setIsMultiMark] = useState(false);

  const [markAttendanceData, setMarkAttendanceData] = useState<Partial<MarkAttendanceData>>({
    classId: null,
    course: null,
    student: null,
    session: null,
    status: null,
  });

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
      course: "",
      page: pagination.page,
      limit: pagination.limit,
    }),
    [pagination.page, pagination.limit]
  );

  const [filter, setFilter] = useState<any>(defaultFilter);

  // ==== API Calls ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ courses: any[] }>(
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
      resetMarkAttendanceForm();
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
      resetMarkAttendanceForm();
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
  const resetMarkAttendanceForm = () => {
    setMarkAttendanceData({
      classId: null,
      course: null,
      student: null,
      session: null,
      status: null,
    });
    setAttendanceStatus(null);
    setIsMultiMark(false);
    onCloseSession();
  };

  const refetch = async () => {
    const payload = {
      course: filter.course ? parseInt(filter.course) : undefined,
      page: pagination.page,
      limit: pagination.limit,
    };

    await fetchList(`/lecturer/markattstudent/list`, payload, "POST");
  };

  const applyFilterWithPagination = async (page: number) => {
    const payload = {
      course: filter.course ? parseInt(filter.course) : undefined,
      page: page,
      limit: pagination.limit,
    };

    const filtered = await filterData(`/lecturer/markattstudent/list`, payload, "POST");
    
    if (filtered?.data?.rows?.length > 0) {
      setMarkMultiAttendanceData({
        classId: filtered.data.rows[0].class_id,
        course: filtered.data.rows[0].course_id,
      });
    }
  };

  // ==== Single Mark Attendance Handlers ====
  const openMarkAttendanceModal = (data: any, status: AttendanceStatus) => {
    console.log(data, "row")
    setAttendanceStatus(status);
    setMarkAttendanceData({
      classId: data.class_id,
      course: data.course_id,
      student: data.id,
      session: null,
      status: status,
    });
    setIsMultiMark(false);
    onOpenSession();
  };

  const onMarkPresent = (data: any) => openMarkAttendanceModal(data, "1");
  const onMarkAbsent = (data: any) => openMarkAttendanceModal(data, "A");
  const onMarkLate = (data: any) => openMarkAttendanceModal(data, "L");
  const onMarkPermission = (data: any) => openMarkAttendanceModal(data, "P");

  const onMarkAttendance = async () => {
    const payload = {
      classId: Number(markAttendanceData.classId),
      course: Number(markAttendanceData.course),
      student: Number(markAttendanceData.student),
      session: Number(markAttendanceData.session),
      status: attendanceStatus,
    };

    await markAttendance(`/lecturer/markattstudent/marksignle`, payload, "POST");
  };

  // ==== Multi Mark Attendance Handlers ====
  const openMultiMarkModal = (status: AttendanceStatus) => {
    if (Array.from(selectedIds).length === 0) {
      ShowToast({
        color: "warning",
        title: "Warning",
        description: "Please select at least one student",
      });
      return;
    }

    setAttendanceStatus(status);
    setIsMultiMark(true);
    onOpenSession();
  };

  const onSetPresentStatus = () => openMultiMarkModal("1");
  const onSetAbsentStatus = () => openMultiMarkModal("A");
  const onSetLateStatus = () => openMultiMarkModal("L");
  const onSetPermissionStatus = () => openMultiMarkModal("P");

  const onMultiMarkAttendance = async () => {
    const selected = Array.from(selectedIds);
    const attendanceData = selected.map((id) => ({
      student_id: Number(id),
      status: attendanceStatus,
    }));

    const payload = {
      classId: Number(markMultiAttendanceData.classId),
      course: Number(markMultiAttendanceData.course),
      session: Number(markAttendanceData.session),
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

  // ==== Input Handler ====
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
    const { name, value } = e.target;
    setMarkAttendanceData((prev) => ({ ...prev, [name]: value }));
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
      { name: t("dateOfBirth"), uid: "date_of_birth", sortable: true },
      { name: t("email"), uid: "email", sortable: false },
      { name: t("phoneNumber"), uid: "phone_number", sortable: false },
      { name: t("class"), uid: "class_name", sortable: true },
      { name: t("room"), uid: "room_name", sortable: true },
      { name: t("programType"), uid: "program_type", sortable: true },
      { name: t("promotion"), uid: "promotion_no", sortable: true },
      { name: t("term"), uid: "term_no", sortable: true },
      { name: t("faculty"), uid: "faculty_name_en", sortable: true },
      { name: t("field"), uid: "field_name_en", sortable: true },
      { name: t("course"), uid: "course_name_en", sortable: true },
      { name: t("courseCode"), uid: "course_code", sortable: true },
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
    "class_name",
    "room_name",
    "promotion_no",
    "term_no",
    "course_name_en",
    "status",
    "actions",
  ];

  const actionIcon = (action: string) => {
    switch (action) {
      case "INSERT":
        return <IoMdAdd />;
      case "UPDATE":
        return <RxUpdate />;
      case "DELETE":
        return <IoTrashOutline />;
      default:
        return <IoMdAdd />;
    }
  };

  const customizeCols = (data: any) => {
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-2",
          data.action === "INSERT" && "text-success bg-success/20",
          data.action === "UPDATE" && "text-warning bg-warning/20",
          data.action === "DELETE" && "text-danger bg-danger/20"
        )}
      >
        {actionIcon(data.action)} {data.action}
      </span>
    );
  };

  const colsKeys = [{ key: "action", value: (data: any) => customizeCols(data) }];

  const selectedLength = Array.from(selectedIds).length;

  const headerAction = (
    <div className="flex items-center gap-2">
      {selectedLength > 0 && (
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
      )}
    </div>
  );

  const getAttendanceStatusLabel = () => {
    if (!attendanceStatus) return "";
    return ATTENDANCE_STATUS_CONFIG[attendanceStatus]?.label || attendanceStatus;
  };

  const getSelectedStudentInfo = () => {
    if (isMultiMark) {
      return `${selectedLength} student${selectedLength > 1 ? "s" : ""}`;
    }
    const student = rows.find((row) => row.id === markAttendanceData.student);
    return student?.student_name_en || "Unknown Student";
  };

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
        formLoadLoading={formLoadLoading}
        filterLoading={filterLoading}
      />

      {/* Mark Attendance Modal */}
      <Modal
        onSubmit={isMultiMark ? onMultiMarkAttendance : onMarkAttendance}
        isOpen={isOpenSession}
        onClose={resetMarkAttendanceForm}
        title={t("markAttendance")}
        onSaveClose={isMultiMark ? onMultiMarkAttendance : onMarkAttendance}
        size="sm"
        disabledBtn={markAttendanceLoading || multiActionLoading || !markAttendanceData.session}
        closeForm={resetMarkAttendanceForm}
      >
        <div className="space-y-4">
          <Autocomplete
            radius="md"
            size="md"
            label={t("session")}
            labelPlacement="outside"
            name="session"
            placeholder={t("chooseSession")}
            selectedKey={markAttendanceData.session?.toString()}
            className="w-full"
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "session", value: key ?? "" },
              })
            }
            isRequired
          >
            {SESSION_LIST.map((item) => (
              <AutocompleteItem key={item.id} textValue={item.label}>
                <p className="truncate w-[95%]">{item.label}</p>
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Mark attendance as <strong className="text-primary">{getAttendanceStatusLabel()}</strong> for{" "}
            <strong>{getSelectedStudentInfo()}</strong>
          </p>
        </div>
      </Modal>

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
        permissionView="view:auditlog"
        permissionMarkPresent="present:student"
        permissionMarkAbsent="absent:student"
        permissionMarkLate="late:student"
        permissionMarkPermission="permission:student"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
        customizes={{
          header: headerAction,
        }}
      />
    </div>
  );
};

export default Index;