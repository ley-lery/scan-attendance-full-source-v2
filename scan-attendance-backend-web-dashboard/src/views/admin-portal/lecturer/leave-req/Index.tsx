import { useEffect, useMemo, useState, useCallback, type Key } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { Button, Spinner, Tooltip, type Selection } from "@heroui/react";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import { MdFilterTiltShift } from "react-icons/md";
import Form from "./Form";
import { cn } from "@/lib/utils";
import Filter from "./Filter";
import { FaUser } from "react-icons/fa";
import { formatDateValue } from "@/helpers";
import { KhmerDate } from "@/helpers";

// === Types ===

interface LecturerLeaveFilter {
  course?: number | null;
  lecturer?: number | null;
  status?: string;
  startDate?: DateValue | null;
  endDate?: DateValue | null;
  page?: number;
  limit?: number;
}
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
  const [totalPage, setTotalPage] = useState(1);

  // Row selection state for multiple approve/reject
  const [selectedIds, setSelectedIds] = useState<Selection>(new Set([]));

  const defaultFilter: LecturerLeaveFilter = useMemo(
    () => ({
      course: null,
      lecturer: null,
      status: "",
      startDate: today(getLocalTimeZone()),
      endDate: today(getLocalTimeZone()),
      page: 1,
      limit: 10,
    }),
    []
  );

  const [filter, setFilter] = useState<LecturerLeaveFilter>(defaultFilter);

  // ==== Pagination ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

 
  // ==== Fetch Data ====
  const { data, loading, refetch } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/admin/lecturer/leavereq/list" : "/admin/lecturer/leavereq/search", 
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }),
      },
      deps: [pagination.page, pagination.limit, searchKeyword], 
      enabled: !isFiltered,
    }
  );

  useEffect(() => {
    console.log("data", data);
    if (!isFiltered && data?.data) {
      setRows(data.data.rows || []);
      setTotalPage(Math.ceil((data.data.total || 0) / pagination.limit) || 1);
    }
  }, [data, isFiltered, pagination.limit]);

  // ==== Table Columns ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("lecturerCode"), uid: "lecturer_code", sortable: true },
      { name: t("lecturerNameKh"), uid: "lecturer_name_kh", sortable: true },
      { name: t("lecturerNameEn"), uid: "lecturer_name_en", sortable: true },
      { name: t("lecturerEmail"), uid: "lecturer_email" },
      { name: t("lecturerPhone"), uid: "lecturer_phone" },
      { name: t("requestDate"), uid: "request_date", sortable: true },
      { name: t("startDate"), uid: "start_date", sortable: true },
      { name: t("endDate"), uid: "end_date", sortable: true },
      { name: t("totalDays"), uid: "total_days" },
      { name: t("reasonPreview"), uid: "reason_preview" },
      { name: t("approvedByUser"), uid: "approved_by_username" },
      { name: t("approvalDate"), uid: "approval_date" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("actions"), uid: "actions" },
    ],
    [t]
  );

  // ==== Default Visible Columns ====
  const visibleCols = [
    "id",
    "lecturer_code",
    "lecturer_name_en",
    "reason_preview",
    "request_date",
    "start_date",
    "end_date",
    "total_days",
    "approved_by_username",
    "status",
    "actions",
  ];

  const status = [
    { name: "Pending", uid: "Pending" },
    { name: "Approved", uid: "Approved" },
    { name: "Rejected", uid: "Rejected" },
    { name: "Cancelled", uid: "Cancelled" },
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

  const handleView = useCallback(
    (row: any) => {
      setViewRow(row);
      onOpenView();
    },
    [onOpenView]
  );

  const handleApprove = useCallback(
    (id: number) => {
      setSelectedId(id);
      setIsApprove(true);
      onOpenModal();
    },
    [onOpenModal]
  );

  const handleReject = useCallback(
    (id: number) => {
      setSelectedId(id);
      setIsApprove(false);
      onOpenModal();
    },
    [onOpenModal]
  );

  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedIds(keys);
    console.log("Selected IDs:", Array.from(keys).map(Number));
  }, []);

  // ==== Filter Mutations ====
  const { mutate: filterStudentLeave, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
      setIsFiltered(true);
      onClose();
      console.log("response", response);
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to apply filter",
      });
    },
  });

  const applyFilterWithPagination = useCallback(
    async (page: number) => {
      const payload = {
        course: filter.course ? Number(filter.course) : null,
        lecturer: filter.lecturer ? Number(filter.lecturer) : null,
        status: filter.status,
        startDate: filter.startDate ? formatDateValue(filter.startDate) : null,
        endDate: filter.endDate ? formatDateValue(filter.endDate) : null,
        page: page,
        limit: pagination.limit,
      };
      console.log("payload", payload);
      await filterStudentLeave(`/admin/lecturer/leavereq/filter`, payload, "POST");
    },
    [filter, pagination.limit, filterStudentLeave]
  );

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetch();
  }, [defaultFilter, refetch]);

  const applyFilter = useCallback(async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  }, [applyFilterWithPagination]);

  // Handle page changes
  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPagination((prev) => ({ ...prev, page: newPage }));

      if (isFiltered) {
        await applyFilterWithPagination(newPage);
      }
    },
    [isFiltered, applyFilterWithPagination]
  );

  // ====== Batch Approve & Reject ======
  const { mutate: batchAction, loading: batchActionLoading } = useMutation({
    onSuccess: async (res) => {
      await refetch();
      onClose();
      setSelectedIds(new Set([]));
      ShowToast({
        color: "success",
        title: "Success",
        description:
          res.response?.data?.message || "Leave request approved successfully",
      });
    },
    onError: (err) => {
      console.log("Approve error : ", err);
      ShowToast({
        color: "error",
        title: "Error",
        description:
          err.response?.data?.message || "Failed to approve leave request",
      });
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
    await batchAction(`/admin/lecturer/leavereq/batch`, payload, "POST");
  };

  // ==== Column Customize ====
  const customizeCols = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2",
          "px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-2",
          value === "Unassigned" && "text-danger bg-danger/20",
          value !== "Unassigned" && "text-primary bg-primary/20"
        )}
      >
        <FaUser /> {value}
      </span>
    );
  }, []);
  const customizeColTotalDays = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2",
          "px-3 py-1 rounded-full w-fit text-xs/tight font-semibold inline-flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
        )}
      >
        {value} {value > 1 ? t("days") : t("day")}
      </span>
    );
  }, []);
  const customizeColDate = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <Tooltip content={<KhmerDate date={value} withDayName /> } placement="top" closeDelay={0} delay={0} color="primary" classNames={{base: "pointer-events-none"}}>
        {value}
      </Tooltip>
    );
  }, []);
  const customizeColNull = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span>
        {value || "N/A"}
      </span>
    );
  }, []);

  const colsKeys = useMemo(
    () => [
      { key: "approved_by_username", value: (data: any) => customizeCols(data, "approved_by_username") },
      { key: "request_date", value: (data: any) => customizeColDate(data, "request_date") },
      { key: "total_days", value: (data: any) => customizeColTotalDays(data, "total_days") },
      { key: "start_date", value: (data: any) => customizeColDate(data, "start_date") },
      { key: "end_date", value: (data: any) => customizeColDate(data, "end_date") },
      { key: "approval_date", value: (data: any) => customizeColNull(data, "approval_date") },
      { key: "reason_preview", value: (data: any) => customizeColNull(data, "reason_preview") },
    ],
    [customizeCols]
  );
  
  const selectedLength = Array.from(selectedIds).length;

  const headerAction = (
    <div className="flex items-center gap-2">
      {selectedLength > 0 ? (
        <>
          <Button
            onPress={() => batchActionHandler("Approved")}
            size="sm"
            variant="solid"
            color="primary"
            radius="lg"
            startContent={
              batchActionLoading ? (
                <Spinner variant="spinner" color="white" size="sm" />
              ) : (
                <MdFilterTiltShift size={16} />
              )
            }
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
            startContent={
              batchActionLoading ? (
                <Spinner variant="spinner" color="white" size="sm" />
              ) : (
                <MdFilterTiltShift size={16} />
              )
            }
            isDisabled={Array.from(selectedIds).length === 0 || batchActionLoading}
          >
            {t("reject")}
          </Button>
        </>
      ) : (
        <>
          <Button
            onPress={() =>
              ShowToast({
                color: "warning",
                title: "Warning",
                description: "Please select at least one leave request",
              })
            }
            size="sm"
            variant="solid"
            color="primary"
            radius="lg"
            startContent={<MdFilterTiltShift size={16} />}
            className="opacity-50 hover:opacity-50"
          >
            {t("approve")}
          </Button>
          <Button
            onPress={() =>
              ShowToast({
                color: "warning",
                title: "Warning",
                description: "Please select at least one leave request",
              })
            }
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
      )}
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

      {/* === Filter Component === */}
      <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={applyFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
      />

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
        onChangePage={handlePageChange}
        customizes={{
          header: headerAction,
        }}
      />
    </div>
  );
};

export default Index;