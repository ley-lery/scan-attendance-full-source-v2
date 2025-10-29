// Lecturer Leave History
import { useEffect, useRef, useState, useMemo, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import { useDisclosure } from "@/god-ui";
import { useDebounce } from "@/hooks/useDebounce";
import { Button, ShowToast } from "@/components/hero-ui";
import { formatDateValue } from "@/helpers";
import Filter from "./Filter";
import ReportTable from "./ReportTable";
import { useReactToPrint } from "react-to-print";
import { Spinner } from "@heroui/react";
import { CiFilter } from "react-icons/ci";
import { IoPrintOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";

// ==== Types ====
interface FilterData {  
  classId: number | null,
  course: number | null,
  startDate: DateValue | null,
  endDate: DateValue | null
}

// ==== Default Filter ====
const defaultFilter: FilterData = {
  classId: null,
  course: null,
  startDate: null,
  endDate: null,
};

const Index = () => {
  const { t } = useTranslation();

  // ==== Modal State ====
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>(defaultFilter);
  const [filteredData, setFilteredData] = useState<{ rows: any[]; total: number } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Filter Mutation ====
  const { mutate: filterAction, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      console.log("filteredData", response);
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

  const endpoint = "/lecturer/report/myclassatt/list";

  const { data: dataList, loading: loadingList, refetch: refetchList } = useFetch<{ rows: any[]; total_count: number }>(endpoint, {
    deps: [pagination.page, pagination.limit, debouncedSearchKeyword],
    enabled: !isFiltered,
  });

  // Auto-trigger search when debounced keyword changes
  useEffect(() => {
    console.log("dataList", dataList);
    if (debouncedSearchKeyword.trim() !== "" && !isFiltered) {
      refetchList();
    }
  }, [debouncedSearchKeyword, refetchList, isFiltered, dataList]);

  // ==== Table Data & Total Pages ====
  const dataRows = isFiltered ? filteredData?.rows : dataList?.data?.rows;
  const rows = dataRows || [];

  // ==== Remove Duplicates (same logic as ReportTable) ====
  const groupedData = useMemo(() => {
    const seen = new Set<string>();
    return rows.filter((item: any) => {
      const key = `${item.student_id}-${item.class_attendance_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rows]);


  // ==== Calculate Footer Data ====
  const footerData = useMemo(() => {
    if (!groupedData || groupedData.length === 0) {
      return {
        totalAbsent: 0,
        totalPresent: 0,
        totalPermission: 0,
        totalLate: 0,
        totalSessions: 0,
        attendancePercentage: 0,
      };
    }

    const totals = groupedData.reduce(
      (acc: any, item: any) => ({
        totalPresent: acc.totalPresent + (parseInt(item.total_present) || 0),
        totalPermission: acc.totalPermission + (parseInt(item.total_permission) || 0),
        totalAbsent: acc.totalAbsent + (parseInt(item.total_absent) || 0),
        totalLate: acc.totalLate + (parseInt(item.total_late) || 0),
        totalSessions: acc.totalSessions + (parseInt(item.total_sessions) || 0),
      }),
      {
        totalPresent: 0,
        totalPermission: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalSessions: 0,
      }
    );

    // Calculate attendance percentage
    const attendancePercentage = totals.totalSessions > 0
      ? ((totals.totalPresent / totals.totalSessions) * 100).toFixed(2)
      : "0.00";

    return {
      ...totals,
      attendancePercentage: parseFloat(attendancePercentage),
    };
  }, [groupedData]);

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
      classId: filter.classId || null,
      course: filter.course || null,
      startDate: filter.startDate ? formatDateValue(filter.startDate) : null,
      endDate: filter.endDate ? formatDateValue(filter.endDate) : null,
    };

    await filterAction(`/lecturer/report/myclassatt/filter`, payload, "POST");
  };


  // ==== Print Handler ====
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Attendance_Report_${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .hover-text-edit {
          cursor: default !important;
        }
        .hover-text-edit:hover {
          background-color: transparent !important;
        }
      }
    `,
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header Section */}

      <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={onFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
      />

      <div className="h-full space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">{t("Class Attendance Report")}</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handlePrint} 
              color="secondary"
              isDisabled={!isFiltered || groupedData.length === 0}
              startContent={<IoPrintOutline size={18} />}
            >
              {t("Print")}
            </Button>
            {/* <Button 
              onClick={handleExport} 
              color="success"
              isDisabled={!isFiltered || groupedData.length === 0}
              startContent={<CiExport size={18} />}
            >
              {t("Export")}
            </Button> */}
            <Button onClick={onOpen} color={isFiltered ? "danger" : "primary"} startContent={isFiltered ? <FaFilter size={14} /> : <CiFilter size={18} />}>
              {isFiltered ? t("filtered") : t("filter")}
            </Button>
          </div>
        </div>
        {
          isFiltered ?
            <ReportTable
              data={groupedData}
              loading={loadingList || filterLoading}
              currentPage={pagination.page}
              footerData={footerData}
              printRef={printRef as RefObject<HTMLDivElement>}
            />
        :
          <div className="flex justify-center items-center h-full">
            {loadingList || filterLoading && <Spinner variant="gradient" size="sm" color="primary" />}
            <p className="text-zinc-500 dark:text-zinc-400">{t("filterToSeedata")}</p>
          </div>
        }
      </div>
    </div>
  );
};

export default Index;