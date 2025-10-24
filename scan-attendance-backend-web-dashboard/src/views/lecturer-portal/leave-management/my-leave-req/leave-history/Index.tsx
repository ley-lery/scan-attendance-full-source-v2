// Lecturer Leave History
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import { useDisclosure } from "@/god-ui";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { MetricCard } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatDateValue } from "@/helpers";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { FaRegCircle, FaUser } from "react-icons/fa";
import Filter from "./Filter";
import View from "./View";

// ==== Types ====
interface FilterData {
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "";
  reqDate: DateValue | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  page: number;
  limit: number;
}

// ==== Default Filter ====
const defaultFilter: FilterData = {
  status: "",
  reqDate: null,
  startDate: null,
  endDate: null,
  page: 1,
  limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
};

// ==== Custom Hooks for Modal Management ====
const useViewClosure = () => {
  const { isOpen, onOpen, onClose, ...rest } = useDisclosure();
  return {
    isOpenView: isOpen,
    onOpenView: onOpen,
    onCloseView: onClose,
    ...rest,
  };
};

const Index = () => {
  const { t } = useTranslation();

  // ==== Modal State ====
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>(defaultFilter);
  const [filteredData, setFilteredData] = useState<{ rows: any[]; total: number } | null>(null);
  const [viewRow, setViewRow] = useState<any>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Filter Mutation ====
  const { mutate: filterAction, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      onClose();
      setFilteredData({
        rows: response?.data?.rows || [],
        total: response?.data?.total || 0,
      });
      setIsFiltered(true);
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err?.message || "Failed to apply filter",
      });
    },
  });

  // ==== Data Fetching ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ statuses: any[] }>(
    "/lecturer/leavehistory/formload"
  );

  const endpoint = debouncedSearchKeyword.trim() === ""
    ? "/lecturer/leavehistory/list"
    : "/lecturer/leavehistory/search";

  const {
    data: dataList,
    loading: loadingList,
    refetch: refetchList,
  } = useFetch<{ rows: any[]; total_count: number }>(endpoint, {
    params: {
      page: pagination.page,
      limit: pagination.limit,
      ...(debouncedSearchKeyword.trim() !== "" && { keyword: debouncedSearchKeyword }),
    },
    deps: [pagination.page, pagination.limit, debouncedSearchKeyword],
    enabled: !isFiltered,
  });

  // Auto-trigger search when debounced keyword changes
  useEffect(() => {
    if (debouncedSearchKeyword.trim() !== "" || isFiltered) {
      refetchList();
    }
  }, [debouncedSearchKeyword]);

  // ==== Table Data & Total Pages ====
  const dataRows = isFiltered ? filteredData?.rows : dataList?.data?.rows;
  const rows = dataRows || [];
  const totalCount = isFiltered ? filteredData?.total : dataList?.data?.total;
  const totalPage = Math.ceil((totalCount || 0) / pagination.limit) || 1;

  // ==== Table Columns ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("reason"), uid: "reason" },
      { name: t("requestDate"), uid: "request_date" },
      { name: t("startDate"), uid: "start_date" },
      { name: t("endDate"), uid: "end_date" },
      { name: t("totalDays"), uid: "total_days" },
      { name: t("reqStatus"), uid: "status", sortable: true },
      { name: t("approvedByUserEN"), uid: "approved_by_username" },
      { name: t("approvedByUserEmail"), uid: "approved_by_user_email" },
      { name: t("approvedByLecturerKH"), uid: "approved_by_lecturer_kh" },
      { name: t("approvedByLecturerEN"), uid: "approved_by_lecturer_en" },
      { name: t("approvalDate"), uid: "approval_date" },
      { name: t("approvalTime"), uid: "approval_time" },
      { name: t("adminNotes"), uid: "admin_notes" },
      { name: t("deletedDate"), uid: "deleted_date" },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  // ==== Default Visible Columns ====
  const visibleCols = [
    "reason",
    "request_date",
    "start_date",
    "end_date",
    "total_days",
    "approved_by_lecturer_en",
    "approved_by_username",
    "status",
    "actions",
  ];

  // ==== Status Options ====
  const status = [
    { name: "Approved", uid: "Approved" },
    { name: "Pending", uid: "Pending" },
    { name: "Rejected", uid: "Rejected" },
    { name: "Cancelled", uid: "Cancelled" },
  ];

  // ==== Event Handlers ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    
    // Clear filter when searching
    if (isFiltered) {
      setIsFiltered(false);
      setFilteredData(null);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const onView = (row: object) => {
    setViewRow(row);
    onOpenView();
  };

  // ==== Filter Handlers ====
  const resetFilter = () => {
    setFilter(defaultFilter);
    setSearchKeyword("");
    setIsFiltered(false);
    setFilteredData(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const onFilter = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));

    const payload = {
      status: filter.status || "",
      reqDate: filter.reqDate ? formatDateValue(filter.reqDate) : null,
      startDate: filter.startDate ? formatDateValue(filter.startDate) : null,
      endDate: filter.endDate ? formatDateValue(filter.endDate) : null,
      page: 1,
      limit: pagination.limit,
    };

    await filterAction(`/lecturer/leavehistory/filter`, payload, "POST");
  };

  // ==== Pagination Handler ====
  const handlePageChange = async (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));

    if (isFiltered) {
      const payload = {
        status: filter.status || "",
        reqDate: filter.reqDate ? formatDateValue(filter.reqDate) : null,
        startDate: filter.startDate ? formatDateValue(filter.startDate) : null,
        endDate: filter.endDate ? formatDateValue(filter.endDate) : null,
        page: newPage,
        limit: pagination.limit,
      };

      await filterAction(`/lecturer/leavehistory/filter`, payload, "POST");
    }
  };

  // ==== Statistics Cards ====
  const cardStats = [
    {
      title: t("approved"),
      number: formLoadLoading ? 0 : formLoad?.data?.states?.approved_requests,
      subtitle: t("times"),
      icon: <IoIosCheckmarkCircleOutline size={25} />,
      color: "success",
    },
    {
      title: t("pending"),
      number: formLoadLoading ? 0 : formLoad?.data?.states?.pending_requests,
      subtitle: t("times"),
      icon: <PiWarningCircle size={25} />,
      color: "warning",
    },
    {
      title: t("rejected"),
      number: formLoadLoading ? 0 : formLoad?.data?.states?.rejected_requests,
      subtitle: t("times"),
      icon: <SlClose size={22} />,
      color: "danger",
    },
    {
      title: t("cancelled"),
      number: formLoadLoading ? 0 : formLoad?.data?.states?.cancelled_requests,
      subtitle: t("times"),
      icon: <SlClose size={22} />,
      color: "secondary",
    },
    {
      title: t("total"),
      number: formLoadLoading ? 0 : formLoad?.data?.states?.total_requests,
      subtitle: t("times"),
      icon: <FaRegCircle size={22} />,
      color: "primary",
    },
  ];

  // ==== Column Customization ====
  const customizeColClosed = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs/tight font-medium",
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
      <span className="flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs/tight font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
        {value} {value > 1 ? t("days") : t("day")}
      </span>
    );
  }, [t]);

  const colsKeys = useMemo(
    () => [
      {
        key: "approved_by_lecturer_en",
        value: (data: any) => customizeColClosed(data, "approved_by_lecturer_en"),
      },
      {
        key: "approved_by_username",
        value: (data: any) => customizeColClosed(data, "approved_by_username"),
      },
      {
        key: "approved_by_user_email",
        value: (data: any) => customizeColClosed(data, "approved_by_user_email"),
      },
      {
        key: "approved_by_lecturer_kh",
        value: (data: any) => customizeColClosed(data, "approved_by_lecturer_kh"),
      },
      {
        key: "deleted_date",
        value: (data: any) => customizeColClosed(data, "deleted_date"),
      },
      {
        key: "total_days",
        value: (data: any) => customizeColTotalDays(data, "total_days"),
      },
    ],
    [customizeColClosed, customizeColTotalDays]
  );

  return (
    <div className="p-4 space-y-4">
      <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={onFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
      />
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cardStats.map((card, index) => (
          <MetricCard
            key={index}
            title={card.title}
            description={card.subtitle}
            type="Presents"
            value={card.number}
            variant={card.color as "success" | "warning" | "danger" | "secondary"}
            icon={card.icon}
            showProgress={false}
            showChart={!loadingList}
            colorChart={card.color}
            classNames={{
              base: "bg-white dark:bg-zinc-800 min-h-32 max-h-32",
            }}
          />
        ))}
      </div>

      <DataTable
        loading={loadingList || filterLoading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        colKeys={colsKeys}
        loadData={refetchList}
        selectRow={false}
        onOpenFilter={onOpen}
        isFiltered={isFiltered}
        onView={(data: any) => onView(data)}
        permissionView="view:studentleavehistory"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
        status={status}
      />
    </div>
  );
};

export default Index;