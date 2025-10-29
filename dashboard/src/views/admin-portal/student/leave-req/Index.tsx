// Student Leave Request
import { useEffect, useMemo, useState, useCallback, type Key, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { type DateValue } from "@internationalized/date";
import { DataTable, ShowToast, Button } from "@/components/hero-ui";
import { Spinner, type Selection } from "@heroui/react";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import { useDisclosure } from "@/god-ui";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { formatDateValue } from "@/helpers";
import { MdFilterTiltShift } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import View from "./View";
import Form from "./Form";
import FilterData from "./FilterData";

// ==== Types ====
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
  const defaultFilter: StudentLeaveFilter = useMemo(
    () => ({
      faculty: null,
      field: null,
      classId: null,
      student: null,
      status: "",
      startDate: null,
      endDate: null,
      search: null,
      page: 1,
      limit: 10,
    }),
    []
  );
  const [filter, setFilter] = useState<StudentLeaveFilter>(defaultFilter);

  // ==== Pagination ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 20,
  });

  // ================= Start Data Fetching Block =================

  const { data, loading } = useFetch<{ rows: any[]; total_count: number }>("/student/leavereq/list" , {
    params: {
      page: pagination.page,
      limit: pagination.limit,
    },
    deps: [pagination.page, pagination.limit],
    enabled: !isFiltered && debouncedSearchKeyword.trim() === "",
  });

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
      { name: t("id"), uid: "id" },
      { name: t("studentCode"), uid: "student_code" },
      { name: t("studentNameKh"), uid: "student_name_kh" },
      { name: t("studentNameEn"), uid: "student_name_en" },
      { name: t("studentEmail"), uid: "student_email" },
      { name: t("studentPhone"), uid: "student_phone" },
      { name: t("className"), uid: "class_name" },
      { name: t("programType"), uid: "program_type" },
      { name: t("promotionNo"), uid: "promotion_no" },
      { name: t("termNo"), uid: "term_no" },
      { name: t("facultyNameEn"), uid: "faculty_name_en" },
      { name: t("fieldNameEn"), uid: "field_name_en" },
      { name: t("requestDate"), uid: "request_date" },
      { name: t("startDate"), uid: "start_date" },
      { name: t("endDate"), uid: "end_date" },
      { name: t("totalDays"), uid: "total_days" },
      { name: t("reasonPreview"), uid: "reason_preview" },
      { name: t("status"), uid: "status" },
      { name: t("approvedByUsername"), uid: "approved_by_username" },
      { name: t("approvedByLecturer"), uid: "approved_by_lecturer" },
      { name: t("approvalDate"), uid: "approval_date" },
      { name: t("leavePeriodStatus"), uid: "leave_period_status" },
      { name: t("daysUntilStart"), uid: "days_until_start" },
      { name: t("actions"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = [
    "id",
    "student_code",
    "student_name_en",
    "class_name",
    "request_date",
    "start_date",
    "end_date",
    "total_days",
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

  const { mutate: filterData, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      console.log(response, 'data filter');
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
      setIsFiltered(true);
    },
    onError: (err) => {
      ShowToast({ 
        color: "error", 
        title: "Error", 
        description: err.message || "Failed to apply filter" 
      });
    },
  });

  const applyFilterWithPagination = useCallback(
    async (page: number) => {
      const payload = {
        faculty: filter.faculty ? Number(filter.faculty) : null,
        field: filter.field ? Number(filter.field) : null,
        classId: filter.classId ? Number(filter.classId) : null,
        student: filter.student ? Number(filter.student) : null,
        status: filter.status,
        startDate: formatDateValue(filter.startDate),
        endDate: formatDateValue(filter.endDate),
        search: debouncedSearchKeyword?.trim() || null,
        page,
        limit: pagination.limit,
      };
      console.log(payload, 'data filter');
      await filterData(`/student/leavereq/filter`, payload, "POST");
    },
    [filter, pagination.limit, filterData, debouncedSearchKeyword]
  );

  const refetch = async () => {
    const payload = {
      faculty: filter.faculty ? Number(filter.faculty) : null,
      field: filter.field ? Number(filter.field) : null,
      classId: filter.classId ? Number(filter.classId) : null,
      student: filter.student ? Number(filter.student) : null,
      status: filter.status,
      startDate: formatDateValue(filter.startDate),
      endDate: formatDateValue(filter.endDate),
      search: debouncedSearchKeyword?.trim() || null,
      page: pagination.page,
      limit: pagination.limit,
    };
    await filterData(`/student/leavereq/filter`, payload, "POST");
  };

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetch();
  }, [defaultFilter]);

  const applyFilter = useCallback(async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  }, [applyFilterWithPagination]);

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

  const { mutate: batchAction, loading: batchActionLoading } = useMutation({
    onSuccess: async (res) => {
      await refetch();
      setSelectedIds(new Set([]));
      ShowToast({ 
        color: "success", 
        title: "Success", 
        description: res.response?.data?.message || "Leave request approved successfully" 
      });
    },
    onError: (err) => {
      ShowToast({ 
        color: "error", 
        title: "Error", 
        description: err.response?.data?.message || "Failed to approve leave request" 
      });
    },
  });

  const batchActionHandler = async (action: string) => {
    const convertSelectedIds = (ids: Key[]) => ids.map(String).join(",");
    const payload = { 
      leaveIds: convertSelectedIds(Array.from(selectedIds)), 
      action, 
      adminNote: action 
    };
    await batchAction(`/student/leavereq/batch`, payload, "POST");
  };

  // ================= End Batch Approve/Reject Block =================



  // ================= Start Column Customization Block =================

  const customizeColClosed = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full w-fit font-medium",
          value === "Closed" && "text-danger bg-danger/20"
        )}
      >
        {value === "Closed" && <FaRegCircle />} {value}
      </span>
    );
  }, []);
  const customizeColTotalDays = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2",
          "px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800",
        )}
      >
        {value} {value > 1 ? t("days") : t("day")}
      </span>
    );
  }, []);

  const colsKeys = useMemo(
    () => [
      { key: "faculty_name_en", value: (data: any) => customizeColClosed(data, "faculty_name_en") },
      { key: "field_name_en", value: (data: any) => customizeColClosed(data, "field_name_en") },
      { key: "class_name", value: (data: any) => customizeColClosed(data, "class_name") },
      { key: "total_days", value: (data: any) => customizeColTotalDays(data, "total_days") },
    ],
    [customizeColClosed]
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
            startContent={startContent}
            isDisabled={isDisabled}
          >
            {t("approve")}
          </Button>
          <Button
            onPress={() => batchActionHandler("Rejected")}
            size="sm"
            variant="solid"
            color="danger"
            startContent={startContent}
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
            startContent={startContent}
            className="opacity-50 hover:opacity-50"
          >
            {t("approve")}
          </Button>
          <Button
            onPress={notSeleted}
            size="sm"
            variant="solid"
            color="danger"
            startContent={startContent}
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
        selectRow
        selectedKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        isFiltered={isFiltered}
        colKeys={colsKeys}
        status={status}
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
        customizes={{ header: headerAction }}
        filterSection={filterSection}
        showFilterSection
        limit={pagination.limit}
        handlePageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Index;