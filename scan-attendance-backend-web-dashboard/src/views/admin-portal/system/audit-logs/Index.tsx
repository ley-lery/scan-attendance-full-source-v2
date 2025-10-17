import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { cn } from "@/lib/utils";
import View from "./View";
import { useMutation } from "@/hooks/useMutation";
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import Filter from "./Filter";

// === Helpers ===
const formatDateValue = (date: DateValue | null) => (date ? date.toString() : null);

// Custom hook for separate view dialog
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return { isOpenView: isOpen, onOpenView: onOpen, onCloseView: onClose };
};

type AuditLog = {
  action: string;
  tableName: string;
  user: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  startTime: string | null;
  endTime: string | null;
  clientIp: string;
};

const Index = () => {
  const { t } = useTranslation();

  // ==== State Modal Management ====
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState("");
  const [viewRow, setViewRow] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const defaultFilter: AuditLog = {
    action: "",
    tableName: "",
    user: null,
    startDate: today(getLocalTimeZone()),
    endDate: today(getLocalTimeZone()),
    startTime: null,
    endTime: null,
    clientIp: "",
  };

  const [filter, setFilter] = useState<AuditLog>(defaultFilter);

  // ==== Pagination ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });


  // ==== Fetch Data ====
  const { data, loading, refetch } = useFetch<{
    rows: any[];
    total_count: number;
  }>(searchKeyword.trim() === "" ? "/auditlog/list" : "/auditlog/search", {
    params: {
      page: pagination.page,
      limit: pagination.limit,
      ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }),
    },
    deps: [pagination.page, pagination.limit, searchKeyword],
    enabled: !isFiltered, // Don't fetch when filtered
  });

  // Update rows and totalPage when data changes (only when not filtered)
  useEffect(() => {
    if (!isFiltered && data?.data) {
      setRows(data.data.rows || []);
      setTotalPage(Math.ceil((data.data.total || 0) / pagination.limit) || 1);
    }
  }, [data, isFiltered, pagination.limit]);

  // ==== Table Columns ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("tableName"), uid: "table_name", sortable: true },
      { name: t("action"), uid: "action", sortable: true },
      { name: t("changedByUser"), uid: "user_username" },
      { name: t("userEmail"), uid: "user_email" },
      { name: t("changedDate"), uid: "changed_date" },
      { name: t("changedTime"), uid: "changed_time" },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = [
    "id",
    "table_name",
    "action",
    "user_username",
    "changed_time",
    "changed_date",
    "actions",
  ];

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

  // ==== CRUD View ====
  const onView = (row: object) => {
    setViewRow(row);
    onOpenView();
  };

  // ==== Filter ====
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

  const applyFilterWithPagination = async (page: number) => {
    const payload = {
      tableName: filter.tableName,
      action: filter.action,
      user: filter.user,
      startDate: formatDateValue(filter.startDate),
      endDate: formatDateValue(filter.endDate),
      startTime: filter.startTime,
      endTime: filter.endTime,
      clientIp: filter.clientIp,
      page: page,
      limit: pagination.limit,
    };

    await filterAuditLog(`/auditlog/filter`, payload, "POST");
  };

  const resetFilter = () => {
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetch();
  };

  const onFilter = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  };

  // Handle page changes
  const handlePageChange = async (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));

    if (isFiltered) {
      await applyFilterWithPagination(newPage);
    }
  };

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

  // ==== Column Customize ====
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

  return (
    <div className="p-4">
      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />

      {/* === Filter Component === */}
      <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={onFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
      />

      {/* === Table === */}
      <DataTable
        loading={loading || filterLoading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onView={onView}
        loadData={refetch}
        selectRow={false}
        onOpenFilter={onOpen}
        isFiltered={isFiltered}
        colKeys={colsKeys}
        permissionCreate="create:auditlog"
        permissionDelete="delete:auditlog"
        permissionEdit="update:auditlog"
        permissionView="view:auditlog"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
      />
    </div>
  );
};

export default Index;