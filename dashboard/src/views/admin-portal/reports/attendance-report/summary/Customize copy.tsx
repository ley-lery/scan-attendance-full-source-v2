import { ReportModal } from "@/components/ui"
import CustomizeFormEdit from "@/components/ui/reports/attendance-report/customize/CustomizeFormEdit";
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

  // State to manage editable header labels
  const [headers, setHeaders] = useState({
    title: "Attendance Summary Report",
    institution: "Institution",
    academicYear: "Academic Year",
    reportDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    generatedBy: "ley-lery",
    class: "Class",
    room: "Room",
    course: "Course",
    faculty: "Faculty",
    program: "Program",
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
    leaveDays: "Leave Days",
    preparedBy: "Prepared By",
    verifiedBy: "Verified By",
    approvedBy: "Approved By"
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
      }
    `,
  });

  useEffect(() => {
    if (isOpenReportModal) {
      console.log(data)
    }
  }, [isOpenReportModal])

  // Update header function
  const updateHeader = (key: any, value: string) => {
    setHeaders(prev => ({
      ...prev,
      [key]: value
    }));
  };

  
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
      <div className="flex flex-col h-full">
        {/* Print Content */}
        <div 
          ref={printRef} 
          className="bg-white p-8 overflow-auto flex-1"
          style={{  fontFamily: 'Arial, sans-serif', color: '#000', fontSize: '12px' }}
        >
          {/* Header */}
          <div className="text-center mb-6 border-b border-zinc-300 pb-4">
            <div className="flex justify-center">
              <CustomizeFormEdit 
                tag="h1"
                value={headers.title}
                onValueChange={(value) => updateHeader('title', value)}
                className="text-2xl hover-text-edit"
                formatting={{
                  bold: true,
                  fontSize: '24px'
                }}
              >
                ATTENDANCE SUMMARY REPORT
              </CustomizeFormEdit>
            </div>
            <div className="flex justify-between items-center text-sm text-zinc-600">
              <div>
                <p className="flex items-center gap-2"><CustomizeFormEdit tag="span" value={headers.institution} onValueChange={(value) => updateHeader('institution', value)} className="font-medium hover-text-edit">Institution:</CustomizeFormEdit> Build Bright University</p>
                <p className="flex items-center gap-2"><CustomizeFormEdit tag="span" value={headers.academicYear} onValueChange={(value) => updateHeader('academicYear', value)} className="font-medium hover-text-edit">Academic Year:</CustomizeFormEdit> 2024-2025</p>
              </div>
              <div className="text-right">
                <p className="flex items-center gap-2"><CustomizeFormEdit tag="span" value={headers.reportDate} onValueChange={(value) => updateHeader('reportDate', value)} className="font-medium hover-text-edit">Report Date:</CustomizeFormEdit> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="flex items-center gap-2"><CustomizeFormEdit tag="span" value={headers.generatedBy} onValueChange={(value) => updateHeader('generatedBy', value)} className="font-medium hover-text-edit">Generated By:</CustomizeFormEdit> ley-lery</p>
              </div>
            </div>
          </div>

          {/* Data Tables by Class */}
          {groupedByClass && Object.keys(groupedByClass).map((className, index) => {
            const classData = groupedByClass[className];
            const firstRow = classData[0];

            return (
              <div key={index} className="mb-8 page-break-inside-avoid">
                {/* Class info */}
               <div className="py-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CustomizeFormEdit 
                          tag="span" 
                          value={headers.class} 
                          onValueChange={(value) => updateHeader('class', value)}
                          className="font-medium hover-text-edit"
                        >
                          {headers.class}
                        </CustomizeFormEdit>
                        <span className="text-zinc-700"> : {firstRow.class_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomizeFormEdit 
                          tag="span"
                          value={headers.room} 
                          onValueChange={(value) => updateHeader('room', value)}
                          className="font-medium hover-text-edit"
                        >
                          {headers.room}
                        </CustomizeFormEdit>
                        <span className="text-zinc-700"> : {firstRow.room_name}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CustomizeFormEdit 
                          tag="span"
                          value={headers.course} 
                          onValueChange={(value) => updateHeader('course', value)}
                          className="font-medium hover-text-edit"
                        >
                          {headers.course}
                        </CustomizeFormEdit>
                        <span className="text-zinc-700"> : {firstRow.course_code} - {firstRow.course_name_en}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomizeFormEdit 
                          tag="span"
                          value={headers.faculty} 
                          onValueChange={(value) => updateHeader('faculty', value)}
                          className="font-medium hover-text-edit"
                        >
                          {headers.faculty}
                        </CustomizeFormEdit>
                        <span className="text-zinc-700"> : {firstRow.faculty_name_en}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CustomizeFormEdit 
                          tag="span"
                          value={headers.program} 
                          onValueChange={(value) => updateHeader('program', value)}
                          className="font-medium hover-text-edit"
                        >
                          {headers.program}
                        </CustomizeFormEdit>
                        <span className="text-zinc-700"> : {firstRow.program_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students Table */}
                <div className="customize-table-wrapper ">
                  <table className="w-full border-collapse border border-zinc-300 text-xs customize-table" style={{ tableLayout: 'fixed' }}>
                    <thead>
                      <tr className="bg-zinc-200">
                        <CustomizeFormEdit 
                          value={headers.no}
                          onValueChange={(value) => updateHeader('no', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                            fontSize: '12px'
                          }}
                          layouts={{
                            width: '50px',
                            textAlign: 'center'
                          }}
                        >
                            {headers.no}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.studentId}
                          onValueChange={(value) => updateHeader('studentId', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.studentId}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.studentName}
                          onValueChange={(value) => updateHeader('studentName', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '200px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.studentName}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.gender}
                          onValueChange={(value) => updateHeader('gender', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.gender}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.present}
                          onValueChange={(value) => updateHeader('present', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.present}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.absent}
                          onValueChange={(value) => updateHeader('absent', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.absent}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.late}
                          onValueChange={(value) => updateHeader('late', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.late}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.permission}
                          onValueChange={(value) => updateHeader('permission', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.permission}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.total}
                          onValueChange={(value) => updateHeader('total', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.total}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.attendancePercentage}
                          onValueChange={(value) => updateHeader('attendancePercentage', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '150px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.attendancePercentage}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.status}
                          onValueChange={(value) => updateHeader('status', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.status}
                        </CustomizeFormEdit>
                        
                        <CustomizeFormEdit 
                          value={headers.leaveDays}
                          onValueChange={(value) => updateHeader('leaveDays', value)}
                          className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all"
                          formatting={{
                            bold: true,
                          }}
                          layouts={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          {headers.leaveDays}
                        </CustomizeFormEdit>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.map((student: any, idx: number) => (
                        <tr 
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}
                        >
                          <CustomizeFormEdit 
                            value={String(idx + 1)}
                            onValueChange={(value) => updateHeader('no', value)}
                            className="border border-zinc-300 px-2 py-2 "
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {idx + 1}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.student_code}
                            onValueChange={(value) => updateHeader('student_code', value)}
                            className="border border-zinc-300 px-2 py-2 "
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {student.student_code}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.student_name_en}
                            onValueChange={(value) => updateHeader('student_name_en', value)}
                            className="border border-zinc-300 px-2 py-2 "
                            type="dynamic"
                            tag="td"
                          >
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">{student.student_name_en}</div>
                              <span>-</span>
                              <div className="text-zinc-600">{student.student_name_kh}</div>
                            </div>
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.gender?.charAt(0)}
                            onValueChange={(value) => updateHeader('gender', value)}
                            className="border border-zinc-300 px-2 py-2"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {student.gender?.charAt(0)}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.present_count}
                            onValueChange={(value) => updateHeader('present_count', value)}
                            className="border border-zinc-300 px-2 py-2 bg-green-50 font-semibold text-green-700"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {student.present_count}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.absent_count}
                            onValueChange={(value) => updateHeader('absent_count', value)}
                            className="border border-zinc-300 px-2 py-2 bg-red-50 font-semibold text-red-700"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {student.absent_count}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.late_count}
                            onValueChange={(value) => updateHeader('late_count', value)}
                            className="border border-zinc-300 px-2 py-2 bg-yellow-50 font-semibold text-yellow-700"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {student.late_count}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.permission_count}
                            onValueChange={(value) => updateHeader('permission_count', value)}
                            className="border border-zinc-300 px-2 py-2 bg-blue-50 font-semibold text-blue-700"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {student.permission_count}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.total_sessions}
                            onValueChange={(value) => updateHeader('total_sessions', value)}
                            className="border border-zinc-300 px-2 py-2 font-semibold"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            {student.total_sessions}
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.attendance_percentage}
                            onValueChange={(value) => updateHeader('attendance_percentage', value)}
                            className="border border-zinc-300 px-2 py-2"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'right'
                            }}
                          >
                            <span 
                              className="font-bold"
                              style={{
                                color: parseFloat(student.attendance_percentage || 0) >= 80 
                                  ? '#16a34a' 
                                  : parseFloat(student.attendance_percentage || 0) >= 60 
                                  ? '#ca8a04' 
                                  : '#dc2626'
                              }}
                            >
                              {student.attendance_percentage ? `${parseFloat(student.attendance_percentage).toFixed(1)}%` : '0.00%'}
                            </span>
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.attendance_status}
                            onValueChange={(value) => updateHeader('attendance_status', value)}
                            className="border border-zinc-300 px-2 py-2"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                          >
                            <span 
                              className="px-2 py-1 rounded text-xs font-semibold"
                              style={{
                                backgroundColor: 
                                  student.attendance_status === 'Excellent' ? '#dcfce7' :
                                  student.attendance_status === 'Good' ? '#dbeafe' :
                                  student.attendance_status === 'Satisfactory' ? '#fef3c7' :
                                  student.attendance_status === 'Warning' ? '#fed7aa' :
                                  '#fee2e2',
                                color:
                                  student.attendance_status === 'Excellent' ? '#166534' :
                                  student.attendance_status === 'Good' ? '#1e40af' :
                                  student.attendance_status === 'Satisfactory' ? '#854d0e' :
                                  student.attendance_status === 'Warning' ? '#9a3412' :
                                  '#991b1b'
                              }}
                            >
                              {student.attendance_status}
                            </span>
                          </CustomizeFormEdit>
                          <CustomizeFormEdit 
                            value={student.total_leave_days}
                            onValueChange={(value) => updateHeader('total_leave_days', value)}
                            className="border border-zinc-300 px-2 py-2 text-center"
                            type="dynamic"
                            tag="td"
                            layouts={{
                              textAlign: 'center'
                            }}
                            formatting={{
                              bold: true
                            }}
                          >
                            {student.total_leave_days || '0'}
                          </CustomizeFormEdit>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-zinc-100 font-semibold">
                        <CustomizeFormEdit 
                          value={String(classData.length)}
                          onValueChange={(value) => updateHeader('classTotal', value)}
                          type="dynamic"
                          tag="td"
                          table={{
                            colSpan: 4
                          }}
                          layouts={{
                            textAlign: 'right'
                          }}
                        >
                          Class Total ({classData.length} students):
                        </CustomizeFormEdit>
                        <CustomizeFormEdit
                          value={classData.reduce((sum: number, s: any) => sum + (s.present_count || 0), 0)}
                          onValueChange={(value) => updateHeader('present_count', value)}
                          className="border border-zinc-300 px-2 py-2 text-center bg-green-100 text-green-700"
                          type="dynamic"
                          tag="td"
                          layouts={{
                            textAlign: 'center'
                          }}>
                          {classData.reduce((sum: number, s: any) => sum + (s.present_count || 0), 0)}
                        </CustomizeFormEdit>
                        <CustomizeFormEdit
                          value={classData.reduce((sum: number, s: any) => sum + (s.absent_count || 0), 0)}
                          onValueChange={(value) => updateHeader('absent_count', value)}
                          className="border border-zinc-300 px-2 py-2 text-center bg-red-100 text-red-700"
                          type="dynamic"
                          tag="td"
                          layouts={{
                            textAlign: 'center'
                          }}>
                          {classData.reduce((sum: number, s: any) => sum + (s.absent_count || 0), 0)}
                        </CustomizeFormEdit>
                        <CustomizeFormEdit
                          value={classData.reduce((sum: number, s: any) => sum + (s.late_count || 0), 0)}
                          onValueChange={(value) => updateHeader('late_count', value)}
                          className="border border-zinc-300 px-2 py-2 text-center bg-yellow-100 text-yellow-700"
                          type="dynamic"
                          tag="td"
                          layouts={{
                            textAlign: 'center'
                          }}>
                          {classData.reduce((sum: number, s: any) => sum + (s.late_count || 0), 0)}
                        </CustomizeFormEdit>
                        <CustomizeFormEdit
                          value={classData.reduce((sum: number, s: any) => sum + (s.permission_count || 0), 0)}
                          onValueChange={(value) => updateHeader('permission_count', value)}
                          className="border border-zinc-300 px-2 py-2 text-center bg-blue-100 text-blue-700"
                          type="dynamic"
                          tag="td"
                          layouts={{
                            textAlign: 'center'
                          }}>
                          {classData.reduce((sum: number, s: any) => sum + (s.permission_count || 0), 0)}
                        </CustomizeFormEdit>
                        <CustomizeFormEdit className="border border-zinc-300 px-2 py-2 text-center" type="dynamic" tag="td" layouts={{ textAlign: 'center' }}>
                          {classData.reduce((sum: number, s: any) => sum + (s.total_sessions || 0), 0)}
                        </CustomizeFormEdit>

                        <CustomizeFormEdit 
                          className="border border-zinc-300 px-2 py-2  text-blue-700" type="dynamic" tag="td" layouts={{ textAlign: 'right' }}>
                          {(classData.reduce((sum: number, s: any) =>  sum + (parseFloat(s.attendance_percentage) || 0), 0) / classData.length).toFixed(2)}%
                        </CustomizeFormEdit>
                        <td colSpan={2} className="border border-zinc-300 px-2 py-2 text-center">
                          Class Average
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}

         {/* Report Footer - Signature Section */}
        <div className="mt-12 pt-8 border-t border-zinc-300">
          <div className="grid grid-cols-3 gap-8">
            {/* Prepared By */}
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <CustomizeFormEdit 
                  value={headers.preparedBy}
                  onValueChange={(value) => updateHeader('preparedBy', value)}
                  tag="p"
                  className="hover-text-edit"
                  layouts={{
                    textAlign: 'center'
                  }}
                  formatting={{
                    bold: true,
                    fontSize: '13px'
                  }}
                >
                  {headers.preparedBy}
                </CustomizeFormEdit>
              </div>
              
              {/* Signature Space */}
              <div className="w-48 h-16 mb-2 flex items-end justify-center">
                <div className="text-zinc-400 italic text-xs">Signature</div>
              </div>
              
              {/* Bottom Border with Info */}
              <div className="w-full border-t border-zinc-300 pt-2 space-y-1">
                <p className="text-xs font-medium text-zinc-700">Academic Staff</p>
                <p className="text-xs text-zinc-500">Date: _______________</p>
              </div>
            </div>

            {/* Verified By */}
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <CustomizeFormEdit 
                  value={headers.verifiedBy}
                  onValueChange={(value) => updateHeader('verifiedBy', value)}
                  tag="p"
                  className="hover-text-edit"
                  layouts={{
                    textAlign: 'center'
                  }}
                  formatting={{
                    bold: true,
                    fontSize: '13px'
                  }}
                >
                  {headers.verifiedBy}
                </CustomizeFormEdit>
              </div>
              
              {/* Signature Space */}
              <div className="w-48 h-16 mb-2 flex items-end justify-center">
                <div className="text-zinc-400 italic text-xs">Signature</div>
              </div>
              
              {/* Bottom Border with Info */}
              <div className="w-full border-t border-zinc-300 pt-2 space-y-1">
                <p className="text-xs font-medium text-zinc-700">Department Head</p>
                <p className="text-xs text-zinc-500">Date: _______________</p>
              </div>
            </div>

            {/* Approved By */}
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <CustomizeFormEdit 
                  value={headers.approvedBy}
                  onValueChange={(value) => updateHeader('approvedBy', value)}
                  tag="p"
                  className="hover-text-edit"
                  layouts={{
                    textAlign: 'center'
                  }}
                  formatting={{
                    bold: true,
                    fontSize: '13px'
                  }}
                >
                  {headers.approvedBy}
                </CustomizeFormEdit>
              </div>
              
              {/* Signature Space */}
              <div className="w-48 h-16 mb-2 flex items-end justify-center">
                <div className="text-zinc-400 italic text-xs">Signature</div>
              </div>
              
              {/* Bottom Border with Info */}
              <div className="w-full border-t border-zinc-300 pt-2 space-y-1">
                <p className="text-xs font-medium text-zinc-700">Dean/Director</p>
                <p className="text-xs text-zinc-500">Date: _______________</p>
              </div>
            </div>
          </div>
        </div>

          {/* Report Info Footer */}
          <div className="mt-6 text-center text-xs text-zinc-500 border-t border-zinc-200 pt-2">
            <p>This is a computer-generated report. No signature is required.</p>
            <p>Generated on {new Date().toLocaleString('en-US', { 
              dateStyle: 'full', 
              timeStyle: 'short' 
            })}</p>
          </div>
        </div>
      </div>
    </ReportModal>
  )
}

export default Customize