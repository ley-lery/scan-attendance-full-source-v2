import { ReportHeader, ReportTable } from "@/components/ui"
import { cn } from "@/lib/utils"
import { Progress} from "@heroui/react"
import { useEffect, useState } from "react"
import { CiWarning } from "react-icons/ci"
import { HiOutlineBadgeCheck } from "react-icons/hi"
import { IoTrendingUp } from "react-icons/io5"
import { LiaAwardSolid } from "react-icons/lia"
import { PiStudentThin } from "react-icons/pi"
import { useDisclosure } from "@/god-ui"
import { useTranslation } from "react-i18next"
import { useFetch } from "@/hooks/useFetch"
import { useMutation } from "@/hooks/useMutation"
import { ShowToast } from "@/components/hero-ui"
import Filter from "./Filter"
import Customize from "./Customize"

type FilterData = {
  classId?: number | null,
  course?: number | null,
  student?: number | null,
  faculty?: number | null,
  field?: number | null,
  promotionNo?: number | null,
  termNo?: number | null,
  minAttendancePercentage?: number | null,
  maxAttendancePercentage?: number | null,
  showAtRiskOnly?: any,
  page?: number,
  limit?: number,
}

const mockData = [
  {
    title: "Total Students",
    value: 4,
    icon: <PiStudentThin />,
    variant: "primary",
    type: 'Students',
    desc: 'Total number of students enrolled in this class'
  },
  {
    title: "Average Attendance",
    value: 83.34,
    icon: <IoTrendingUp />,
    variant: "success",
    type: '%',
    desc: 'Average attendance percentage across all students'
  },
  {
    title: "Excellent Performance",
    value: 50,
    icon: <LiaAwardSolid />,
    variant: "success",
    type: '%',
    desc: 'Percentage of students with excellent attendance'
  },
  {
    title: "Need Attention",
    value: 50,
    icon: <CiWarning />,
    variant: "warning",
    type: '%',
    desc: 'Percentage of students requiring attention'
  },
]

const INITIAL_VISIBLE_COLUMNS = ["student_code", "email", "class_name", "present_count", "absent_count", "late_count", "total_sessions", "attendance_percentage", "attendance_status"]

const DEFAULT_FILTER: FilterData = {
  classId: null,
  course: null,
  student: null,
  faculty: null,
  field: null,
  promotionNo: null,
  termNo: null,
  minAttendancePercentage: null,
  maxAttendancePercentage: null,
  showAtRiskOnly: false,
  page: 1,
  limit: 10,
}
const useReportModalClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return {
    isOpenReportModal: isOpen,
    onOpenReportModal: onOpen,
    onCloseReportModal: onClose,
  };
};

const Index = () => {
  const { t } = useTranslation()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { isOpenReportModal, onOpenReportModal, onCloseReportModal } = useReportModalClosure()
  const [stats] = useState(mockData)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(INITIAL_VISIBLE_COLUMNS)
  const [isFiltered, setIsFiltered] = useState(false)
  const [offAutoClose, setOffAutoClose] = useState(false)

  const [filter, setFilter] = useState<FilterData>(DEFAULT_FILTER)
  const [filteredData, setFilteredData] = useState<{ rows: any[]; total: number } | null>(null);
  const [fullData, setFullData] = useState<any>(null);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit:  1000,
  });

  // ==== Mutation ====
  const { mutate: filterAction, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      console.log(response, 'filtered response')
      if (!offAutoClose) {
        onClose();
      }
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
  


  // ==== Fetch Data ====
  const { data: dataList } = useFetch<{ rows: any[]; total_count: number }>(
    "/reports/attendance-report/summary/list",
    {
      deps: [pagination.page, pagination.limit],
      enabled: !isFiltered,
    }
  );
  useEffect(() => {
    console.log(dataList, 'dataList')
  }, [dataList]);
  

  // ==== Table Data & Total Pages ====
  const dataRows = isFiltered ? filteredData?.rows : dataList?.data?.rows;
  const rows = dataRows || [];
  const totalCount = isFiltered ? filteredData?.total : dataList?.data?.total;
  const totalPage = Math.ceil((totalCount || 0) / pagination.limit) || 1;


  // ==== Filter Handlers ====
  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
    setIsFiltered(false);
    setFilteredData(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };



  const onFilter = async () => {
    console.log(totalPage, "totalPage");
    setPagination((prev) => ({ ...prev, page: 1 }));

    const payload: FilterData = {
      classId: filter.classId ? Number(filter.classId) : null,
      course: filter.course ? Number(filter.course) : null,
      student: filter.student ? Number(filter.student) : null,
      faculty: filter.faculty ? Number(filter.faculty) : null,
      field: filter.field ? Number(filter.field) : null,
      promotionNo: filter.promotionNo ? Number(filter.promotionNo) : null,
      termNo: filter.termNo ? Number(filter.termNo) : null,
      minAttendancePercentage: filter.minAttendancePercentage ? Number(filter.minAttendancePercentage) : null,
      maxAttendancePercentage: filter.maxAttendancePercentage ? Number(filter.maxAttendancePercentage) : null,
      showAtRiskOnly: filter.showAtRiskOnly ? filter.showAtRiskOnly : null,
      page: 1,
      limit: pagination.limit,
    };

    console.log(payload, "payload");

    await filterAction(`/reports/attendance-report/summary/filter`, payload, "POST");
  };

  // Handle pagination changes for filtered data
  const handlePageChange = async (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));

    if (isFiltered) {
      const payload: FilterData = {
        classId: filter.classId ? Number(filter.classId) : null,
        course: filter.course ? Number(filter.course) : null,
        student: filter.student ? Number(filter.student) : null,
        faculty: filter.faculty ? Number(filter.faculty) : null,
        field: filter.field ? Number(filter.field) : null,
        promotionNo: filter.promotionNo ? Number(filter.promotionNo) : null,
        termNo: filter.termNo ? Number(filter.termNo) : null,
        minAttendancePercentage: filter.minAttendancePercentage ? Number(filter.minAttendancePercentage) : null,
        maxAttendancePercentage: filter.maxAttendancePercentage ? Number(filter.maxAttendancePercentage) : null,
        showAtRiskOnly: filter.showAtRiskOnly ? filter.showAtRiskOnly : null,
        page: newPage,
        limit: pagination.limit,
      };

      await filterAction(`/reports/attendance-report/summary/filter`, payload, "POST");
    }
  };



  // ========= Columns block =========

  // Define all columns 
  const columns = [
    { label: t("id"), accessor: "class_attendance_id", align: "center" as const, visible: false },
    { label: t("studentCode"), accessor: "student_code", align: "left" as const, visible: true },
    { label: t("contact"), accessor: "email", align: "left" as const, visible: false },
    { label: t("gender"), accessor: "gender", align: "center" as const, visible: false },
    { label: t("className"), accessor: "class_name", align: "center" as const, visible: false },
    { label: t("room"), accessor: "room_name", align: "center" as const, visible: false },
    { label: t("programType"), accessor: "program_type", align: "center" as const, visible: false },
    { label: t("promotion"), accessor: "promotion_no", align: "center" as const, visible: false },
    { label: t("term"), accessor: "term_no", align: "center" as const, visible: false },
    { label: t("courseCode"), accessor: "course_code", align: "center" as const, visible: false },
    { label: t("courseNameEn"), accessor: "course_name_en", align: "left" as const, visible: false },
    { label: t("courseNameKh"), accessor: "course_name_kh", align: "left" as const, visible: false },
    { label: t("faculty"), accessor: "faculty_name_en", align: "left" as const, visible: false },
    { label: t("facultyCode"), accessor: "faculty_code", align: "center" as const, visible: false },
    { label: t("fieldNameEn"), accessor: "field_name_en", align: "left" as const, visible: false },
    { label: t("fieldCode"), accessor: "field_code", align: "center" as const, visible: false },
    { label: t("presentCount"), accessor: "present_count", align: "center" as const, visible: true },
    { label: t("absentCount"), accessor: "absent_count", align: "center" as const, visible: true },
    { label: t("lateCount"), accessor: "late_count", align: "center" as const, visible: true },
    { label: t("permissionCount"), accessor: "permission_count", align: "center" as const, visible: false },
    { label: t("totalSessions"), accessor: "total_sessions", align: "center" as const, visible: true },
    { label: t("attendancePercentage"), accessor: "attendance_percentage", align: "left" as const, visible: true },
    { label: t("effectiveAttendancePercentage"), accessor: "effective_attendance_percentage", align: "center" as const, visible: false },
    { label: t("attendanceStatus"), accessor: "attendance_status", align: "center" as const, visible: true },
    { label: t("approvedLeaveCount"), accessor: "approved_leave_count", align: "center" as const, visible: false },
    { label: t("totalLeaveDays"), accessor: "total_leave_days", align: "center" as const, visible: false },
    { label: t("enrollmentStatus"), accessor: "enrollment_status", align: "center" as const, visible: false },
    { label: t("studentStatus"), accessor: "student_status", align: "center" as const, visible: false },
  ]

  // ====== Custom Render ======
  const customRender = {
    'student_code': (value: string, row: any) => (
      <div className="flex items-center gap-3 min-w-[200px]">
        {/* Avatar with initials */}
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {row.student_name_en?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'NA'}
        </div>
        {/* Student info */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
            {row.student_name_en || 'N/A'}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {value}
          </span>
        </div>
      </div>
    ),
    'email': (value: string, row: any) => (
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex flex-col min-w-0">
          <span className="text-sm text-zinc-900 dark:text-zinc-100 truncate">
            {row.email || 'N/A'}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {row.phone_number || 'N/A'}
          </span>
        </div>
      </div>
    ),
    'attendance_percentage': (value: number) => (
      <div className="flex items-center gap-2 w-full">
        <span className={`font-medium flex flex-col w-full ${value >= 80 ? 'text-success' : value >= 60 ? 'text-warning' : 'text-danger'}`}>
          <div className="flex justify-between items-center">
            {value ? Number(value).toFixed(1) : 0}%
            <span className="text-xs">{value >= 80 ? <HiOutlineBadgeCheck size={18}/> : value >= 60 ? <CiWarning size={18}/> : <CiWarning size={18}/>}</span>
          </div>
          <Progress value={value ? value : 0} size="sm" color={value >= 80 ? 'success' : value >= 60 ? 'warning' : 'danger'} className="min-w-full"/>
        </span>
      </div>
    ),
    'attendance_status': (value: string) => (
      <span className={`font-medium flex items-center justify-center gap-2 w-full ${value === 'Excellent' ? 'text-success' : value === 'Warning' ? 'text-warning' : 'text-danger'}`}>
        <div className={cn('w-2 h-2 rounded-full flex', value === 'Excellent' ? 'bg-success' : value === 'Warning' ? 'bg-warning' : 'bg-danger')}/>
        {value}
      </span>
    ),
    'present_count': (value: number) => (
      <div className="flex items-center justify-center w-full gap-2">
        <div className="w-8 h-8 flex items-center justify-center bg-success/10 text-success rounded-md">
          <span className="font-semibold text-xs">{value}</span>
        </div>
      </div>
    ),
    'absent_count': (value: number) => (
      <div className="flex items-center justify-center w-full gap-2">
        <div className="w-8 h-8 flex items-center justify-center bg-danger/10 text-danger rounded-md">
          <span className="font-semibold text-xs">{value}</span>
        </div>
      </div>
    ),
    'late_count': (value: number) => (
      <div className="flex items-center justify-center w-full gap-2">
        <div className="w-8 h-8 flex items-center justify-center bg-warning/10 text-warning rounded-md">
          <span className="font-semibold text-xs">{value}</span>
        </div>
      </div>
    ),
    'total_sessions': (value: number) => (
      <div className="flex items-center justify-center w-full gap-2">
        <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-md">
          <span className="font-semibold text-xs">{value}</span>
        </div>
      </div>
    ),
  }


  return (
    <div className="p-4 space-y-4 h-full">
      <Customize isOpenReportModal={isOpenReportModal} onCloseReportModal={onCloseReportModal} data={filteredData}/>
      <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={onFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
        offAutoClose={offAutoClose}
        setOffAutoClose={setOffAutoClose}
      />
      <ReportHeader
        title="Attendance Summary"
        description="This report shows the summary of the attendance"
        data={stats}
        columns={columns}
        defaultVisibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        onFilter={onOpen}
        onOpenCustomize={onOpenReportModal}
      />

      <ReportTable
        data={rows}
        columns={columns}
        visibleColumns={visibleColumns}
        customRender={customRender}
        hoverable
        removeWrapper={true}
        bordered={false}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
      />
    </div>
  )
}

export default Index