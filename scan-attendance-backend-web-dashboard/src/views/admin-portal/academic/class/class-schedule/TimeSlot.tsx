interface TimeSlotProps {
    time: string;
    day: string;
    course: any;
    onSlotClick: (time: string, day: string) => void;
}
  

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, day, course, onSlotClick }) => {
  return (
    <td
      onClick={() => onSlotClick(time, day)}
      className="border border-blue-950 h-32 min-h-32 min-w-40 w-40 cursor-pointer hover:bg-blue-50 transition-colors dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      {course ? (
        <div className="flex flex-col justify-center items-center p-4 *:text-center">
          <div className="flex items-start *:text-sm *:text-black *:dark:text-zinc-300">
            <p className="font-bold">{course.courseName}</p>
          </div>
          <p className="text-sm">{course.credits} Credits</p>
          <p className="text-sm">Room: {course.room}</p>
          <p className="text-sm">{course.lecturerName}</p>
          <p className="text-xs">Tel: {course.phone}</p>
        </div>
      ) : (
        <div className="min-h-full min-w-full bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"></div>
      )}
    </td>
  );
};