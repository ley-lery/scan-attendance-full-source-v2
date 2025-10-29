import { Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useMemo, useCallback, type CSSProperties } from "react";
import { Button } from "@/components/hero-ui";
import { exportToExcel } from "@/utils/exportToExcel";
import { prepareExcelData } from "@/utils/prepareExcelData";

// Types
interface Student {
  student_id: string;
  class_attendance_id: string;
  student_code: string;
  student_name_en: string;
  gender: string;
  class_name: string;
  course_name_en: string;
  total_present: number;
  total_permission: number;
  total_absent: number;
  total_late: number;
  total_sessions: number;
  attendance_percentage: string;
}

interface FooterData {
  totalAbsent: number;
  totalPresent: number;
  totalPermission: number;
  totalLate: number;
  totalSessions: number;
  attendancePercentage: number;
}

interface ReportTableProps {
  data: Student[];
  loading: boolean;
  currentPage: number;
  footerData?: FooterData;
  printRef: React.RefObject<HTMLDivElement>;
}



// Constants
const ITEMS_PER_PAGE = 10;



const BASE_CELL_CLASS = "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700";
const HEADER_CELL_CLASS = "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600";
const FOOTER_CELL_CLASS = "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-t-2 border-gray-300 dark:border-gray-600";

const ReportTable = ({ data, loading, currentPage, footerData, printRef }: ReportTableProps) => {

  const { t } = useTranslation();

  // Single column configuration for both table and export
  const customizeData: ColumnConfigExcel[] = useMemo(() => [
    { field: "student_code", header: t("studentCode"), align: "center", width: "120px", minWidth: "100px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "student_name_en", header: t("studentName"), align: "left", width: "200px", minWidth: "150px", maxWidth: "300px", whiteSpace: "normal", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "gender", header: t("gender"), align: "center", width: "100px", minWidth: "80px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "class_name", header: t("className"), align: "center", width: "150px", minWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "course_name_en", header: t("courseNameEn"), align: "left", width: "200px", minWidth: "150px", maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "total_present", header: t("totalPresent"), align: "right", width: "100px", minWidth: "80px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "total_permission", header: t("totalPermission"), align: "right", width: "120px", minWidth: "100px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "total_absent", header: t("totalAbsent"), align: "right", width: "100px", minWidth: "80px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "total_late", header: t("totalLate"), align: "right", width: "100px", minWidth: "80px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "total_sessions", header: t("totalSessions"), align: "right", width: "120px", minWidth: "100px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    { field: "attendance_percentage", header: t("attendancePercentage"), align: "right", width: "150px", minWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  ], [t]);


  // Memoized grouped data to prevent unnecessary recalculations
  const groupedData = useMemo(() => {
    const seen = new Set<string>();
    return data.filter((item) => {
      const key = `${item.student_id}-${item.class_attendance_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  // Helper function to build cell styles
  const getCellStyle = useCallback((col: ColumnConfigExcel, isHeader = false, isFooter = false): CSSProperties => ({
    width: col.width,
    minWidth: col.minWidth,
    maxWidth: col.maxWidth,
    fontSize: "14px",
    fontWeight: isHeader || isFooter ? (isFooter && col.field === "attendance_percentage" ? 800 : 600) : 500,
    lineHeight: isHeader || isFooter ? "1.5" : "1.4",
    padding: "7px 12px",
    textAlign: col.align,
    verticalAlign: "center",
    whiteSpace: col.whiteSpace,
    overflow: col.overflow,
    textOverflow: col.textOverflow,
  }), []);

  const getCellClasses = useCallback((isHeader = false, isFooter = false, additionalClasses = "") => {
    let baseClass = BASE_CELL_CLASS;
    if (isHeader) baseClass = HEADER_CELL_CLASS;
    if (isFooter) baseClass = FOOTER_CELL_CLASS;
    return `${baseClass} ${additionalClasses}`.trim();
  }, []);

  const getRowNumber = useCallback((index: number) => {
    return (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
  }, [currentPage]);

  // Render cell content based on field type
  const renderCellContent = useCallback((item: Student, col: ColumnConfigExcel) => {
    if (col.field === "attendance_percentage") {
      return (
        <span className="font-semibold">
          {item.attendance_percentage}%
        </span>
      );
    }

    // Format numbers with proper styling
    if (['total_present', 'total_permission', 'total_absent', 'total_late', 'total_sessions'].includes(col.field)) {
      const value = (item as any)[col.field];
      return (
        <span className="font-semibold tabular-nums">
          {value ?? "-"}
        </span>
      );
    }

    return (item as any)[col.field] || "-";
  }, []);

  // Render empty state
  const renderEmptyState = () => {
    const totalColumns = customizeData.length + 1;
    
    if (loading) {
      return (
        <tr>
          <td 
            colSpan={totalColumns} 
            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <Spinner size="sm" variant="gradient" color="primary" label={t("loading")} />
          </td>
        </tr>
      );
    }

    if (groupedData.length === 0) {
      return (
        <tr>
          <td 
            colSpan={totalColumns} 
            className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            {t("No data available")}
          </td>
        </tr>
      );
    }

    return null;
  };

  // Footer columns (numeric columns only)
  const footerColumns = useMemo(() => 
    customizeData.filter(col => 
      ['total_present', 'total_permission', 'total_absent', 'total_late', 'total_sessions', 'attendance_percentage'].includes(col.field)
    ), 
    [customizeData]
  );
  
  const handleExport = () => {
    const prepared = prepareExcelData(groupedData, customizeData);
    exportToExcel(prepared, "ClassAttendanceReport.xlsx");
  };

  const totalCols = customizeData.length - footerColumns.length + 1;

  return (
    <>
      <Button onClick={handleExport}>
        {t("Export Excel")}
      </Button>
      <div className="space-y-4 h-[calc(100%-5rem)] overflow-y-auto has-scrollbar" ref={printRef}>
        <div className="overflow-x-auto flex-1 pb-10 has-scrollbar">
          <table className="report-table w-full border-collapse">
            {/* Table Header */}
            <thead className="report-table-head sticky top-0 z-10">
              <tr>
                <th
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "1.5",
                    padding: "7px 12px",
                    textAlign: "center",
                    verticalAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                  className={getCellClasses(true)}
                >
                  {t("No")}
                </th>
                {customizeData.map((col, index) => (
                  <th
                    key={`header-${col.field}-${index}`}
                    style={getCellStyle(col, true)}
                    className={getCellClasses(true)}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="report-table-body">
              {renderEmptyState() || groupedData.map((item, index) => (
                <tr
                  key={`row-${item.student_id}-${item.class_attendance_id}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  {/* Row Number */}
                  <td
                    style={{
                      width: "80px",
                      minWidth: "80px",
                      fontSize: "14px",
                      fontWeight: 500,
                      lineHeight: "1.4",
                      padding: "7px 12px",
                      textAlign: "center",
                      verticalAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                    className={getCellClasses()}
                  >
                    {getRowNumber(index)}
                  </td>

                  {/* Data Cells */}
                  {customizeData.map((col, colIndex) => (
                    <td
                      key={`cell-${col.field}-${colIndex}`}
                      style={getCellStyle(col)}
                      className={getCellClasses()}
                    >
                      {renderCellContent(item, col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {/* Table Footer */}
            <tfoot className="report-table-footer sticky bottom-0 z-10">
              <tr>
                <td
                  colSpan={totalCols}
                  style={{ 
                    padding: "7px 12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                  className={getCellClasses(false, true)}
                >
                  {t("Total")}
                </td>
                <td 
                  style={getCellStyle(footerColumns[0], false, true)}
                  className={getCellClasses(false, true)}
                >
                  <span className="tabular-nums">{footerData?.totalPresent ?? 0}</span>
                </td>
                <td 
                  style={getCellStyle(footerColumns[1], false, true)}
                  className={getCellClasses(false, true)}
                >
                  <span className="tabular-nums">{footerData?.totalPermission ?? 0}</span>
                </td>
                <td 
                  style={getCellStyle(footerColumns[2], false, true)}
                  className={getCellClasses(false, true)}
                >
                  <span className="tabular-nums">{footerData?.totalAbsent ?? 0}</span>
                </td>
                <td 
                  style={getCellStyle(footerColumns[3], false, true)}
                  className={getCellClasses(false, true)}
                >
                  <span className="tabular-nums">{footerData?.totalLate ?? 0}</span>
                </td>
                <td 
                  style={getCellStyle(footerColumns[4], false, true)}
                  className={getCellClasses(false, true)}
                >
                  <span className="tabular-nums">{footerData?.totalSessions ?? 0}</span>
                </td>
                <td 
                  style={getCellStyle(footerColumns[5], false, true)}
                  className={getCellClasses(false, true)}
                >
                  <span className="tabular-nums font-extrabold">
                    {footerData?.attendancePercentage ?? 0}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReportTable;