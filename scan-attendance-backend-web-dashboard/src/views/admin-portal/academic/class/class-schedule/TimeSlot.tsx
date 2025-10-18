import { Button, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosAddCircle, IoIosCloseCircle, IoIosCloseCircleOutline } from "react-icons/io";

interface TimeSlotProps {
  time: string;
  day: string;
  course: any;
  onSlotClick: (time: string, day: string) => void;
  onRemove?: (day: string, time: string) => void;
  isEmpty?: boolean;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ 
  time, 
  day, 
  course, 
  onSlotClick, 
  onRemove,
  isEmpty 
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (onRemove) {
      onRemove(day, time);
    }
  };

  return (
    <td
      onClick={() => onSlotClick(time, day)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border border-blue-950 h-32 min-h-32 min-w-40 w-40 cursor-pointer hover:bg-blue-50 transition-colors dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 relative"
    >
      {course ? (
        <div className="flex flex-col justify-center items-center p-4 *:text-center relative">
          {/* Remove button - shows on hover */}
          {isHovered && onRemove && (
            <Tooltip content={t("remove")} size="sm" showArrow color="danger" closeDelay={0} classNames={{base: "pointer-events-none"}}>
              <Button 
                isIconOnly 
                startContent={<IoIosCloseCircle size={20} />} 
                radius="full" 
                color="danger" 
                size="sm" 
                variant="flat"
                onClick={handleRemoveClick}
                className="absolute top-2 right-2 z-10"
              />
            </Tooltip>
          )}


          <div className="flex items-start *:text-sm *:text-black *:dark:text-zinc-300">
            <p className="font-bold">{course.courseName}</p>
          </div>
          <p className="text-sm">{course.credits} Credits</p>
          <p className="text-sm">Room: {course.room}</p>
          <p className="text-sm">{course.lecturerName}</p>
          <p className="text-sm">Tel: {course.phone}</p>
        </div>
      ) : (
        <div className="min-h-full min-w-full bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 flex justify-center items-center">
          {isHovered && isEmpty && (
            <Tooltip content={t("add")} size="sm" showArrow color="primary" closeDelay={0} classNames={{base: "pointer-events-none"}}>
              <Button 
                isIconOnly 
                startContent={<IoIosAddCircle size={20} />} 
                radius="full" 
                color="primary" 
                size="sm" 
                variant="flat"
                onClick={() => onSlotClick(time, day)}
              />
            </Tooltip>
          )}
        </div>
      )}
    </td>
  );
};