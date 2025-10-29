import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/hero-ui";
import { Button, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { MdEdit } from "react-icons/md";

interface TimeSlotProps {
  time: string;
  day: string;
  course: any;
  onSlotClick: (time: string, day: string) => void;
  onRemove?: (day: string, time: string) => void;
  onEdit?: (time: string, day: string) => void;
  isEmpty?: boolean;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ 
  time, 
  day, 
  course, 
  onSlotClick, 
  onRemove,
  onEdit,
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(time, day);
    }
  };

  const handleCellClick = () => {
    if (course && onEdit) {
      onEdit(time, day);
    } else {
      onSlotClick(time, day);
    }
  };

  return (
    <td
      onClick={handleCellClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border border-blue-950 h-32 min-h-32 min-w-40 w-40 cursor-pointer hover:bg-blue-50 transition-colors dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 relative"
    >
      {course ? (
        <div className="flex flex-col justify-center items-center p-4 *:text-center relative">
          {/* Action buttons - show on hover */}
          {isHovered && (
            <div className="absolute top-2 right-2 z-10 flex gap-1">
              <Popover className="w-40" classNames={{content: 'px-1'}}>
                <PopoverTrigger>
                  <Button 
                    isIconOnly 
                    startContent={<BsThreeDotsVertical size={15} />} 
                    radius="full" 
                    color="primary" 
                    size="sm" 
                    variant="flat"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <Button 
                    startContent={<MdEdit size={20} />} 
                    radius="md" 
                    color="primary" 
                    size="sm" 
                    variant="light"
                    onClick={handleEditClick}
                    className="w-full justify-start"
                  >
                    Edit
                  </Button>
                  <Button 
                    startContent={<IoIosCloseCircle size={20} />} 
                    radius="md" 
                    color="danger" 
                    size="sm" 
                    variant="light"
                    onClick={handleRemoveClick}
                    className="w-full justify-start"
                  >
                    Remove
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
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