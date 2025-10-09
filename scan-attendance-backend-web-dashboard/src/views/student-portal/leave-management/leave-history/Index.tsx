import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "@/hooks/useFetch";
import CardUi from "@/components/hero-ui/card/CardUi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";
import { DataTable, ShowToast } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { formatDateValue } from "@/helpers";
import { useMutation } from "@/hooks/useMutation";
import Filter from "./Filter";

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

const Index = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>(defaultFilter);
  const [filteredData, setFilteredData] = useState<{ rows: any[]; total: number } | null>(null);

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
    searchKeyword.trim() === "" ? "/student/leavehistory/list" : "/student/leavehistory/search",
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchKeyword.trim() !== "" && { keyword: searchKeyword }),
      },
      deps: [pagination.page, pagination.limit, searchKeyword],
      enabled: !isFiltered, // Don't fetch when filtered
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
      { name: t("reason"), uid: "reason" },
      { name: t("requestDate"), uid: "request_date" },
      { name: t("startDate"), uid: "start_date" },
      { name: t("endDate"), uid: "end_date" },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" },
    ],
    [t]
  );

  const visibleCols = ["reason", "request_date", "start_date", "end_date", "status", "actions"];

  const status = [
    { name: "Approved", uid: "Approved" },
    { name: "Pending", uid: "Pending" },
    { name: "Rejected", uid: "Rejected" },
    { name: "Cancelled", uid: "Cancelled" },
  ];

  // ==== Search Input Handlers ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
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
      // Re-apply filter with new page
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

  const cardStats = [
    {
      title: t("approved"),
      number: formLoadLoading ? 0 : formLoad.data.states?.approved_requests,
      subtitle: t("times"),
      icon: <IoIosCheckmarkCircleOutline size={25} />,
      color: "text-green-500",
    },
    {
      title: t("pending"),
      number: formLoadLoading ? 0 : formLoad.data.states?.pending_requests,
      subtitle: t("times"),
      icon: <PiWarningCircle size={25} />,
      color: "text-yellow-500",
    },
    {
      title: t("rejected"),
      number: formLoadLoading ? 0 : formLoad.data.states?.rejected_requests,
      subtitle: t("times"),
      icon: <SlClose size={22} />,
      color: "text-pink-500",
    },
    {
      title: t("total"),
      number: formLoadLoading ? 0 : formLoad.data.states?.total_requests,
      subtitle: t("times"),
      icon: <FaRegCircle size={22} />,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* === Filter Component === */}
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

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {cardStats.map((card, index) => (
          <CardUi
            key={index}
            title={card.title}
            number={card.number}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
      <DataTable
        loading={loadingList || filterLoading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        loadData={refetchList}
        selectRow={false}
        onOpenFilter={onOpen}
        isFiltered={isFiltered}
        permissionRequest="request:studentleave"
        permissionCancel="cancel:studentleave"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetchList}
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