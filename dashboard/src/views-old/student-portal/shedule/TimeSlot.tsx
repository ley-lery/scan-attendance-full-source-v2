import React from "react";

interface TimeSlotProps {
  day: string;
  time: string;
  hasItem?: boolean;
  children?: React.ReactNode;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  day,
  time,
  children,
  hasItem = false,
}) => {
  return (
    <div
      className={`relative h-40 border-l border-t border-b border-blue-950 dark:border-zinc-600  
        flex flex-col gap-1 ${hasItem ? "bg-white dark:bg-transparent" : "bg-zinc-200 dark:bg-zinc-800"}`}
      aria-label={`Time slot for ${day} at ${time}`}
    >
      {children}
    </div>
  );
};

export default TimeSlot;
