import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ReportLayout {
  width?: string;
  height?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

export interface ReportFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: string;
}

export interface ReportColors {
  textColor?: string;
  backgroundColor?: string;
  textBackgroundColor?: string;
}

export interface ReportHeaderState {
  headerTitle: string;
  institutionName: string;
  academicYear: string;
  generatedBy: string;
}

export interface ReportInfoState {
  showClassInfo: boolean;
  showRoomInfo: boolean;
  showCourseInfo: boolean;
  showFacultyInfo: boolean;
  showProgramInfo: boolean;
}

export interface ReportFooterState {
  preparedBy: string;
  verifiedBy: string;
  approvedBy: string;
  showSignatures: boolean;
  showReportInfo: boolean;
}

export interface ReportTableState {
  showStriped: boolean;
  showFooterSummary: boolean;
}

export interface ReportStyleState {
  layout: ReportLayout;
  formatting: ReportFormatting;
  colors: ReportColors;
}

interface ReportState {
  // Header state
  header: ReportHeaderState;
  // Info visibility state
  info: ReportInfoState;
  // Footer state
  footer: ReportFooterState;
  // Table state
  table: ReportTableState;
  // Style state
  style: ReportStyleState;
  // Unique ID for report
  reportId: string;
  // Active report template
  activeTemplate: string | null;
  
  // Actions
  updateHeader: (header: Partial<ReportHeaderState>) => void;
  updateInfo: (info: Partial<ReportInfoState>) => void;
  updateFooter: (footer: Partial<ReportFooterState>) => void;
  updateTable: (table: Partial<ReportTableState>) => void;
  updateStyle: (style: Partial<ReportStyleState>) => void;
  setActiveTemplate: (templateId: string | null) => void;
  resetReport: () => void;
}

const initialState: ReportState = {
  header: {
    headerTitle: '',
    institutionName: '',
    academicYear: '',
    generatedBy: ''
  },
  info: {
    showClassInfo: true,
    showRoomInfo: true,
    showCourseInfo: true,
    showFacultyInfo: true,
    showProgramInfo: true
  },
  footer: {
    preparedBy: '',
    verifiedBy: '',
    approvedBy: '',
    showSignatures: true,
    showReportInfo: true
  },
  table: {
    showStriped: true,
    showFooterSummary: true
  },
  style: {
    layout: {
      width: '100%',
      height: 'auto',
      textAlign: 'left' as const,
      verticalAlign: 'top' as const
    },
    formatting: {
      bold: false,
      italic: false,
      underline: false,
      fontSize: '14px'
    },
    colors: {
      textColor: '#000000',
      backgroundColor: '#ffffff',
      textBackgroundColor: 'transparent'
    }
  },
  reportId: crypto.randomUUID(),
  activeTemplate: null,

  // Add function placeholders to satisfy type
  updateHeader: () => {},
  updateInfo: () => {},
  updateFooter: () => {},
  updateTable: () => {},
  updateStyle: () => {},
  setActiveTemplate: () => {},
  resetReport: () => {}
}

export const useReportStore = create<ReportState>()(
  persist(
    (set) => ({
      ...initialState,

      updateHeader: (header) => 
        set((state) => ({ 
          header: { ...state.header, ...header } 
        })),

      updateInfo: (info) =>
        set((state) => ({
          info: { ...state.info, ...info }
        })),

      updateFooter: (footer) =>
        set((state) => ({
          footer: { ...state.footer, ...footer }
        })),

      updateTable: (table) =>
        set((state) => ({
          table: { ...state.table, ...table }
        })),

      updateStyle: (style) =>
        set((state) => ({
          style: {
            layout: { ...state.style.layout, ...style.layout },
            formatting: { ...state.style.formatting, ...style.formatting },
            colors: { ...state.style.colors, ...style.colors }
          }
        })),

      setActiveTemplate: (templateId) =>
        set(() => ({ activeTemplate: templateId })),

      resetReport: () => 
        set(() => ({ 
          ...initialState,
          reportId: crypto.randomUUID() 
        }))
    }),
    {
      name: 'report-store',
      partialize: (state) => ({
        header: state.header,
        info: state.info,
        footer: state.footer,
        table: state.table,
        style: state.style,
        activeTemplate: state.activeTemplate
      })
    }
  )
)
