/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "@heroui/react";
import { BsPlus } from "react-icons/bs";

interface TimeSlotProps {
  day: any;
  time: string;
  isEven: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  hasItem?: boolean;
  hasPrint?: boolean;
}
const TimeSlot: React.FC<TimeSlotProps> = ({
  children,
  onClick,
  hasItem = false,
  hasPrint = false,
  
}) => {
  return (
   <>
    {
      hasPrint ? <div
      className={`group  relative h-full min-h-[60px] border-b border-t border-r border-blue-950 p-1 transition-colors duration-200   ${hasItem ? "bg-white " : "bg-zinc-100 border-blue-950 "}`}
    >
      <div className="min-h-36">{children}</div>
    </div> :<div
      className={`group  relative h-full min-h-[60px] border-b border-r border-zinc-200 p-1 transition-colors duration-200 hover:bg-blue-50/30 dark:border-zinc-500 dark:hover:bg-blue-900/30 ${hasItem ? "bg-white dark:bg-zinc-800" : "bg-zinc-100 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-600"}`}
    >
      <div className="min-h-36">{children}</div>
      {/* Hover overlay for adding classes */}
      {!hasItem && (
        <div className="absolute inset-0 min-h-[60px] opacity-0 transition-opacity duration-200 hover:opacity-100 ">
          <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-blue-900/40 dark:to-indigo-900/40" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <Button
              onPress={onClick}
              size="sm"
              isIconOnly
              color="primary"
              className="rounded-full"
            >
              <BsPlus size={24} />
            </Button>
          </div>
        </div>
      )}
    </div>
    }
   </>
    
  );
};

export default TimeSlot;
