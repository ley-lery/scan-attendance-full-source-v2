import { type ReactNode, useContext } from "react";
import { useDrag } from "@/context/DragContext"; 
import { ModalContext } from "@/context/ModalContext";
import { cn } from "@/lib/utils";

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export const ModalHeader = ({ children, className = "" }: ModalHeaderProps) => {
  const { isDraggable, dragControls } = useDrag();
  const { backgroundBlur } = useContext(ModalContext);

  return (
    <div
      onPointerDown={(e) => {
        if (isDraggable && dragControls) dragControls.start(e);
      }}
      className={cn(
        "text-lg font-medium  mb-4 pb-2 absolute top-4 w-full",
        backgroundBlur 
          ? "bg-white/0 dark:bg-default-900/80 " 
          : "bg-white dark:bg-zinc-900",
        isDraggable && "cursor-move",
        className
      )}
    >
      <h1 className="text-lg">{children}</h1>
    </div>
  );
};
