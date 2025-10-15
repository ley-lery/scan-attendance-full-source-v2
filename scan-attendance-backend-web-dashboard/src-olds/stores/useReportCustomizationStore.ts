import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface HeaderSettings {
  title: string;
  institutionName: string;
  academicYear: string;
  generatedBy: string;
}

interface InfoVisibility {
  showClassInfo: boolean;
  showRoomInfo: boolean;
  showCourseInfo: boolean;
  showFacultyInfo: boolean;
  showProgramInfo: boolean;
}

interface FooterSettings {
  preparedBy: string;
  verifiedBy: string;
  approvedBy: string;
  showSignatures: boolean;
  showReportInfo: boolean;
}

interface TableSettings {
  showStriped: boolean;
  showFooterSummary: boolean;
}

interface ColumnWidths {
  no: string;
  student_code: string;
  student_name_en: string;
  gender: string;
  present_count: string;
  absent_count: string;
  late_count: string;
  permission_count: string;
  total_sessions: string;
  attendance_percentage: string;
  attendance_status: string;
  total_leave_days: string;
}

interface Headers {
  class: string;
  room: string;
  course: string;
  faculty: string;
  no: string;
  studentId: string;
  studentName: string;
  gender: string;
  present: string;
  absent: string;
  late: string;
  permission: string;
  total: string;
  attendancePercentage: string;
  status: string;
  leaveDays: string;
}

interface ReportCustomizationState {
  // State
  headerSettings: HeaderSettings;
  infoVisibility: InfoVisibility;
  footerSettings: FooterSettings;
  tableSettings: TableSettings;
  columnWidths: ColumnWidths;
  headers: Headers;
  
  // Actions
  updateHeaderSettings: (field: keyof HeaderSettings, value: string) => void;
  updateInfoVisibility: (field: keyof InfoVisibility, value: boolean) => void;
  updateFooterSettings: (field: keyof FooterSettings, value: string | boolean) => void;
  updateTableSettings: (field: keyof TableSettings, value: boolean) => void;
  updateColumnWidth: (field: keyof ColumnWidths, value: string) => void;
  updateHeader: (field: keyof Headers, value: string) => void;
  
  // Reset functions
  resetToDefaults: () => void;
  resetSection: (section: 'header' | 'info' | 'footer' | 'table' | 'columns' | 'headers') => void;
}

// Default values
const defaultHeaderSettings: HeaderSettings = {
  title: "ATTENDANCE SUMMARY REPORT",
  institutionName: "Build Bright University",
  academicYear: "2024-2025",
  generatedBy: "ley-lery"
};

const defaultInfoVisibility: InfoVisibility = {
  showClassInfo: true,
  showRoomInfo: true,
  showCourseInfo: true,
  showFacultyInfo: true,
  showProgramInfo: true
};

const defaultFooterSettings: FooterSettings = {
  preparedBy: "Academic Staff",
  verifiedBy: "Department Head",
  approvedBy: "Dean/Director",
  showSignatures: true,
  showReportInfo: true
};

const defaultTableSettings: TableSettings = {
  showStriped: true,
  showFooterSummary: true
};

const defaultColumnWidths: ColumnWidths = {
  no: '50px',
  student_code: '120px',
  student_name_en: '280px',
  gender: '80px',
  present_count: '90px',
  absent_count: '90px',
  late_count: '90px',
  permission_count: '100px',
  total_sessions: '90px',
  attendance_percentage: '130px',
  attendance_status: '150px',
  total_leave_days: '110px'
};

const defaultHeaders: Headers = {
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
};

export const useReportCustomizationStore = create<ReportCustomizationState>()(
  persist(
    (set) => ({
      // Initial state
      headerSettings: defaultHeaderSettings,
      infoVisibility: defaultInfoVisibility,
      footerSettings: defaultFooterSettings,
      tableSettings: defaultTableSettings,
      columnWidths: defaultColumnWidths,
      headers: defaultHeaders,

      // Actions
      updateHeaderSettings: (field, value) =>
        set((state) => ({
          headerSettings: { ...state.headerSettings, [field]: value }
        })),

      updateInfoVisibility: (field, value) =>
        set((state) => ({
          infoVisibility: { ...state.infoVisibility, [field]: value }
        })),

      updateFooterSettings: (field, value) =>
        set((state) => ({
          footerSettings: { ...state.footerSettings, [field]: value }
        })),

      updateTableSettings: (field, value) =>
        set((state) => ({
          tableSettings: { ...state.tableSettings, [field]: value }
        })),

      updateColumnWidth: (field, value) =>
        set((state) => ({
          columnWidths: { ...state.columnWidths, [field]: value }
        })),

      updateHeader: (field, value) =>
        set((state) => ({
          headers: { ...state.headers, [field]: value }
        })),

      // Reset functions
      resetToDefaults: () =>
        set({
          headerSettings: defaultHeaderSettings,
          infoVisibility: defaultInfoVisibility,
          footerSettings: defaultFooterSettings,
          tableSettings: defaultTableSettings,
          columnWidths: defaultColumnWidths,
          headers: defaultHeaders
        }),

      resetSection: (section) =>
        set((state) => {
          switch (section) {
            case 'header':
              return { headerSettings: defaultHeaderSettings };
            case 'info':
              return { infoVisibility: defaultInfoVisibility };
            case 'footer':
              return { footerSettings: defaultFooterSettings };
            case 'table':
              return { tableSettings: defaultTableSettings };
            case 'columns':
              return { columnWidths: defaultColumnWidths };
            case 'headers':
              return { headers: defaultHeaders };
            default:
              return state;
          }
        })
    }),
    {
      name: 'report-customization-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Optional: Only persist certain fields
      partialize: (state) => ({
        headerSettings: state.headerSettings,
        infoVisibility: state.infoVisibility,
        footerSettings: state.footerSettings,
        tableSettings: state.tableSettings,
        columnWidths: state.columnWidths,
        headers: state.headers
      })
    }
  )
);