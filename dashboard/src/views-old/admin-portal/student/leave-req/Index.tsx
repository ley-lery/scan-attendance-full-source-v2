import { useEffect, useMemo, useState, useCallback, type Key } from "react";
import { useTranslation } from "react-i18next";
import { 
  Autocomplete, 
  AutocompleteItem, 
  DataTable, 
  DatePicker, 
  ShowToast 
} from "@/components/hero-ui";
import { 
  getLocalTimeZone, 
  today, 
  type DateValue 
} from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { 
  useDisclosure, 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerBody, 
  DrawerFooter 
} from "@/god-ui";
import { Button, Divider, Spinner, type Selection } from "@heroui/react";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { GrClear } from "react-icons/gr";
import { MdFilterTiltShift } from "react-icons/md";
import Form from "./Form";
import { cn } from "@/lib/utils";

// === Types ===
type StudentLeaveFilter = {
  faculty: string | null;
  field: string | null;
  classId: string | null;
  student: string | null;
  status: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  search: string | null;
  page: number;
  limit: number;
};

// === Helpers ===
const formatDateValue = (date: DateValue | null) =>
  date ? date.toString() : null;

// Custom hooks for modals
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenView: isOpen, onOpenView: onOpen, onCloseView: onClose };
};

const useModalClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenModal: isOpen, onOpenModal: onOpen, onCloseModal: onClose };
};

const Index = () => {
  const { t } = useTranslation();

  // ==== State Modal Management ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenModal, onOpenModal, onCloseModal } = useModalClosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState("");
  const [viewRow, setViewRow] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Row selection state for multiple approve/reject
  const [selectedIds, setSelectedIds] = useState<Selection>(new Set([]));

  const defaultFilter: StudentLeaveFilter = useMemo(() => ({
    faculty: null,
    field: null,
    classId: null,
    student: null,
    status: "",
    startDate: today(getLocalTimeZone()),
    endDate: today(getLocalTimeZone()),
    search: null,
    page: 1,
    limit: 10
  }), []);

  const [filter, setFilter] = useState<StudentLeaveFilter>(defaultFilter);

  // ==== Pagination ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });
  const [totalPage, setTotalPage] = useState(1);

  // ==== Form Load ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ users: any[] }>(
    "/student/leavereq/formload"
  );

  // ==== Fetch Data ====
  const endpoint = searchKeyword.trim() === "" 
    ? "/student/leavereq/list" 
    : "/student/leavereq/search";

  const { data, loading, refetch } = useFetch<{
    rows: any[];
    total_count: number;
  }>(endpoint, {
    params: {
      page: pagination.page,
      limit: pagination.limit,
      ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }),
    },
    deps: [pagination.page, pagination.limit, searchKeyword],
  });

  useEffect(() => {
    if (!isFiltered) {
      setRows(data?.data?.rows || []);
      setTotalPage(Math.ceil((data?.data?.total || 0) / pagination.limit) || 1);
    }
  }, [data, isFiltered, pagination.limit]);


  // ==== Table Columns ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("studentCode"), uid: "student_code", sortable: true },
      { name: t("studentNameKh"), uid: "student_name_kh", sortable: true },
      { name: t("studentNameEn"), uid: "student_name_en", sortable: true },
      { name: t("studentEmail"), uid: "student_email" },
      { name: t("studentPhone"), uid: "student_phone" },
      { name: t("className"), uid: "class_name", sortable: true },
      { name: t("programType"), uid: "program_type" },
      { name: t("promotionNo"), uid: "promotion_no", sortable: true },
      { name: t("termNo"), uid: "term_no" },
      { name: t("facultyNameEn"), uid: "faculty_name_en" },
      { name: t("fieldNameEn"), uid: "field_name_en" },
      { name: t("requestDate"), uid: "request_date", sortable: true },
      { name: t("startDate"), uid: "start_date", sortable: true },
      { name: t("endDate"), uid: "end_date", sortable: true },
      { name: t("totalDays"), uid: "total_days" },
      { name: t("reasonPreview"), uid: "reason_preview" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("approvedByUsername"), uid: "approved_by_username" },
      { name: t("approvedByLecturer"), uid: "approved_by_lecturer" },
      { name: t("approvalDate"), uid: "approval_date" },
      { name: t("leavePeriodStatus"), uid: "leave_period_status" },
      { name: t("daysUntilStart"), uid: "days_until_start" },
      { name: t("actions"), uid: "actions" }
    ],
    [t]
  );

  const visibleCols = [
    "id",
    "student_code",
    "student_name_en",
    "class_name",
    "faculty_name_en",
    "request_date",
    "start_date",
    "end_date",
    "total_days",
    "status",
    "actions"
  ];

  const status = [
    { name: "Pending", uid: "Pending" },
    { name: "Approved", uid: "Approved" },
    { name: "Rejected", uid: "Rejected" },
  ];

  // ==== Event Handlers ====
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchKeyword("");
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleDateChange = useCallback((field: keyof StudentLeaveFilter, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleView = useCallback((row: any) => {
    setViewRow(row);
    onOpenView();
  }, [onOpenView]);

  const handleApprove = useCallback((id: number) => {
    setSelectedId(id);
    setIsApprove(true);
    onOpenModal();
  }, [onOpenModal]);

  const handleReject = useCallback((id: number) => {
    setSelectedId(id);
    setIsApprove(false);
    onOpenModal();
  }, [onOpenModal]);

  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedIds(keys);
    console.log("Selected IDs:", Array.from(keys).map(Number));
  }, []);

  // ==== Filter Mutations ====
  const { mutate: filterAuditLog, loading: filterLoading } = useMutation({
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

  // Handle pagination changes when filtered
  useEffect(() => {
    const applyFilterWithPagination = async () => {
      const payload = {
        faculty: filter.faculty ? Number(filter.faculty) : null,
        field: filter.field ? Number(filter.field) : null,
        classId: filter.classId ? Number(filter.classId) : null,
        student: filter.student ? Number(filter.student) : null,
        status: filter.status,
        startDate: formatDateValue(filter.startDate),
        endDate: formatDateValue(filter.endDate),
        search: filter.search,
        page: pagination.page,
        limit: pagination.limit,
      };
      await filterAuditLog(`/student/leavereq/filter`, payload, "POST");
    };

    if (isFiltered && pagination.page > 1) {
      applyFilterWithPagination();
    }
  }, [isFiltered, pagination.page, filter, pagination.limit, filterAuditLog]);

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetch();
  }, [defaultFilter, refetch]);

  const applyFilter = useCallback(async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));

    const payload = {
      faculty: filter.faculty ? Number(filter.faculty) : null,
      field: filter.field ? Number(filter.field) : null,
      classId: filter.classId ? Number(filter.classId) : null,
      student: filter.student ? Number(filter.student) : null,
      status: filter.status,
      startDate: formatDateValue(filter.startDate),
      endDate: formatDateValue(filter.endDate),
      page: 1,
      limit: pagination.limit,
    };

    await filterAuditLog(`/student/leavereq/filter`, payload, "POST");
  }, [filter, pagination.limit, filterAuditLog]);


  // ====== Batch Approve & Reject ======

  const { mutate: batchAction, loading: batchActionLoading } = useMutation({
    onSuccess: async (res) => {
      await refetch();
      onClose();
      setSelectedIds(new Set([]));
      ShowToast({ color: "success", title: "Success", description: res.response?.data?.message  ||  "Leave request approved successfully" });
    },
    onError: (err) => {
      console.log("Approve error : ", err);
      ShowToast({ color: "error", title: "Error", description: err.response?.data?.message || "Failed to approve leave request" });
    },
  });

  const batchActionHandler = async (action: string) => {
    const convertSelectedIds = (ids: Key[]) => ids.map(String).join(",");
    const payload = {
      leaveIds: convertSelectedIds(Array.from(selectedIds)),
      action,
      adminNote: action,
    };
    console.log(payload, "payload");
    await batchAction(`/student/leavereq/batch`, payload, "POST");
  };


  // ==== Column Customize ====
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

  const customizeCols = useCallback((data: any) => {
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
  }, []);

  const colsKeys = useMemo(() => [
    { key: "action", value: customizeCols },
  ], [customizeCols]);

  const selectedLength = Array.from(selectedIds).length;

  const headerAction = (
    <div className="flex items-center gap-2">
      {
        selectedLength > 0 ? (
          <>
            <Button
              onPress={() => batchActionHandler("Approved")}
              size="sm"
              variant="solid"
              color="primary"
              radius="lg"
              startContent={batchActionLoading ? <Spinner variant="spinner" color="white" size="sm" /> : <MdFilterTiltShift size={16} />}
              isDisabled={Array.from(selectedIds).length === 0 || batchActionLoading}
            >
              {t("approve")}
            </Button>
            <Button
              onPress={() => batchActionHandler("Rejected")}
              size="sm"
              variant="solid"
              color="danger"
              radius="lg"
              startContent={batchActionLoading ? <Spinner variant="spinner" color="white" size="sm" /> : <MdFilterTiltShift size={16} />}
              isDisabled={Array.from(selectedIds).length === 0 || batchActionLoading}
            >
              {t("reject")}
            </Button>
          </>
        ) : (
          <>
            <Button
              onPress={() => ShowToast({ color: "warning", title: "Warning", description: "Please select at least one leave request" })}
              size="sm"
              variant="solid"
              color="primary"
              radius="lg"
              startContent={ <MdFilterTiltShift size={16} />}
              className="opacity-50 hover:opacity-50"
            >
              {t("approve")}
            </Button>
            <Button
              onPress={() => ShowToast({ color: "warning", title: "Warning", description: "Please select at least one leave request" })}
              size="sm"
              variant="solid"
              color="danger"
              radius="lg"
              startContent={<MdFilterTiltShift size={16} />}
              className="opacity-50 hover:opacity-50"
            >
              {t("reject")}
            </Button>
          </>
        )
      }
    </div>
  );

  return (
    <div className="p-4">
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />
      <Form 
        isOpen={isOpenModal} 
        onClose={onCloseModal} 
        loadList={refetch} 
        isApprove={isApprove} 
        leaveId={selectedId} 
      />

      {/* === Filter Drawer === */}
      <Drawer 
        isOpen={isOpen} 
        onClose={onClose} 
        size="xs" 
        radius="none" 
        backdrop="transparent" 
        shadow="none"
      >
        <DrawerHeader>
          <h2 className="text-lg font-semibold">{t("filter")}</h2>
        </DrawerHeader>
        <DrawerContent>
          <DrawerBody>
            <form className="space-y-4">
              {/* Date & Time */}
              <div>
                <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                  {t("dateTimeRange")}
                </h3>
                <Divider className="mb-2" />
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label={t("startDate")}
                    value={filter.startDate}
                    onChange={(val) => handleDateChange("startDate", val)}
                    maxValue={filter.endDate}
                    labelPlacement="outside"
                    size="sm"
                    classNames={{
                      selectorIcon: "text-sm",
                      selectorButton: "p-0"
                    }}
                  />
                  <DatePicker
                    label={t("endDate")}
                    value={filter.endDate}
                    onChange={(val) => handleDateChange("endDate", val)}
                    minValue={filter.startDate}
                    labelPlacement="outside"
                    size="sm"
                    classNames={{
                      selectorIcon: "text-sm",
                      selectorButton: "p-0"
                    }}
                  />
                </div>
              </div>

              {/* General Filters */}
              <div>
                <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                  {t("general")}
                </h3>
                <Divider className="mb-4" />
                <div className="grid grid-cols-1 gap-2">
                  <Autocomplete
                    label={t("faculty")}
                    placeholder={t("chooseFaculty")}
                    selectedKey={filter.faculty ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        faculty: key?.toString() || null,
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                    isLoading={formLoadLoading}
                  >
                    {formLoad?.data?.faculties?.map((u: { id: string; name_en: string; name_kh: string }) => (
                      <AutocompleteItem key={u.id}>
                        {u.name_en + " - " + u.name_kh}
                      </AutocompleteItem>
                    )) || []}
                  </Autocomplete>

                  <Autocomplete
                    label={t("field")}
                    placeholder={t("chooseField")}
                    selectedKey={filter.field ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        field: key?.toString() || null,
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                  >
                    {formLoad?.data?.fields?.map((a: { id: string; field_name_en: string; field_name_kh: string }) => (
                      <AutocompleteItem key={a.id}>
                        {a.field_name_en + " - " + a.field_name_kh}
                      </AutocompleteItem>
                    )) || []}
                  </Autocomplete>

                  <Autocomplete
                    label={t("class")}
                    placeholder={t("chooseClass")}
                    selectedKey={filter.classId ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        classId: key?.toString() || null,
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                  >
                    {formLoad?.data?.classes?.map((a: { id: string; class_name: string }) => (
                      <AutocompleteItem key={a.id}>{a.class_name}</AutocompleteItem>
                    )) || []}
                  </Autocomplete>

                  <Autocomplete
                    label={t("student")}
                    placeholder={t("chooseStudent")}
                    selectedKey={filter.student ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        student: key?.toString() || null,
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                    isLoading={formLoadLoading}
                  >
                    {formLoad?.data?.students?.map((u: { id: string; name_en: string; name_kh: string }) => (
                      <AutocompleteItem key={u.id}>
                        {u.name_en + " - " + u.name_kh}
                      </AutocompleteItem>
                    )) || []}
                  </Autocomplete>

                  <Autocomplete
                    label={t("status")}
                    placeholder={t("chooseStatus")}
                    selectedKey={filter.status ?? ""}
                    isClearable
                    onSelectionChange={(key) =>
                      setFilter((prev) => ({
                        ...prev,
                        status: key?.toString() || null,
                      }))
                    }
                    labelPlacement="outside"
                    size="sm"
                    isLoading={formLoadLoading}
                  >
                    {formLoad?.data?.status?.map((u: { label: string; value: string }) => (
                      <AutocompleteItem key={u.value}>{u.label}</AutocompleteItem>
                    )) || []}
                  </Autocomplete>
                </div>
              </div>
            </form>
          </DrawerBody>
        </DrawerContent>
        <DrawerFooter>
          <Button 
            onPress={resetFilter} 
            size="sm" 
            variant="flat" 
            color="danger" 
            startContent={<GrClear size={16} />}
          >
            {t("reset")}
          </Button>
          <Button
            onPress={applyFilter}
            size="sm"
            variant="solid"
            color="primary"
            isLoading={filterLoading}
            startContent={<MdFilterTiltShift size={16} />}
          >
            {t("apply")}
          </Button>
        </DrawerFooter>
      </Drawer>

      {/* === Table === */}
      <DataTable
        loading={loading || filterLoading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        loadData={refetch}
        selectRow={true}
        selectedKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        onOpenFilter={onOpen}
        isFiltered={isFiltered}
        colKeys={colsKeys}
        status={status}
        permissionCreate="create:auditlog"
        permissionDelete="delete:auditlog"
        permissionEdit="update:auditlog"
        permissionView="view:auditlog"
        searchKeyword={searchKeyword}
        onSearchInputChange={handleSearchChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={(newPage: number) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
        customizes={{
          header: headerAction ,
        }}
      />
    </div>
  );
};

export default Index;