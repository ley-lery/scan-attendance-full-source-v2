import { Input, Textarea } from "@/components/hero-ui";
import { Button, Divider, Popover, PopoverContent, PopoverTrigger, ScrollShadow, Select, SelectItem } from "@heroui/react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { FaBold, FaItalic, FaUnderline, FaPalette, FaFillDrip, FaHighlighter, FaUndo, FaTextHeight, FaAlignLeft, FaAlignCenter, FaAlignRight, FaArrowUp, FaArrowDown, FaGripLines } from "react-icons/fa";

interface CustomizeFormEditProps {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (newValue: string) => void;
    layouts?: {
        width?: string;
        height?: string;
        textAlign?: "left" | "center" | "right";
        verticalAlign?: "top" | "middle" | "bottom";
    }
    formatting?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        fontSize?: string;
    }
    colors?: {
        textColor?: string;
        backgroundColor?: string;
        textBackgroundColor?: string;
    }
    onLayoutChange?: (newLayouts: {
        width?: string;
        height?: string;
        textAlign?: "left" | "center" | "right";
        verticalAlign?: "top" | "middle" | "bottom";
    }) => void;
    onFormattingChange?: (newFormatting: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        fontSize?: string;
    }) => void;
    onColorsChange?: (newColors: {
        textColor?: string;
        backgroundColor?: string;
        textBackgroundColor?: string;
    }) => void;
    type?: "static" | "dynamic";
    tag?: "th" | "td" | "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    className?: string;
}

export const slOptions = {
  fontSize: [
    {key: "10px", label: "10px - Tiny"},
    {key: "12px", label: "12px - Small"},
    {key: "14px", label: "14px - Default"},
    {key: "16px", label: "16px - Medium"},
    {key: "18px", label: "18px - Large"},
    {key: "20px", label: "20px - Extra Large"},
    {key: "24px", label: "24px - XXL"},
    {key: "28px", label: "28px - Huge"},
    {key: "32px", label: "32px - Massive"},
  ]
};

// Default values constants
const DEFAULT_LAYOUTS = {
  width: 'auto',
  height: 'auto',
  textAlign: 'left' as const,
  verticalAlign: 'middle' as const
};

const DEFAULT_FORMATTING = {
  bold: false,
  italic: false,
  underline: false,
  fontSize: '14px'
};

const DEFAULT_COLORS = {
  textColor: '#000000',
  backgroundColor: 'transparent',
  textBackgroundColor: 'transparent'
};

const CustomizeFormEdit = ({ 
  children, 
  value = '', 
  onValueChange, 
  layouts, 
  formatting,
  colors,
  onLayoutChange,
  onFormattingChange,
  onColorsChange,
  type = "static",
  tag = "th",
  className = ''
}: CustomizeFormEditProps) => {
  
  const [inputValue, setInputValue] = useState(value);
  const [localLayouts, setLocalLayouts] = useState({
    width: layouts?.width || DEFAULT_LAYOUTS.width,
    height: layouts?.height || DEFAULT_LAYOUTS.height,
    textAlign: layouts?.textAlign || DEFAULT_LAYOUTS.textAlign,
    verticalAlign: layouts?.verticalAlign || DEFAULT_LAYOUTS.verticalAlign
  });
  const [localFormatting, setLocalFormatting] = useState({
    bold: formatting?.bold || DEFAULT_FORMATTING.bold,
    italic: formatting?.italic || DEFAULT_FORMATTING.italic,
    underline: formatting?.underline || DEFAULT_FORMATTING.underline,
    fontSize: formatting?.fontSize || DEFAULT_FORMATTING.fontSize
  });
  const [localColors, setLocalColors] = useState({
    textColor: colors?.textColor || DEFAULT_COLORS.textColor,
    backgroundColor: colors?.backgroundColor || DEFAULT_COLORS.backgroundColor,
    textBackgroundColor: colors?.textBackgroundColor || DEFAULT_COLORS.textBackgroundColor
  });

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (layouts) {
      setLocalLayouts({
        width: layouts.width || DEFAULT_LAYOUTS.width,
        height: layouts.height || DEFAULT_LAYOUTS.height,
        textAlign: layouts.textAlign || DEFAULT_LAYOUTS.textAlign,
        verticalAlign: layouts.verticalAlign || DEFAULT_LAYOUTS.verticalAlign
      });
    }
  }, [layouts]);

  useEffect(() => {
    if (formatting) {
      setLocalFormatting({
        bold: formatting.bold || DEFAULT_FORMATTING.bold,
        italic: formatting.italic || DEFAULT_FORMATTING.italic,
        underline: formatting.underline || DEFAULT_FORMATTING.underline,
        fontSize: formatting.fontSize || DEFAULT_FORMATTING.fontSize
      });
    }
  }, [formatting]);

  useEffect(() => {
    if (colors) {
      setLocalColors({
        textColor: colors.textColor || DEFAULT_COLORS.textColor,
        backgroundColor: colors.backgroundColor || DEFAULT_COLORS.backgroundColor,
        textBackgroundColor: colors.textBackgroundColor || DEFAULT_COLORS.textBackgroundColor
      });
    }
  }, [colors]);

  // Optimized handlers with useCallback
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const setTextAlign = useCallback((align: "left" | "center" | "right") => {
    const newLayouts = {
      ...localLayouts,
      textAlign: align
    };
    setLocalLayouts(newLayouts);
    onLayoutChange?.(newLayouts);
  }, [localLayouts, onLayoutChange]);

  const setVerticalAlign = useCallback((align: "top" | "middle" | "bottom") => {
    const newLayouts = {
      ...localLayouts,
      verticalAlign: align
    };
    setLocalLayouts(newLayouts);
    onLayoutChange?.(newLayouts);
  }, [localLayouts, onLayoutChange]);

  const handleFontSizeChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string | undefined;
    if (!selectedKey) return;
    
    const newFormatting = {
      ...localFormatting,
      fontSize: selectedKey
    };
    setLocalFormatting(newFormatting);
    onFormattingChange?.(newFormatting);
  }, [localFormatting, onFormattingChange]);

  const handleCustomFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = e.target.value;
    const newFormatting = {
      ...localFormatting,
      fontSize: newFontSize
    };
    setLocalFormatting(newFormatting);
    onFormattingChange?.(newFormatting);
  }, [localFormatting, onFormattingChange]);

  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    const newLayouts = {
      ...localLayouts,
      width: newWidth
    };
    setLocalLayouts(newLayouts);
    onLayoutChange?.(newLayouts);
  }, [localLayouts, onLayoutChange]);

  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    const newLayouts = {
      ...localLayouts,
      height: newHeight
    };
    setLocalLayouts(newLayouts);
    onLayoutChange?.(newLayouts);
  }, [localLayouts, onLayoutChange]);

  const toggleBold = useCallback(() => {
    const newFormatting = {
      ...localFormatting,
      bold: !localFormatting.bold
    };
    setLocalFormatting(newFormatting);
    onFormattingChange?.(newFormatting);
  }, [localFormatting, onFormattingChange]);

  const toggleItalic = useCallback(() => {
    const newFormatting = {
      ...localFormatting,
      italic: !localFormatting.italic
    };
    setLocalFormatting(newFormatting);
    onFormattingChange?.(newFormatting);
  }, [localFormatting, onFormattingChange]);

  const toggleUnderline = useCallback(() => {
    const newFormatting = {
      ...localFormatting,
      underline: !localFormatting.underline
    };
    setLocalFormatting(newFormatting);
    onFormattingChange?.(newFormatting);
  }, [localFormatting, onFormattingChange]);

  const handleTextColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColors = {
      ...localColors,
      textColor: e.target.value
    };
    setLocalColors(newColors);
    onColorsChange?.(newColors);
  }, [localColors, onColorsChange]);

  const handleBackgroundColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColors = {
      ...localColors,
      backgroundColor: e.target.value
    };
    setLocalColors(newColors);
    onColorsChange?.(newColors);
  }, [localColors, onColorsChange]);

  const handleTextBackgroundColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColors = {
      ...localColors,
      textBackgroundColor: e.target.value
    };
    setLocalColors(newColors);
    onColorsChange?.(newColors);
  }, [localColors, onColorsChange]);

  const clearBackgroundColor = useCallback(() => {
    const newColors = { ...localColors, backgroundColor: 'transparent' };
    setLocalColors(newColors);
    onColorsChange?.(newColors);
  }, [localColors, onColorsChange]);

  const clearTextBackgroundColor = useCallback(() => {
    const newColors = { ...localColors, textBackgroundColor: 'transparent' };
    setLocalColors(newColors);
    onColorsChange?.(newColors);
  }, [localColors, onColorsChange]);

  const handleReset = useCallback(() => {
    setLocalLayouts(DEFAULT_LAYOUTS);
    setLocalFormatting(DEFAULT_FORMATTING);
    setLocalColors(DEFAULT_COLORS);
    setInputValue(value);
    
    onLayoutChange?.(DEFAULT_LAYOUTS);
    onFormattingChange?.(DEFAULT_FORMATTING);
    onColorsChange?.(DEFAULT_COLORS);
  }, [value, onLayoutChange, onFormattingChange, onColorsChange]);

  // Memoized style objects
  const cellStyle = useMemo(() => ({
    width: localLayouts.width,
    height: localLayouts.height,
    textAlign: localLayouts.textAlign,
    verticalAlign: localLayouts.verticalAlign,
    fontWeight: localFormatting.bold ? 'bold' : 'normal',
    fontStyle: localFormatting.italic ? 'italic' : 'normal',
    textDecoration: localFormatting.underline ? 'underline' : 'none',
    fontSize: localFormatting.fontSize,
    color: localColors.textColor,
    backgroundColor: localColors.backgroundColor !== 'transparent' ? localColors.backgroundColor : undefined
  }), [localLayouts, localFormatting, localColors]);

  const textStyle = useMemo(() => ({
    backgroundColor: localColors.textBackgroundColor !== 'transparent' ? localColors.textBackgroundColor : undefined,
    padding: localColors.textBackgroundColor !== 'transparent' ? '2px 4px' : undefined,
    borderRadius: localColors.textBackgroundColor !== 'transparent' ? '2px' : undefined
  }), [localColors.textBackgroundColor]);

  // Render cell content
  const cellContent = useMemo(() => (
    <span style={textStyle}>{children}</span>
  ), [textStyle, children]);

  const cellClasses = `border border-zinc-300 dark:border-zinc-700 px-2 py-2 cursor-pointer hover:opacity-80 transition-all ${className}`;

  const CellElement = tag === "th" ? "th" : "td";

  return (
    <Popover placement="bottom">
        <PopoverTrigger>
            <CellElement 
                className={cellClasses} 
                style={cellStyle}
            >
                {cellContent}
            </CellElement>
            
        </PopoverTrigger>
        <PopoverContent>
            <ScrollShadow className="space-y-4 py-4 pt-14 px-2 w-[420px] max-h-[300px] overflow-y-auto scrollbar-hide">
                {/* Reset Button */}
                <div className="flex justify-between items-center absolute top-0 right-0 p-4 z-50 bg-white dark:bg-zinc-800 w-full rounded-t-lg">
                    <h3 className="text-base font-semibold">Customize Cell</h3>
                    <Button 
                        size="sm" 
                        variant="flat" 
                        color="warning"
                        startContent={<FaUndo />}
                        onPress={handleReset}
                    >
                        Reset
                    </Button>
                </div>

                <Divider />

                {/* Cell Text Input */}
                {type === "static" && (
                    <>
                        <div className="space-y-2">
                            <Textarea
                                value={inputValue} 
                                onChange={handleChange}
                                placeholder="Enter text..."
                                label="Cell Text"
                                labelPlacement="outside"
                                size="sm"
                                minRows={2}
                                maxRows={4}
                            />
                        </div>
                        <Divider />
                    </>
                )}

                {/* Text Formatting */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 uppercase">Text Formatting</h4>
                    <div className="flex items-center gap-1">
                        <Button 
                            size="sm" 
                            color={localFormatting.bold ? "primary" : "default"} 
                            isIconOnly 
                            variant={localFormatting.bold ? "solid" : "flat"}
                            onPress={toggleBold}
                            className="transition-all"
                            title="Bold"
                            aria-label="Toggle bold"
                        >
                            <FaBold />
                        </Button>
                        <Button 
                            size="sm" 
                            color={localFormatting.italic ? "primary" : "default"} 
                            isIconOnly 
                            variant={localFormatting.italic ? "solid" : "flat"}
                            onPress={toggleItalic}
                            className="transition-all"
                            title="Italic"
                            aria-label="Toggle italic"
                        >
                            <FaItalic />
                        </Button>
                        <Button 
                            size="sm" 
                            color={localFormatting.underline ? "primary" : "default"} 
                            isIconOnly 
                            variant={localFormatting.underline ? "solid" : "flat"}
                            onPress={toggleUnderline}
                            className="transition-all"
                            title="Underline"
                            aria-label="Toggle underline"
                        >
                            <FaUnderline />
                        </Button>
                        {/* Font Size Controls */}
                        <div className="flex gap-2 items-center w-full">
                            <Select 
                                labelPlacement="outside-left"
                                placeholder="Select size"
                                selectedKeys={[localFormatting.fontSize]}
                                onSelectionChange={handleFontSizeChange}
                                size="sm"
                                className="w-full"
                                aria-label="Select font size"
                                endContent={<FaTextHeight />}
                            >
                                {slOptions.fontSize.map((option) => (
                                    <SelectItem key={option.key}>{option.label}</SelectItem>
                                ))}
                            </Select>
                            <Input
                                type="text"
                                value={localFormatting.fontSize}
                                onChange={handleCustomFontSizeChange}
                                size="md"
                                className="w-28"
                                placeholder="e.g., 16px"
                                aria-label="Custom font size"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Text Align Buttons */}
                      <div className="space-y-4">
                          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                              Text Align
                          </label>
                          <div className="flex gap-1">
                              <Button 
                                  size="sm" 
                                  color={localLayouts.textAlign === "left" ? "primary" : "default"} 
                                  isIconOnly 
                                  variant={localLayouts.textAlign === "left" ? "solid" : "flat"}
                                  onPress={() => setTextAlign("left")}
                                  className="transition-all"
                                  title="Align Left"
                                  aria-label="Align left"
                              >
                                  <FaAlignLeft />
                              </Button>
                              <Button 
                                  size="sm" 
                                  color={localLayouts.textAlign === "center" ? "primary" : "default"} 
                                  isIconOnly 
                                  variant={localLayouts.textAlign === "center" ? "solid" : "flat"}
                                  onPress={() => setTextAlign("center")}
                                  className="transition-all"
                                  title="Align Center"
                                  aria-label="Align center"
                              >
                                  <FaAlignCenter />
                              </Button>
                              <Button 
                                  size="sm" 
                                  color={localLayouts.textAlign === "right" ? "primary" : "default"} 
                                  isIconOnly 
                                  variant={localLayouts.textAlign === "right" ? "solid" : "flat"}
                                  onPress={() => setTextAlign("right")}
                                  className="transition-all"
                                  title="Align Right"
                                  aria-label="Align right"
                              >
                                  <FaAlignRight />
                              </Button>
                          </div>
                      </div>
                      {/* Vertical Align Buttons */}
                      <div className="space-y-4">
                          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                              Vertical Align
                          </label>
                          <div className="flex gap-1">
                              <Button 
                                  size="sm" 
                                  color={localLayouts.verticalAlign === "top" ? "primary" : "default"} 
                                  isIconOnly 
                                  variant={localLayouts.verticalAlign === "top" ? "solid" : "flat"}
                                  onPress={() => setVerticalAlign("top")}
                                  className="transition-all"
                                  title="Align Top"
                                  aria-label="Align top"
                              >
                                  <FaArrowUp />
                              </Button>
                              <Button 
                                  size="sm" 
                                  color={localLayouts.verticalAlign === "middle" ? "primary" : "default"} 
                                  isIconOnly 
                                  variant={localLayouts.verticalAlign === "middle" ? "solid" : "flat"}
                                  onPress={() => setVerticalAlign("middle")}
                                  className="transition-all"
                                  title="Align Middle"
                                  aria-label="Align middle"
                              >
                                  <FaGripLines />
                              </Button>
                              <Button 
                                  size="sm" 
                                  color={localLayouts.verticalAlign === "bottom" ? "primary" : "default"} 
                                  isIconOnly 
                                  variant={localLayouts.verticalAlign === "bottom" ? "solid" : "flat"}
                                  onPress={() => setVerticalAlign("bottom")}
                                  className="transition-all"
                                  title="Align Bottom"
                                  aria-label="Align bottom"
                              >
                                  <FaArrowDown />
                              </Button>
                          </div>
                      </div>
                       <div className="grid grid-cols-2 gap-1">
                        <Input
                            type="text" 
                            value={localLayouts.width}
                            onChange={handleWidthChange}
                            label="Width"
                            labelPlacement="outside"
                            placeholder="e.g., 100px, 10%, auto"
                            size="sm"
                        />
                        <Input
                            type="text" 
                            value={localLayouts.height}
                            onChange={handleHeightChange}
                            label="Height"
                            labelPlacement="outside"
                            placeholder="e.g., 100px, 10%, auto"
                            size="sm"
                        />
                    </div>

                    </div>
                </div>

                <Divider />

                {/* Color Settings */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 uppercase">Colors</h4>
                    
                    <div className="space-y-3">
                        {/* Text Color */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                <FaPalette />
                                Text Color
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={localColors.textColor}
                                    onChange={handleTextColorChange}
                                    className="w-12 h-10 rounded border border-zinc-300 dark:border-zinc-600 cursor-pointer"
                                    title="Pick text color"
                                />
                                <Input
                                    type="text"
                                    value={localColors.textColor}
                                    onChange={handleTextColorChange}
                                    size="sm"
                                    className="flex-1"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>

                        {/* Cell Background Color */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                <FaFillDrip />
                                Cell Background
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={localColors.backgroundColor === 'transparent' ? '#ffffff' : localColors.backgroundColor}
                                    onChange={handleBackgroundColorChange}
                                    className="w-12 h-10 rounded border border-zinc-300 dark:border-zinc-600 cursor-pointer"
                                    title="Pick background color"
                                />
                                <Input
                                    type="text"
                                    value={localColors.backgroundColor}
                                    onChange={handleBackgroundColorChange}
                                    size="sm"
                                    className="flex-1"
                                    placeholder="transparent"
                                />
                                <Button
                                    size="sm"
                                    variant="flat"
                                    onPress={clearBackgroundColor}
                                    isDisabled={localColors.backgroundColor === 'transparent'}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {/* Text Highlight Color */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                <FaHighlighter />
                                Text Highlight
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={localColors.textBackgroundColor === 'transparent' ? '#ffff00' : localColors.textBackgroundColor}
                                    onChange={handleTextBackgroundColorChange}
                                    className="w-12 h-10 rounded border border-zinc-300 dark:border-zinc-600 cursor-pointer"
                                    title="Pick highlight color"
                                />
                                <Input
                                    type="text"
                                    value={localColors.textBackgroundColor}
                                    onChange={handleTextBackgroundColorChange}
                                    size="sm"
                                    className="flex-1"
                                    placeholder="transparent"
                                />
                                <Button
                                    size="sm"
                                    variant="flat"
                                    onPress={clearTextBackgroundColor}
                                    isDisabled={localColors.textBackgroundColor === 'transparent'}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollShadow>
        </PopoverContent>
    </Popover>
  )
}

export default CustomizeFormEdit