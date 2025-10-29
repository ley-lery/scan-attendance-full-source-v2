import { Input } from "@/components/hero-ui";
import { ReportModal } from "@/components/ui";
import { Button, Select, SelectItem } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { 
  MdClose, 
  MdFormatBold, 
  MdFormatItalic, 
  MdFormatUnderlined,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatSize,
  MdPalette
} from "react-icons/md";
import { useReactToPrint } from "react-to-print";

interface CustomizeProps {
  isOpenReportModal: boolean;
  onCloseReportModal: () => void;
  data: any;
  loading?: boolean;
}

interface StyleConfig {
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  verticalAlign?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
}

interface PopoverEditProps {
  isOpen: boolean;
  value: string;
  style?: StyleConfig;
  onChange?: (value: string) => void;
  onStyleChange?: (style: StyleConfig) => void;
  onClose?: () => void;
  position?: { top: number; left: number };
}

const PopoverEdit = memo(({ isOpen, value, style, onChange, onStyleChange, onClose, position }: PopoverEditProps) => {
   
  if (!isOpen) return null;

  const inputRef = useRef<HTMLInputElement>(null);
  const [localStyle, setLocalStyle] = useState<StyleConfig>(style || {});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen && style) {
      setLocalStyle(style);
    }
  }, [isOpen, style]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  const toggleBold = () => {
    const newWeight = localStyle.fontWeight === 'bold' ? 'normal' : 'bold';
    const newStyle = { ...localStyle, fontWeight: newWeight };
    setLocalStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  const toggleItalic = () => {
    const newStyleValue = localStyle.fontStyle === 'italic' ? 'normal' : 'italic';
    const updatedStyle = { ...localStyle, fontStyle: newStyleValue };
    setLocalStyle(updatedStyle);
    onStyleChange?.(updatedStyle);
  };

  const toggleUnderline = () => {
    const newDecoration = localStyle.textDecoration === 'underline' ? 'none' : 'underline';
    const newStyle = { ...localStyle, textDecoration: newDecoration };
    setLocalStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  const setAlignment = (align: string) => {
    const newStyle = { ...localStyle, textAlign: align };
    setLocalStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  const setFontSize = (size: string) => {
    const newStyle = { ...localStyle, fontSize: size };
    setLocalStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  const setTextColor = (color: string) => {
    const newStyle = { ...localStyle, textColor: color };
    setLocalStyle(newStyle);
    onStyleChange?.(newStyle);
    setShowColorPicker(false);
  };

  const setBackgroundColor = (color: string) => {
    const newStyle = { ...localStyle, backgroundColor: color };
    setLocalStyle(newStyle);
    onStyleChange?.(newStyle);
    setShowBgColorPicker(false);
  };

  const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
  const commonColors = [
    '#000000', '#FFFFFF', '#EF4444', '#F59E0B', '#10B981', 
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#6B7280'
  ];

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Popover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 p-3 min-w-[400px]"
            style={{
              top: `${position?.top}px`,
              left: `${position?.left}px`,
              transform: 'translateY(8px)'
            }}
          >
            <div className="flex flex-col gap-3">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Edit Text</span>
                <Button
                  size="sm"
                  variant="light"
                  onPress={onClose}
                  isIconOnly
                  className="min-w-6 h-6"
                >
                  <MdClose size={16} />
                </Button>
              </div>

              {/* Text Input */}
              <Input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={handleKeyDown}
                size="sm"
                placeholder="Enter text"
                className="w-full"
                style={{
                  fontWeight: localStyle.fontWeight,
                  fontStyle: localStyle.fontStyle,
                  textDecoration: localStyle.textDecoration,
                  color: localStyle.textColor,
                }}
              />

              {/* Formatting Toolbar */}
              <div className="flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-600 pt-2">
                {/* Row 1: Text Style */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant={localStyle.fontWeight === 'bold' ? 'solid' : 'flat'}
                    color={localStyle.fontWeight === 'bold' ? 'primary' : 'default'}
                    onPress={toggleBold}
                    isIconOnly
                    className="min-w-8 h-8"
                    title="Bold"
                  >
                    <MdFormatBold size={18} />
                  </Button>
                  <Button
                    size="sm"
                    variant={localStyle.fontStyle === 'italic' ? 'solid' : 'flat'}
                    color={localStyle.fontStyle === 'italic' ? 'primary' : 'default'}
                    onPress={toggleItalic}
                    isIconOnly
                    className="min-w-8 h-8"
                    title="Italic"
                  >
                    <MdFormatItalic size={18} />
                  </Button>
                  <Button
                    size="sm"
                    variant={localStyle.textDecoration === 'underline' ? 'solid' : 'flat'}
                    color={localStyle.textDecoration === 'underline' ? 'primary' : 'default'}
                    onPress={toggleUnderline}
                    isIconOnly
                    className="min-w-8 h-8"
                    title="Underline"
                  >
                    <MdFormatUnderlined size={18} />
                  </Button>

                  <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

                  {/* Alignment */}
                  <Button
                    size="sm"
                    variant={localStyle.textAlign === 'left' ? 'solid' : 'flat'}
                    color={localStyle.textAlign === 'left' ? 'primary' : 'default'}
                    onPress={() => setAlignment('left')}
                    isIconOnly
                    className="min-w-8 h-8"
                    title="Align Left"
                  >
                    <MdFormatAlignLeft size={18} />
                  </Button>
                  <Button
                    size="sm"
                    variant={localStyle.textAlign === 'center' ? 'solid' : 'flat'}
                    color={localStyle.textAlign === 'center' ? 'primary' : 'default'}
                    onPress={() => setAlignment('center')}
                    isIconOnly
                    className="min-w-8 h-8"
                    title="Align Center"
                  >
                    <MdFormatAlignCenter size={18} />
                  </Button>
                  <Button
                    size="sm"
                    variant={localStyle.textAlign === 'right' ? 'solid' : 'flat'}
                    color={localStyle.textAlign === 'right' ? 'primary' : 'default'}
                    onPress={() => setAlignment('right')}
                    isIconOnly
                    className="min-w-8 h-8"
                    title="Align Right"
                  >
                    <MdFormatAlignRight size={18} />
                  </Button>
                </div>

                {/* Row 2: Font Size and Colors */}
                <div className="flex items-center gap-2">
                  {/* Font Size Selector */}
                  <div className="flex items-center gap-1 flex-1">
                    <Select
                      value={localStyle.fontSize || '14px'}
                      onChange={(e) => setFontSize(e.target.value)}
                      size="sm"
                      radius="lg"
                      placeholder="Select Font Size"
                      className="w-full"
                      startContent={<MdFormatSize size={18} />}
                    >
                      {fontSizes.map((size: any) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Text Color */}
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setShowColorPicker(!showColorPicker);
                        setShowBgColorPicker(false);
                      }}
                      isIconOnly
                      className="min-w-8 h-8"
                      title="Text Color"
                    >
                      <div className="flex flex-col items-center">
                        <MdPalette size={16} />
                        <div 
                          className="w-4 h-1 mt-0.5" 
                          style={{ backgroundColor: localStyle.textColor || '#000' }}
                        />
                      </div>
                    </Button>
                    
                    {showColorPicker && (
                      <div className="absolute top-full mt-1 right-0 bg-white dark:bg-zinc-700 p-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-600 z-10 min-w-60">
                        <div className="grid grid-cols-5 gap-1 mb-2">
                          {commonColors.map(color => (
                            <button
                              key={color}
                              onClick={() => setTextColor(color)}
                              className="w-6 h-6 rounded border-2 border-zinc-300 dark:border-zinc-600 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <input
                          type="color"
                          value={localStyle.textColor || '#000000'}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-6 rounded cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Background Color */}
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setShowBgColorPicker(!showBgColorPicker);
                        setShowColorPicker(false);
                      }}
                      isIconOnly
                      className="min-w-8 h-8"
                      title="Background Color"
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-xs font-bold">BG</div>
                        <div 
                          className="w-4 h-1 mt-0.5" 
                          style={{ backgroundColor: localStyle.backgroundColor || 'transparent' }}
                        />
                      </div>
                    </Button>
                    
                    {showBgColorPicker && (
                      <div className="absolute top-full mt-1 right-0 bg-white dark:bg-zinc-700 p-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-600 z-10 min-w-60">
                        <div className="grid grid-cols-5 gap-1 mb-2">
                          <button
                            onClick={() => setBackgroundColor('transparent')}
                            className="w-6 h-6 rounded border-2 border-zinc-300 dark:border-zinc-600 hover:scale-110 transition-transform bg-white"
                            style={{ 
                              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
                              backgroundSize: '4px 4px',
                              backgroundPosition: '0 0, 2px 2px'
                            }}
                          />
                          {commonColors.map(color => (
                            <button
                              key={color}
                              onClick={() => setBackgroundColor(color)}
                              className="w-6 h-6 rounded border-2 border-zinc-300 dark:border-zinc-600 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <input
                          type="color"
                          value={localStyle.backgroundColor === 'transparent' ? '#ffffff' : (localStyle.backgroundColor || '#ffffff')}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-6 rounded cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

PopoverEdit.displayName = 'PopoverEdit';

const Customize = ({ isOpenReportModal, onCloseReportModal, data, loading }: CustomizeProps) => {
  
  if (!isOpenReportModal) return null;

  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editingKey, setEditingKey] = useState<string>('');
  const [editingStyle, setEditingStyle] = useState<StyleConfig>({});
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const printRef = useRef<HTMLDivElement>(null);

  // Memoize initial headers to prevent recreating object
  const customize = useMemo(() => ({
    headerCols: [
      {key: 'title', label: 'Attendance Report', isEditable: true, textColor: '#000', fontSize: '20px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'institution', label: 'Institution', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'academicYear', label: 'Academic Year', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'reportDate', label: 'Report Date', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'generatedBy', label: 'Generated By', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'right', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'class', label: 'Class', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'room', label: 'Room', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'course', label: 'Course', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'faculty', label: 'Faculty', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'program', label: 'Program', isEditable: true, textColor: '#000', fontSize: '14px', fontWeight: '500', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'no', label: 'No', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '50px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'studentId', label: 'Student ID', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '100px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'studentName', label: 'Student Name', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '200px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'gender', label: 'Gender', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '60px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'present', label: 'Present', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '80px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'absent', label: 'Absent', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '80px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'late', label: 'Late', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '80px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'permission', label: 'Permission', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '90px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'total', label: 'Total', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '80px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'attendancePercentage', label: 'Attendance %', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '120px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'status', label: 'Status', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '120px', height: 'auto', backgroundColor: '#e4e4e7'},
      {key: 'leaveDays', label: 'Leave Days', isEditable: true, textColor: '#000', fontSize: '12px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: '100px', height: 'auto', backgroundColor: '#e4e4e7'},
    ],
    footerCols: [
      {key: 'preparedBy', label: 'Prepared By', textColor: '#000', fontSize: '14px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'verifiedBy', label: 'Verified By', textColor: '#000', fontSize: '14px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
      {key: 'approvedBy', label: 'Approved By', textColor: '#000', fontSize: '14px', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', verticalAlign: 'middle', width: 'auto', height: 'auto', backgroundColor: 'transparent'},
    ]
  }), []);

  const [headers, setHeaders] = useState(() => 
    customize.headerCols.reduce((acc: any, col: any) => {
      acc[col.key] = {
        label: col.label,
        textColor: col.textColor,
        fontSize: col.fontSize,
        fontWeight: col.fontWeight,
        fontStyle: col.fontStyle,
        textDecoration: col.textDecoration,
        textAlign: col.textAlign,
        verticalAlign: col.verticalAlign,
        width: col.width,
        height: col.height,
        backgroundColor: col.backgroundColor,
      };
      return acc;
    }, {})
  );

  const [footer, setFooter] = useState(() => 
    customize.footerCols.reduce((acc: any, col: any) => {
      acc[col.key] = {
        label: col.label,
        textColor: col.textColor,
        fontSize: col.fontSize,
        fontWeight: col.fontWeight,
        fontStyle: col.fontStyle,
        textDecoration: col.textDecoration,
        textAlign: col.textAlign,
        verticalAlign: col.verticalAlign,
        width: col.width,
        height: col.height,
        backgroundColor: col.backgroundColor,
      };
      return acc;
    }, {})
  );

  // Memoize groupedByClass calculation
  const groupedByClass = useMemo(() => {
    if (!data?.rows) return {};
    
    return data.rows.reduce((acc: any, row: any) => {
      const className = row.class_name;
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(row);
      return acc;
    }, {});
  }, [data?.rows]);

  // Memoize class statistics to avoid recalculation
  const classStatistics = useMemo(() => {
    const stats: Record<string, any> = {};
    
    Object.keys(groupedByClass).forEach((className) => {
      const classData = groupedByClass[className];
      stats[className] = {
        totalStudents: classData.length,
        totalPresent: classData.reduce((sum: number, s: any) => sum + (s.present_count || 0), 0),
        totalAbsent: classData.reduce((sum: number, s: any) => sum + (s.absent_count || 0), 0),
        totalLate: classData.reduce((sum: number, s: any) => sum + (s.late_count || 0), 0),
        totalPermission: classData.reduce((sum: number, s: any) => sum + (s.permission_count || 0), 0),
        totalSessions: classData.reduce((sum: number, s: any) => sum + (s.total_sessions || 0), 0),
        averageAttendance: (classData.reduce((sum: number, s: any) => sum + (parseFloat(s.attendance_percentage) || 0), 0) / classData.length).toFixed(2)
      };
    });
    
    return stats;
  }, [groupedByClass]);

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

  // Real-time update handlers
  const handleTextChange = useCallback((value: string) => {
    setEditValue(value);
    
    if (editingKey) {
      if (customize.footerCols.some(col => col.key === editingKey)) {
        setFooter((prev: any) => ({
          ...prev,
          [editingKey]: {
            ...prev[editingKey],
            label: value
          }
        }));
      } else {
        setHeaders((prev: any) => ({
          ...prev,
          [editingKey]: {
            ...prev[editingKey],
            label: value
          }
        }));
      }
    }
  }, [editingKey, customize.footerCols]);

  const handleStyleChange = useCallback((style: StyleConfig) => {
    setEditingStyle(style);
    
    if (editingKey) {
      if (customize.footerCols.some(col => col.key === editingKey)) {
        setFooter((prev: any) => ({
          ...prev,
          [editingKey]: {
            ...prev[editingKey],
            ...style
          }
        }));
      } else {
        setHeaders((prev: any) => ({
          ...prev,
          [editingKey]: {
            ...prev[editingKey],
            ...style
          }
        }));
      }
    }
  }, [editingKey, customize.footerCols]);

  // Memoize student row component
  const StudentRow = memo(({ student, idx }: any) => (
    <tr 
      key={student.student_code || idx} 
      className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}
    >
      <td className="border border-zinc-300 px-2 py-2 text-center">
        <span onClick={(e) => onSelectHeader('index', e)} style={getHeaderStyle('index')} className="hover-text-edit">{idx + 1}</span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center">
        <span onClick={(e) => onSelectHeader('student_code', e)} style={getHeaderStyle('student_code')} className="hover-text-edit">{student.student_code}</span>
      </td>
      <td className="border border-zinc-300 px-2 py-2">
        <div className="flex items-center gap-2">
          <div className="font-semibold">
            <span onClick={(e) => onSelectHeader('student_name_en', e)} style={getHeaderStyle('student_name_en')} className="hover-text-edit">{student.student_name_en}</span>
          </div>
          <span>-</span>
          <div className="text-zinc-600">
            <span onClick={(e) => onSelectHeader('student_name_kh', e)} style={getHeaderStyle('student_name_kh')} className="hover-text-edit">{student.student_name_kh}</span>
          </div>
        </div>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center">{student.gender?.charAt(0)}</td>
      <td className="border border-zinc-300 px-2 py-2 text-center bg-green-50 font-semibold text-green-700">
        <span onClick={(e) => onSelectHeader('present_count', e)} style={getHeaderStyle('present_count')} className="hover-text-edit">{student.present_count}</span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center bg-red-50 font-semibold text-red-700">
        <span onClick={(e) => onSelectHeader('absent_count', e)} style={getHeaderStyle('absent_count')} className="hover-text-edit">{student.absent_count}</span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center bg-yellow-50 font-semibold text-yellow-700">
        <span onClick={(e) => onSelectHeader('late_count', e)} style={getHeaderStyle('late_count')} className="hover-text-edit">{student.late_count}</span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center bg-blue-50 font-semibold text-blue-700">
        <span onClick={(e) => onSelectHeader('permission_count', e)} style={getHeaderStyle('permission_count')} className="hover-text-edit">{student.permission_count}</span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center font-semibold">
        <span onClick={(e) => onSelectHeader('total_sessions', e)} style={getHeaderStyle('total_sessions')} className="hover-text-edit">{student.total_sessions}</span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-right">
        <span 
          className="font-bold"
          style={{
            ...getHeaderStyle('attendance_percentage'),
            color: parseFloat(student.attendance_percentage || 0) >= 80 
              ? '#16a34a' 
              : parseFloat(student.attendance_percentage || 0) >= 60 
              ? '#ca8a04' 
              : '#dc2626'
          }}
          onClick={(e) => onSelectHeader('attendance_percentage', e)}
        >
          <span className="hover-text-edit">{student.attendance_percentage ? `${parseFloat(student.attendance_percentage).toFixed(1)}%` : '0.0%'}</span>
        </span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center">
        <span 
          className="px-2 py-1 rounded text-xs font-semibold"
          style={{
            ...getHeaderStyle('attendance_status'),
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
          onClick={(e) => onSelectHeader('attendance_status', e)}
        >
          <span className="hover-text-edit">{student.attendance_status}</span>
        </span>
      </td>
      <td className="border border-zinc-300 px-2 py-2 text-center font-bold">
        <span onClick={(e) => onSelectHeader('total_leave_days', e)} style={getHeaderStyle('total_leave_days')} className="hover-text-edit">{student.total_leave_days || '0'}</span>
      </td>
    </tr>
  ));

  StudentRow.displayName = 'StudentRow';

  const onSelectHeader = useCallback((key: string, event: React.MouseEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
    setEditingKey(key);
    setEditValue(headers[key]?.label || '');
    setEditingStyle(headers[key] || {});
    setIsOpenPopover(true);
  }, [headers]);

  const onSelectFooter = useCallback((key: string, event: React.MouseEvent<HTMLParagraphElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
    setEditingKey(key);
    setEditValue(footer[key]?.label || '');
    setEditingStyle(footer[key] || {});
    setIsOpenPopover(true);
  }, [footer]);

  const handleClose = useCallback(() => {
    setIsOpenPopover(false);
    setEditingKey('');
    setEditValue('');
    setEditingStyle({});
  }, []);

  // Get current date
  const currentDate = useMemo(() => 
    new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), 
  []);

  // Helper function to get style for a header
  const getHeaderStyle = useCallback((key: string): React.CSSProperties => {
    const style = headers[key];
    if (!style) return {};
    
    return {
      color: style.textColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      textDecoration: style.textDecoration,
      textAlign: style.textAlign as any,
      verticalAlign: style.verticalAlign as any,
      width: style.width,
      height: style.height,
      backgroundColor: style.backgroundColor,
    };
  }, [headers]);

  // Helper function to get style for a footer
  const getFooterStyle = useCallback((key: string): React.CSSProperties => {
    const style = footer[key];
    if (!style) return {};
    
    return {
      color: style.textColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      textDecoration: style.textDecoration,
      textAlign: style.textAlign as any,
      verticalAlign: style.verticalAlign as any,
      width: style.width,
      height: style.height,
      backgroundColor: style.backgroundColor,
    };
  }, [footer]);

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
      scrollBehavior={true}
    >
      <PopoverEdit
        isOpen={isOpenPopover}
        value={editValue}
        style={editingStyle}
        onChange={handleTextChange}
        onStyleChange={handleStyleChange}
        onClose={handleClose}
        position={popoverPosition}
      />
      <div className="flex flex-col h-full">
        {/* Print Content */}
        <div 
          ref={printRef} 
          className="bg-white p-8 overflow-auto flex-1"
          style={{ fontFamily: 'Arial, sans-serif', color: '#000', fontSize: '12px' }}
        >
          {/* Header */}
          <div className="text-center mb-6 border-b border-zinc-300 pb-4">
            <div className="flex justify-center mb-4">
              <span 
                className="hover-text-edit cursor-pointer hover:bg-zinc-100 px-2 py-1 rounded transition-colors"
                onClick={(e) => onSelectHeader('title', e)}
                style={getHeaderStyle('title')}
              >
                {headers.title?.label}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-zinc-600">
              <div className="text-left space-y-1">
                <p className="flex items-center gap-2">
                  <span 
                    className="hover-text-edit"
                    onClick={(e) => onSelectHeader('institution', e)}
                    style={getHeaderStyle('institution')}
                  >
                    {headers.institution?.label}:
                  </span> 
                  <span>Build Bright University</span>
                </p>
                <p className="flex items-center gap-2">
                  <span 
                    className="hover-text-edit"
                    onClick={(e) => onSelectHeader('academicYear', e)}
                    style={getHeaderStyle('academicYear')}
                  >
                    {headers.academicYear?.label}:
                  </span> 
                  <span>2024-2025</span>
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="flex items-center gap-2 justify-end">
                  <span 
                    className="hover-text-edit"
                    onClick={(e) => onSelectHeader('reportDate', e)}
                    style={getHeaderStyle('reportDate')}
                  >
                    {headers.reportDate?.label}:
                  </span>
                  <span>{currentDate}</span>
                </p>
                <p className="flex items-center gap-2 justify-end">
                  <span 
                    className="hover-text-edit"
                    onClick={(e) => onSelectHeader('generatedBy', e)}
                    style={getHeaderStyle('generatedBy')}
                  >
                    {headers.generatedBy?.label}:
                  </span>
                  <span>ley-lery</span>
                </p>
              </div>
            </div>
          </div>

          {/* Data Tables by Class */}
          {Object.keys(groupedByClass).map((className) => {
            const classData = groupedByClass[className];
            const firstRow = classData[0];
            const stats = classStatistics[className];

            return (
              <div key={className} className="mb-8 page-break-inside-avoid">
                {/* Class info */}
                <div className="py-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="hover-text-edit"
                          onClick={(e) => onSelectHeader('class', e)}
                          style={getHeaderStyle('class')}
                        >
                          {headers.class?.label}
                        </span>
                        <span className="text-zinc-700">: {firstRow.class_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="hover-text-edit"
                          onClick={(e) => onSelectHeader('room', e)}
                          style={getHeaderStyle('room')}
                        >
                          {headers.room?.label}
                        </span>
                        <span className="text-zinc-700">: {firstRow.room_name}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="hover-text-edit"
                          onClick={(e) => onSelectHeader('course', e)}
                          style={getHeaderStyle('course')}
                        >
                          {headers.course?.label}
                        </span>
                        <span className="text-zinc-700">: {firstRow.course_code} - {firstRow.course_name_en}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="hover-text-edit"
                          onClick={(e) => onSelectHeader('faculty', e)}
                          style={getHeaderStyle('faculty')}
                        >
                          {headers.faculty?.label}
                        </span>
                        <span className="text-zinc-700">: {firstRow.faculty_name_en}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="hover-text-edit"
                          onClick={(e) => onSelectHeader('program', e)}
                          style={getHeaderStyle('program')}
                        >
                          {headers.program?.label}
                        </span>
                        <span className="text-zinc-700">: {firstRow.program_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students Table */}
                <div className="customize-table-wrapper">
                  <table className="w-full border-collapse border border-zinc-300 text-xs customize-table" style={{ tableLayout: 'fixed' }}>
                    <thead>
                      <tr>
                        <th 
                          className="border border-zinc-300 px-2 py-2 hover-text-edit"
                          style={getHeaderStyle('no')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('no', e)}
                          >
                            {headers.no?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('studentId')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('studentId', e)}
                          >
                            {headers.studentId?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('studentName')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('studentName', e)}
                          >
                            {headers.studentName?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('gender')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('gender', e)}
                          >
                            {headers.gender?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('present')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('present', e)}
                          >
                            {headers.present?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('absent')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('absent', e)}
                          >
                            {headers.absent?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('late')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('late', e)}
                          >
                            {headers.late?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('permission')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('permission', e)}
                          >
                            {headers.permission?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('total')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('total', e)}
                          >
                            {headers.total?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('attendancePercentage')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('attendancePercentage', e)}
                          >
                            {headers.attendancePercentage?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('status')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('status', e)}
                          >
                            {headers.status?.label}
                          </span>
                        </th>
                        <th 
                          className="border border-zinc-300 px-2 py-2"
                          style={getHeaderStyle('leaveDays')}
                        >
                          <span 
                            className="hover-text-edit cursor-pointer hover:opacity-70 px-1 rounded transition-opacity"
                            onClick={(e) => onSelectHeader('leaveDays', e)}
                          >
                            {headers.leaveDays?.label}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.map((student: any, idx: number) => (
                        <StudentRow key={idx} student={student} idx={idx} />
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-zinc-100 font-semibold">
                        <td colSpan={4} className="border border-zinc-300 px-2 py-2 text-right">
                          Class Total ({stats.totalStudents} students):
                        </td>
                        <td className="border border-zinc-300 px-2 py-2 text-center bg-green-100 text-green-700">{stats.totalPresent}</td>
                        <td className="border border-zinc-300 px-2 py-2 text-center bg-red-100 text-red-700">{stats.totalAbsent}</td>
                        <td className="border border-zinc-300 px-2 py-2 text-center bg-yellow-100 text-yellow-700">{stats.totalLate}</td>
                        <td className="border border-zinc-300 px-2 py-2 text-center bg-blue-100 text-blue-700">{stats.totalPermission}</td>
                        <td className="border border-zinc-300 px-2 py-2 text-center">{stats.totalSessions}</td>
                        <td className="border border-zinc-300 px-2 py-2 text-right text-blue-700">{stats.averageAttendance}%</td>
                        <td colSpan={2} className="border border-zinc-300 px-2 py-2 text-center">Class Average</td>
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
                <p 
                  className="mb-2 hover-text-edit cursor-pointer hover:bg-zinc-100 px-2 py-1 rounded transition-colors"
                  onClick={(e) => onSelectFooter('preparedBy', e)}
                  style={getFooterStyle('preparedBy')}
                >
                  {footer.preparedBy?.label}
                </p>
                <div className="w-48 h-16 mb-2 flex items-end justify-center">
                  <div className="text-zinc-400 italic text-xs">Signature</div>
                </div>
                <div className="w-full border-t border-zinc-300 pt-2 space-y-1">
                  <p className="text-xs font-medium text-zinc-700">Academic Staff</p>
                  <p className="text-xs text-zinc-500">Date: _______________</p>
                </div>
              </div>
              
              {/* Verified By */}
              <div className="flex flex-col items-center">
                <p 
                  className="mb-2 hover-text-edit cursor-pointer hover:bg-zinc-100 px-2 py-1 rounded transition-colors"
                  onClick={(e) => onSelectFooter('verifiedBy', e)}
                  style={getFooterStyle('verifiedBy')}
                >
                  {footer.verifiedBy?.label}
                </p>
                <div className="w-48 h-16 mb-2 flex items-end justify-center">
                  <div className="text-zinc-400 italic text-xs">Signature</div>
                </div>
                <div className="w-full border-t border-zinc-300 pt-2 space-y-1">
                  <p className="text-xs font-medium text-zinc-700">Department Head</p>
                  <p className="text-xs text-zinc-500">Date: _______________</p>
                </div>
              </div>
              
              {/* Approved By */}
              <div className="flex flex-col items-center">
                <p 
                  className="mb-2 hover-text-edit cursor-pointer hover:bg-zinc-100 px-2 py-1 rounded transition-colors"
                  onClick={(e) => onSelectFooter('approvedBy', e)}
                  style={getFooterStyle('approvedBy')}
                >
                  {footer.approvedBy?.label}
                </p>
                <div className="w-48 h-16 mb-2 flex items-end justify-center">
                  <div className="text-zinc-400 italic text-xs">Signature</div>
                </div>
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
  );
};

export default Customize;