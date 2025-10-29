import { create } from 'zustand'

interface FormEditState {
  inputValue: string;
  layouts: {
    width?: string;
    height?: string;
    textAlign?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
  };
  formatting: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: string;
  };
  colors: {
    textColor?: string;
    backgroundColor?: string;
    textBackgroundColor?: string;
  };
  tag: "th" | "td" | "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  type: "static" | "dynamic";
  // Actions
  setInputValue: (value: string) => void;
  updateLayouts: (layouts: Partial<FormEditState['layouts']>) => void;
  updateFormatting: (formatting: Partial<FormEditState['formatting']>) => void;
  updateColors: (colors: Partial<FormEditState['colors']>) => void;
  setTag: (tag: FormEditState['tag']) => void;
  setType: (type: FormEditState['type']) => void;
  resetForm: () => void;
}

export interface FontSizeOption {
  key: string;
  label: string;
  value: string;
}

export const FONT_SIZES: FontSizeOption[] = [
  {key: "10px", value: "10px", label: "10px - Tiny"},
  {key: "12px", value: "12px", label: "12px - Small"},
  {key: "14px", value: "14px", label: "14px - Default"},
  {key: "16px", value: "16px", label: "16px - Medium"},
  {key: "18px", value: "18px", label: "18px - Large"},
  {key: "20px", value: "20px", label: "20px - Extra Large"},
  {key: "24px", value: "24px", label: "24px - XXL"},
  {key: "28px", value: "28px", label: "28px - Huge"},
  {key: "32px", value: "32px", label: "32px - Massive"}
];

const initialState = {
  inputValue: '',
  layouts: {
    width: 'auto',
    height: 'auto',
    textAlign: 'left' as const,
    verticalAlign: 'middle' as const
  },
  formatting: {
    bold: false,
    italic: false,
    underline: false,
    fontSize: '14px'
  },
  colors: {
    textColor: '#000000',
    backgroundColor: 'transparent',
    textBackgroundColor: 'transparent'
  },
  tag: 'th' as const,
  type: 'static' as const
};

export const useFormEditStore = create<FormEditState>((set) => ({
  ...initialState,

  setInputValue: (value) => set({ inputValue: value }),
  
  updateLayouts: (layouts) => 
    set((state) => ({
      layouts: { ...state.layouts, ...layouts }
    })),
  
  updateFormatting: (formatting) =>
    set((state) => ({
      formatting: { ...state.formatting, ...formatting }
    })),
  
  updateColors: (colors) =>
    set((state) => ({
      colors: { ...state.colors, ...colors }
    })),
  
  setTag: (tag) => set({ tag }),
  
  setType: (type) => set({ type }),
  
  resetForm: () => set(initialState)
}));