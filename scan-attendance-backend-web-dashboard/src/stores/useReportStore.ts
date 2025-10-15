import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReportCustomizationState {
  // Header state
  header: {
    title: string;
    institutionName: string;
    academicYear: string;
    generatedBy: string;
    reportDate: string;
  };

  // Info section visibility state
  infoVisibility: {
    showClassInfo: boolean;
    showRoomInfo: boolean;
    showCourseInfo: boolean;
    showFacultyInfo: boolean;
    showProgramInfo: boolean;
  };

  // Footer state
  footer: {
    preparedBy: string;
    verifiedBy: string;
    approvedBy: string;
    showSignatures: boolean;
    showReportInfo: boolean;
  };

  // Table state
  table: {
    showStriped: boolean;
    showFooterSummary: boolean;
  };

  // Table headers (column labels)
  tableHeaders: {
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
  };

  // Actions
  setHeaderField: (field: keyof ReportCustomizationState['header'], value: string) => void;
  setInfoVisibility: (field: keyof ReportCustomizationState['infoVisibility'], value: boolean) => void;
  setFooterField: (field: keyof ReportCustomizationState['footer'], value: string | boolean) => void;
  setTableField: (field: keyof ReportCustomizationState['table'], value: boolean) => void;
  setTableHeader: (field: keyof ReportCustomizationState['tableHeaders'], value: string) => void;
  updateReportDate: () => void;
  updateGeneratedBy: (username: string) => void;
  initializeReport: (username: string) => void;
  resetToDefaults: () => void;
  resetTableHeaders: () => void;
}

const getCurrentDateTimeUTC = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const defaultState = {
  header: {
    title: 'ATTENDANCE SUMMARY REPORT',
    institutionName: 'Build Bright University',
    academicYear: '2024-2025',
    generatedBy: 'ley-lery',
    reportDate: getCurrentDateTimeUTC(),
  },
  infoVisibility: {
    showClassInfo: true,
    showRoomInfo: true,
    showCourseInfo: true,
    showFacultyInfo: true,
    showProgramInfo: true,
  },
  footer: {
    preparedBy: 'Academic Staff',
    verifiedBy: 'Department Head',
    approvedBy: 'Dean/Director',
    showSignatures: true,
    showReportInfo: true,
  },
  table: {
    showStriped: true,
    showFooterSummary: true,
  },
  tableHeaders: {
    class: 'Class',
    room: 'Room',
    course: 'Course',
    faculty: 'Faculty',
    no: 'No',
    studentId: 'Student ID',
    studentName: 'Student Name',
    gender: 'Gender',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    permission: 'Permission',
    total: 'Total',
    attendancePercentage: 'Attendance %',
    status: 'Status',
    leaveDays: 'Leave Days',
  },
};

export const useReportCustomizationStore = create<ReportCustomizationState>()(
  persist(
    (set) => ({
      ...defaultState,

      setHeaderField: (field, value) =>
        set((state) => ({
          header: {
            ...state.header,
            [field]: value,
          },
        })),

      setInfoVisibility: (field, value) =>
        set((state) => ({
          infoVisibility: {
            ...state.infoVisibility,
            [field]: value,
          },
        })),

      setFooterField: (field, value) =>
        set((state) => ({
          footer: {
            ...state.footer,
            [field]: value,
          },
        })),

      setTableField: (field, value) =>
        set((state) => ({
          table: {
            ...state.table,
            [field]: value,
          },
        })),

      setTableHeader: (field, value) =>
        set((state) => ({
          tableHeaders: {
            ...state.tableHeaders,
            [field]: value,
          },
        })),

      updateReportDate: () =>
        set((state) => ({
          header: {
            ...state.header,
            reportDate: getCurrentDateTimeUTC(),
          },
        })),

      updateGeneratedBy: (username) =>
        set((state) => ({
          header: {
            ...state.header,
            generatedBy: username,
          },
        })),

      initializeReport: (username) =>
        set((state) => ({
          header: {
            ...state.header,
            generatedBy: username,
            reportDate: getCurrentDateTimeUTC(),
          },
        })),

      resetToDefaults: () => 
        set({
          ...defaultState,
          header: {
            ...defaultState.header,
            reportDate: getCurrentDateTimeUTC(),
          },
        }),

      resetTableHeaders: () =>
        set((state) => ({
          tableHeaders: {
            ...defaultState.tableHeaders,
          },
        })),
    }),
    {
      name: 'report-customization-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields, exclude reportDate as it should be fresh
        header: {
          title: state.header.title,
          institutionName: state.header.institutionName,
          academicYear: state.header.academicYear,
          generatedBy: state.header.generatedBy,
        },
        infoVisibility: state.infoVisibility,
        footer: state.footer,
        table: state.table,
        tableHeaders: state.tableHeaders,
      }),
    }
  )
);