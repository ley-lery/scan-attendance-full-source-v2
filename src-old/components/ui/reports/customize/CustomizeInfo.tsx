import CustomizeFormEdit from "@/components/ui/reports/customize/CustomizeFormEdit";

interface CustomizeInfoProps {
  data: any;
  headers: {
    class: string;
    room: string;
    course: string;
    faculty: string;
    [key: string]: string;
  };
  updateHeader: (key: string, value: string) => void;
  visibility?: {
    showClassInfo?: boolean;
    showRoomInfo?: boolean;
    showCourseInfo?: boolean;
    showFacultyInfo?: boolean;
    showProgramInfo?: boolean;
  };
}

const CustomizeInfo = ({ 
  data, 
  headers, 
  updateHeader,
  visibility = {
    showClassInfo: true,
    showRoomInfo: true,
    showCourseInfo: true,
    showFacultyInfo: true,
    showProgramInfo: true
  }
}: CustomizeInfoProps) => {
  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-4 text-sm">
        {/* Column 1 */}
        <div className="text-zinc-600 dark:text-zinc-400 space-y-1">
          {visibility.showClassInfo && (
            <div className="flex items-center gap-2">
              <CustomizeFormEdit 
                value={headers.class} 
                onValueChange={(value) => updateHeader('class', value)} 
                layouts={{ width: 'auto' }} 
                className="border-none text-zinc-600 dark:text-zinc-400" 
                type="static" 
                tag="p"
              >
                {headers.class}:
              </CustomizeFormEdit> 
              {data.class_name}
            </div>
          )}
          {visibility.showRoomInfo && (
            <div className="flex items-center gap-2">
              <CustomizeFormEdit 
                value={headers.room} 
                onValueChange={(value) => updateHeader('room', value)} 
                layouts={{ width: 'auto' }} 
                className="border-none text-zinc-600 dark:text-zinc-400" 
                type="static" 
                tag="p"
              >
                {headers.room}:
              </CustomizeFormEdit> 
              {data.room_name}
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div className="text-zinc-600 dark:text-zinc-400 space-y-1">
          {visibility.showCourseInfo && (
            <div className="flex items-center gap-2">
              <CustomizeFormEdit 
                value={headers.course} 
                onValueChange={(value) => updateHeader('course', value)} 
                layouts={{ width: 'auto' }} 
                className="border-none text-zinc-600 dark:text-zinc-400" 
                type="static" 
                tag="p"
              >
                {headers.course}:
              </CustomizeFormEdit> 
              {data.course_code} - {data.course_name_en}
            </div>
          )}
          {visibility.showFacultyInfo && (
            <div className="flex items-center gap-2">
              <CustomizeFormEdit 
                value={headers.faculty} 
                onValueChange={(value) => updateHeader('faculty', value)} 
                layouts={{ width: 'auto' }} 
                className="border-none text-zinc-600 dark:text-zinc-400" 
                type="static" 
                tag="p"
              >
                {headers.faculty}:
              </CustomizeFormEdit> 
              {data.faculty_name_en}
            </div>
          )}
        </div>

        {/* Column 3 */}
        {visibility.showProgramInfo && (
          <div className="text-zinc-600 dark:text-zinc-400 space-y-1">
            <p><strong>Program:</strong> {data.program_type}</p>
            <p><strong>Promotion:</strong> {data.promotion_no} | <strong>Term:</strong> {data.term_no}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizeInfo;