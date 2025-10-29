import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "@/hooks/useFetch";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { formatDateValue } from "@/helpers";
import { useMutation } from "@/hooks/useMutation";
import Filter from "./Filter";
import { cn } from "@/lib/utils";
import View from "./View";

interface FilterData {
  class: number | null;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "";
  date: DateValue | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  page: number;
  limit: number;
}

const defaultFilter: FilterData = {
  class: null,
  status: "",
  date: today(getLocalTimeZone()),
  startDate: today(getLocalTimeZone()),
  endDate: today(getLocalTimeZone()),
  page: 1,
  limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
};

// Custom hook for separate view dialog
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>(defaultFilter);
  const [filteredData, setFilteredData] = useState<{ rows: any[]; total: number } | null>(null);
  const [viewRow, setViewRow] = useState<any>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Mutation ====
  const { mutate: filterAction, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      console.log(response, "response");
      onClose();
      ShowToast({
        color: "success",
        title: "Success",
        description: response?.message || "Filter applied successfully",
      });

      // Store filtered data
      setFilteredData({
        rows: response?.data?.rows || [],
        total: response?.data?.total || 0,
      });
      setIsFiltered(true);
    },
    onError: (err) => {
      console.log(err);
      ShowToast({
        color: "error",
        title: "Error",
        description: err?.message || "Failed to apply filter",
      });
    },
  });

  // ==== Fetch Data with useFetch ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<any>(
    "/student/leavehistory/formload"
  );

  const {
    data: dataList,
    loading: loadingList,
    refetch: refetchList,
  } = useFetch<{ rows: any[]; total_count: number }>(
    searchKeyword.trim() === "" ? "/student/classattendance/list" : "/student/classattendance/search",
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
    console.log("Fetched data:", dataList);
    console.log("Fetched formLoad:", formLoad);
  }, [dataList, formLoad]);

  // ==== Table Data & Total Pages ====
  const dataRows = isFiltered ? filteredData?.rows : dataList?.data?.rows;
  const rows = dataRows || [];
  const totalCount = isFiltered ? filteredData?.total : dataList?.data?.total;
  const totalPage = Math.ceil((totalCount || 0) / pagination.limit) || 1;

  // ==== Columns Definitions ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("className"), uid: "class_name" },
      { name: t("courseCode"), uid: "course_code" },
      { name: t("courseNameEn"), uid: "course_name_en" },
      { name: t("courseNameKh"), uid: "course_name_kh" },
      { name: t("totalPresent"), uid: "total_present" },
      { name: t("totalAbsent"), uid: "total_absent" },
      { name: t("totalLate"), uid: "total_late" },
      { name: t("totalLeave"), uid: "total_permission" },
      { name: t("attendancePercentage"), uid: "attendance_percentage" },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  // ==== Default Visible Columns ====
  const visibleCols = [
    "class_name",
    "course_code",
    "course_name_en",
    "course_name_kh",
    "total_present",
    "total_absent",
    "total_late",
    "total_permission",
    "attendance_percentage",
    "actions"
  ];

  // ==== Search Input Handlers ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    if (isFiltered) {
      setIsFiltered(false);
      setFilteredData(null);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const onView = (row: object) => {
    setViewRow(row);
    onOpenView();
  };

  // ==== Filter Handlers ====
  const resetFilter = () => {
    setFilter(defaultFilter);
    setIsFiltered(false);
    setFilteredData(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
    refetchList();
  };

  const onFilter = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));

    const payload = {
      classId: filter.class,
      status: filter.status,
      date: formatDateValue(filter.date),
      startDate: formatDateValue(filter.startDate),
      endDate: formatDateValue(filter.endDate),
      page: 1,
      limit: pagination.limit,
    };

    console.log(payload, "payload");

    await filterAction(`/student/leavehistory/filter`, payload, "POST");
  };

  // Handle pagination changes for filtered data
  const handlePageChange = async (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));

    if (isFiltered) {
      const payload = {
        classId: filter.class,
        status: filter.status,
        date: formatDateValue(filter.date),
        startDate: formatDateValue(filter.startDate),
        endDate: formatDateValue(filter.endDate),
        page: newPage,
        limit: pagination.limit,
      };

      await filterAction(`/student/leavehistory/filter`, payload, "POST");
    }
  };

  // ==== Custom Column Renderers ====

  const customizeCols = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2",
          "px-3 py-1 rounded-full w-fit text-xs font-bold inline-flex items-center gap-2",
          value === null && "text-zinc-500 dark:text-zinc-400 bg-default/50",
          value !== null && "text-success bg-success/20"
        )}
      >
        {value || "N/A"} {value !== null && "%"}
      </span>
    );
  }, []);

  const customizeAttType = useCallback((data: any, key: string) => {
    const value = data[key];
    return (
      <span
        className={cn(
          "flex items-center gap-2",
          "px-3 py-1 rounded-full w-fit text-xs font-bold inline-flex items-center gap-2",
          key === "total_present" && "text-success bg-success/10",
          key === "total_absent" && "text-danger bg-danger/10",
          key === "total_late" && "text-warning bg-warning/10",
          key === "total_permission" && "text-secondary bg-secondary/10"
        )}
      >
        {value}
      </span>
    );
  }, []);

  const colsKeys = useMemo(
    () => [
      { key: "attendance_percentage", value: (data: any) => customizeCols(data, "attendance_percentage") },
      { key: "total_present", value: (data: any) => customizeAttType(data, "total_present") },
      { key: "total_absent", value: (data: any) => customizeAttType(data, "total_absent") },
      { key: "total_late", value: (data: any) => customizeAttType(data, "total_late") },
      { key: "total_permission", value: (data: any) => customizeAttType(data, "total_permission") },
    ],
    [customizeCols, customizeAttType]
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
        formLoad={formLoad}
        formLoadLoading={formLoadLoading}
        filterLoading={filterLoading}
      />

      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />

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
        permissionView="view:studentattendance"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetchList}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
      />
    </div>
  );
};

export default Index;

