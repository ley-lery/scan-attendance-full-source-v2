// Lecturer Leave Request
import { useEffect, useMemo, useState, useCallback, type Key, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { type DateValue } from "@internationalized/date";
import { DataTable, ShowToast, Button } from "@/components/hero-ui";
import { Spinner, Tooltip, type Selection } from "@heroui/react";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import { useDisclosure } from "@/god-ui";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { formatDateValue, KhmerDate } from "@/helpers";
import { MdFilterTiltShift } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import View from "./View";
import Form from "./Form";
import FilterData from "./FilterData";

// ==== Types ====
interface LecturerLeaveFilter {
  lecturer?: number | null;
  status?: string | null;
  startDate?: DateValue | null;
  endDate?: DateValue | null;
  requestDate?: DateValue | null;
  approvedByUser?: number | null;
  deleted?: boolean | number | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

// ==== Custom Hooks for Modal Management ====
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

  // ==== Modal State ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpenModal, onOpenModal, onCloseModal } = useModalClosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [viewRow, setViewRow] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Selection>(new Set([]));
  const [isChangingPageSize, setIsChangingPageSize] = useState(false);

  // ==== Default Filter ====
  const defaultFilter: LecturerLeaveFilter = useMemo(
    () => ({
      lecturer: null,
      status: null,
      startDate: null,
      endDate: null,
      requestDate: null,
      approvedByUser: null,
      deleted: false,
      search: "",
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


  // ================= Start Data Fetching Block =================

  const { data, loading } = useFetch<{ rows: any[]; total_count: number }>(
    "/admin/lecturer/leavereq/list",
    {
      params: { page: pagination.page, limit: pagination.limit },
      deps: [pagination.page, pagination.limit],
      enabled: !isFiltered && debouncedSearchKeyword.trim() === "",
    }
  );

  useEffect(() => {
    if (!isFiltered && data?.data && debouncedSearchKeyword.trim() === "") {
      setRows(data.data.rows || []);
      setTotalPage(Math.ceil((data.data.total || 0) / pagination.limit) || 1);
    }
  }, [data, isFiltered, pagination.limit, debouncedSearchKeyword]);

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

  // ================= End Table Configuration Block =================


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
  }, []);

  // ================= End Event Handlers Block =================



  // ================= Start Filter Block =================

  const { mutate: filterLecturerLeave, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
      setIsFiltered(true);
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
        lecturer: filter.lecturer ? Number(filter.lecturer) : null,
        status: filter.status,
        startDate: filter.startDate ? formatDateValue(filter.startDate) : null,
        endDate: filter.endDate ? formatDateValue(filter.endDate) : null,
        requestDate: filter.requestDate ? formatDateValue(filter.requestDate) : null,
        approvedByUser: filter.approvedByUser ? Number(filter.approvedByUser) : null,
        deleted: filter.deleted ? 1 : 0 ? null : null,
        search: debouncedSearchKeyword?.trim() || null,
        page,
        limit: pagination.limit,
      };
      await filterLecturerLeave(`/admin/lecturer/leavereq/filter`, payload, "POST");
    },
    [filter, pagination.limit, filterLecturerLeave, debouncedSearchKeyword]
  );

  const refetch = async () => {
    const payload = {
      lecturer: filter.lecturer ? Number(filter.lecturer) : null,
      status: filter.status,
      startDate: filter.startDate ? formatDateValue(filter.startDate) : null,
      endDate: filter.endDate ? formatDateValue(filter.endDate) : null,
      requestDate: filter.requestDate ? formatDateValue(filter.requestDate) : null,
      approvedByUser: filter.approvedByUser ? Number(filter.approvedByUser) : null,
      deleted: filter.deleted ? 1 : 0 ? null : null,
      search: debouncedSearchKeyword?.trim() || null,
      page: pagination.page,
      limit: pagination.limit,
    };
    await filterLecturerLeave(`/admin/lecturer/leavereq/filter`, payload, "POST");
  };

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
    setSearchKeyword("");
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [defaultFilter]);

  const applyFilter = useCallback(async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  }, [applyFilterWithPagination]);


  // ==== Pagination Handler ====
  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      if (isFiltered || debouncedSearchKeyword.trim() !== "") {
        await applyFilterWithPagination(newPage);
      }
    },
    [isFiltered, debouncedSearchKeyword, applyFilterWithPagination]
  );

  const handlePageSizeChange = useCallback(
    async (newLimit: number) => {
      startTransition(async () => {
        setIsChangingPageSize(true);
        try {
          setPagination(prev => ({ ...prev, page: 1, limit: newLimit }));
          await new Promise(r => setTimeout(r, 100));

          if (isFiltered || debouncedSearchKeyword.trim() !== "") {
            await applyFilterWithPagination(1);
          }
        } catch (error) {
          ShowToast({
            color: "error",
            title: "Error",
            description: "Failed to change page size",
          });
        } finally {
          setIsChangingPageSize(false);
        }
      });
    },
    [isFiltered, debouncedSearchKeyword, applyFilterWithPagination]
  );
  // ================= End Filter Block =================



  // ================= Start Batch Approve/Reject Block =================

  // ==== Batch Approve/Reject ====
  const { mutate: batchAction, loading: batchActionLoading } = useMutation({
    onSuccess: async (res) => {
      await refetch();
      setSelectedIds(new Set([]));
      ShowToast({
        color: "success",
        title: "Success",
        description: res.response?.data?.message || "Leave request updated successfully",
      });
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.response?.data?.message || "Failed to update leave request",
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
    await batchAction(`/admin/lecturer/leavereq/batch`, payload, "POST");
  };

  // ================= End Batch Approve/Reject Block =================



  // ================= Start Column Customization Block =================

  const customizeCols = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs/tight font-medium",
          value === "Unassigned" ? "text-danger bg-danger/20" : "text-primary bg-primary/20"
        )}
      >
        <FaUser /> {value}
      </span>
    );
  }, []);

  const customizeColTotalDays = useCallback(
    (data: any, key: string) => {
      const value = data[key];
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs/tight font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
          {value} {value > 1 ? t("days") : t("day")}
        </span>
      );
    },
    [t]
  );

  const customizeColDate = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <Tooltip
        content={<KhmerDate date={value} withDayName />}
        placement="top"
        closeDelay={0}
        delay={0}
        color="primary"
        classNames={{ base: "pointer-events-none" }}
      >
        {value}
      </Tooltip>
    );
  }, []);

  const customizeColNull = useCallback((data: any, key: string) => {
    const value = data[key];
    return <span>{value || "N/A"}</span>;
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
    [customizeCols, customizeColDate, customizeColTotalDays, customizeColNull]
  );

  // ================= End Column Customization Block =================



  // ================= Start Table Header Action Block =================

  const selectedLength = Array.from(selectedIds).length;

  const startContent = batchActionLoading ? (<Spinner variant="spinner" color="white" size="sm" />) : (<MdFilterTiltShift size={16} />);
  const notSeleted = () => ShowToast({ color: "warning", title: "Warning", description: "Please select at least one leave request" });
  const isDisabled = selectedLength === 0 || batchActionLoading;

  const headerAction = (
    <div className="flex items-center gap-1">
      {selectedLength > 0 ? (
        <>
          <Button
            onPress={() => batchActionHandler("Approved")}
            size="sm"
            variant="solid"
            color="primary"
            startContent={ startContent }
            isDisabled={isDisabled}
          >
            {t("approve")}
          </Button>
          <Button
            onPress={() => batchActionHandler("Rejected")}
            size="sm"
            variant="solid"
            color="danger"
            startContent={ startContent }
            isDisabled={isDisabled}
          >
            {t("reject")}
          </Button>
        </>
      ) : (
        <>
          <Button
            onPress={notSeleted}
            size="sm"
            variant="solid"
            color="primary"
            startContent={<MdFilterTiltShift size={16} />}
            className="opacity-50 hover:opacity-50"
          >
            {t("approve")}
          </Button>
          <Button
            onPress={notSeleted}
            size="sm"
            variant="solid"
            color="danger"
            startContent={<MdFilterTiltShift size={16} />}
            className="opacity-50 hover:opacity-50"
          >
            {t("reject")}
          </Button>
        </>
      )}
    </div>
  );

  // ================= End Table Header Action Block =================

  const filterSection =  <FilterData filter={filter} setFilter={setFilter} onApplyFilter={applyFilter} onResetFilter={resetFilter} filterLoading={filterLoading} />


  return (
    <div className="p-4">
      {/* <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={applyFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
      /> */}

      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />
      <Form isOpen={isOpenModal} onClose={onCloseModal} loadList={refetch} isApprove={isApprove} leaveId={selectedId} />
      
      <DataTable
        loading={loading || filterLoading || isChangingPageSize}
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
        // onOpenFilter={onOpen}
        isFiltered={isFiltered}
        colKeys={colsKeys}
        status={status}
        permissionCreate="create:auditlog"
        permissionDelete="delete:auditlog"
        permissionEdit="update:auditlog"
        permissionView="view:auditlog"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
        limit={pagination.limit}
        handlePageSizeChange={handlePageSizeChange}
        customizes={{ header: headerAction }}
        filterSection={filterSection}
        showFilterSection={true}  
      />
    </div>
  );
};

export default Index;