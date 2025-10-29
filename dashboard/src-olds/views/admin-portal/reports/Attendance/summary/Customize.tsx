import { ReportModal } from "@/components/ui"
import {CustomizeItemList, CustomizeInfo, CustomizeHeader, CustomizeFooter, CustomizeSidebar} from "@/components/ui/reports/customize/Index";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface CustomizeProps {
  isOpenReportModal: boolean;
  onCloseReportModal: () => void;
  data: any;
  loading?: boolean;
}

const Customize = ({ isOpenReportModal, onCloseReportModal, data, loading }: CustomizeProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Header state
  const [headerSettings, setHeaderSettings] = useState({
    title: "ATTENDANCE SUMMARY REPORT",
    institutionName: "Build Bright University",
    academicYear: "2024-2025",
    generatedBy: "ley-lery"
  });

  // Info visibility state
  const [infoVisibility, setInfoVisibility] = useState({
    showClassInfo: true,
    showRoomInfo: true,
    showCourseInfo: true,
    showFacultyInfo: true,
    showProgramInfo: true
  });

  // Footer state
  const [footerSettings, setFooterSettings] = useState({
    preparedBy: "Academic Staff",
    verifiedBy: "Department Head",
    approvedBy: "Dean/Director",
    showSignatures: true,
    showReportInfo: true
  });

  // Table state
  const [tableSettings, setTableSettings] = useState({
    showStriped: true,
    showFooterSummary: true
  });

  // State to manage editable header labels
  const [headers, setHeaders] = useState({
    class: "Class",
    room: "Room",
    course: "Course",
    faculty: "Faculty",
    no: "No",
    studentId: "Student ID",
    studentName: "Student Name",
    gender: "Gender",
    present: "Present",
    absent: "Absent",
    late: "Late",
    permission: "Permission",
    total: "Total",
    attendancePercentage: "Attendance %",
    status: "Status",
    leaveDays: "Leave Days"
  });

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
        .customize-table {
          table-layout: fixed !important;
          width: 100% !important;
        }
        .customize-table th,
        .customize-table td {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: clip !important;
        }
      }
    `,
  });

  useEffect(() => {
    if (isOpenReportModal) {
      console.log(data)
    }
  }, [isOpenReportModal])

  // Update header function
  const updateHeader = (key: keyof typeof headers | string, value: string) => {
    setHeaders(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handler functions for sidebar
  const handleHeaderChange = (field: string, value: string) => {
    setHeaderSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleInfoVisibilityChange = (field: string, value: boolean) => {
    setInfoVisibility(prev => ({ ...prev, [field]: value }));
  };

  const handleFooterChange = (field: string, value: string | boolean) => {
    setFooterSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleTableChange = (field: string, value: boolean) => {
    setTableSettings(prev => ({ ...prev, [field]: value }));
  };

  // Define columns configuration
  const columns = [
    { key: 'no', headerLabel: 'No', width: '50px', textAlign: 'center' as const },
    { key: 'student_code', headerLabel: 'Student ID', width: '120px', textAlign: 'center' as const, render: (value: any) => value },
    { key: 'student_name_en', headerLabel: 'Student Name', width: '280px', render: (value: any, row: any) => (
      <div className="overflow-hidden">
        <div className="font-semibold truncate">{row.student_name_en}</div>
        <div className="text-zinc-600 dark:text-zinc-400 truncate">{row.student_name_kh}</div>
      </div>
    )},
    { key: 'gender', headerLabel: 'Gender', width: '80px', textAlign: 'center' as const, render: (value: any) => value?.charAt(0) },
    { key: 'present_count', headerLabel: 'Present', width: '90px', textAlign: 'center' as const },
    { key: 'absent_count', headerLabel: 'Absent', width: '90px', textAlign: 'center' as const },
    { key: 'late_count', headerLabel: 'Late', width: '90px', textAlign: 'center' as const },
    { key: 'permission_count', headerLabel: 'Permission', width: '100px', textAlign: 'center' as const },
    { key: 'total_sessions', headerLabel: 'Total', width: '90px', textAlign: 'center' as const },
    { key: 'attendance_percentage', headerLabel: 'Attendance %', width: '130px', textAlign: 'center' as const, render: (value: any) => (
      <span className="font-bold" style={{ color: parseFloat(value || 0) >= 80 ? '#16a34a' : parseFloat(value || 0) >= 60 ? '#ca8a04' : '#dc2626' }}>
        {value ? `${parseFloat(value).toFixed(1)}%` : 'N/A'}
      </span>
    )},
    { key: 'attendance_status', headerLabel: 'Status', width: '150px', textAlign: 'center' as const, render: (value: any) => (
      <span className="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap inline-block" style={{
        backgroundColor: value === 'Excellent' ? '#dcfce7' : value === 'Good' ? '#dbeafe' : value === 'Satisfactory' ? '#fef3c7' : value === 'Warning' ? '#fed7aa' : '#fee2e2',
        color: value === 'Excellent' ? '#166534' : value === 'Good' ? '#1e40af' : value === 'Satisfactory' ? '#854d0e' : value === 'Warning' ? '#9a3412' : '#991b1b'
      }}>
        {value}
      </span>
    )},
    { key: 'total_leave_days', headerLabel: 'Leave Days', width: '110px', textAlign: 'center' as const, render: (value: any) => value || '0' }
  ];

  // Footer configuration
  const footerConfig = (classData: any[]) => [
    { colSpan: 4, content: `Class Total (${classData.length} students):`, className: 'text-right' },
    { colSpan: 1, content: classData.reduce((sum: number, s: any) => sum + (s.present_count || 0), 0), className: 'text-center bg-green-100 dark:bg-green-900 text-green-700' },
    { colSpan: 1, content: classData.reduce((sum: number, s: any) => sum + (s.absent_count || 0), 0), className: 'text-center bg-red-100 dark:bg-red-900 text-red-700' },
    { colSpan: 1, content: classData.reduce((sum: number, s: any) => sum + (s.late_count || 0), 0), className: 'text-center bg-yellow-100 dark:bg-yellow-900 text-yellow-700' },
    { colSpan: 1, content: classData.reduce((sum: number, s: any) => sum + (s.permission_count || 0), 0), className: 'text-center bg-blue-100 dark:bg-blue-900 text-blue-700' },
    { colSpan: 1, content: classData.reduce((sum: number, s: any) => sum + (s.total_sessions || 0), 0), className: 'text-center' },
    { colSpan: 1, content: `${(classData.reduce((sum: number, s: any) => sum + (parseFloat(s.attendance_percentage) || 0), 0) / classData.length).toFixed(2)}%`, className: 'text-center text-blue-700' },
    { colSpan: 2, content: 'Class Average', className: 'text-center' }
  ];

  // Group data by class
  const groupedByClass = data?.rows?.reduce((acc: any, row: any) => {
    const className = row.class_name;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(row);
    return acc;
  }, {});

  return (
    <ReportModal
      isOpen={isOpenReportModal}
      onClose={onCloseReportModal}
      title="Print Attendance Report"
      titleTwo="Report Preview"
      isEdit={false}
      backdrop="regular"
      animation="slide-down"
      isLoading={loading}
      loadingBackdrop={true}
      size="full"
      onPrint={handlePrint}
      onExport={() => {
        console.log("Export clicked");
      }}
    >
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-3 overflow-y-auto no-print">
          <CustomizeSidebar 
            headerTitle={headerSettings.title}
            institutionName={headerSettings.institutionName}
            academicYear={headerSettings.academicYear}
            generatedBy={headerSettings.generatedBy}
            onHeaderChange={handleHeaderChange}
            showClassInfo={infoVisibility.showClassInfo}
            showRoomInfo={infoVisibility.showRoomInfo}
            showCourseInfo={infoVisibility.showCourseInfo}
            showFacultyInfo={infoVisibility.showFacultyInfo}
            showProgramInfo={infoVisibility.showProgramInfo}
            onInfoVisibilityChange={handleInfoVisibilityChange}
            preparedBy={footerSettings.preparedBy}
            verifiedBy={footerSettings.verifiedBy}
            approvedBy={footerSettings.approvedBy}
            showSignatures={footerSettings.showSignatures}
            showReportInfo={footerSettings.showReportInfo}
            onFooterChange={handleFooterChange}
            showStriped={tableSettings.showStriped}
            showFooterSummary={tableSettings.showFooterSummary}
            onTableChange={handleTableChange}
          />
        </div>
        {/* Print Content */}
        <div 
          ref={printRef} 
          className="p-8 overflow-auto flex-1 col-span-9"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            color: '#000',
            fontSize: '12px'
          }}
        >
            {/* Header */}
            <CustomizeHeader 
              title={headerSettings.title}
              institutionName={headerSettings.institutionName}
              academicYear={headerSettings.academicYear}
              generatedBy={headerSettings.generatedBy}
            />

            {/* Data Tables by Class */}
            {groupedByClass && Object.keys(groupedByClass).map((className, index) => {
              const classData = groupedByClass[className];
              const firstRow = classData[0];

              return (
                <div key={index} className="mb-8 page-break-inside-avoid">
                  {/* Class info */}
                  <CustomizeInfo 
                    data={firstRow}
                    headers={headers}
                    updateHeader={updateHeader}
                    visibility={infoVisibility}
                  />

                    {/* Students Table */}
                    <CustomizeItemList 
                      data={classData}
                      columns={columns}
                      headers={{
                        no: headers.no,
                        student_code: headers.studentId,
                        student_name_en: headers.studentName,
                        gender: headers.gender,
                        present_count: headers.present,
                        absent_count: headers.absent,
                        late_count: headers.late,
                        permission_count: headers.permission,
                        total_sessions: headers.total,
                        attendance_percentage: headers.attendancePercentage,
                        attendance_status: headers.status,
                        total_leave_days: headers.leaveDays
                      }}
                      updateHeader={updateHeader}
                      showFooter={tableSettings.showFooterSummary}
                      footerConfig={footerConfig(classData)}
                      striped={tableSettings.showStriped}
                    />
                </div>
              );
            })}

            {/* Footer */}
            <CustomizeFooter 
              preparedBy={footerSettings.preparedBy}
              verifiedBy={footerSettings.verifiedBy}
              approvedBy={footerSettings.approvedBy}
              showSignatures={footerSettings.showSignatures}
              showReportInfo={footerSettings.showReportInfo}
            />
          </div>
        </div>
    </ReportModal>
  )
}

export default Customize