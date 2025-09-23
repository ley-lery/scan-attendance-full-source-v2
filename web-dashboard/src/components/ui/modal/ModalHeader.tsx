import { type ReactNode } from "react";
import { useDrag } from "@/context/DragContext"; 
import { cn } from "@/lib/utils";

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export const ModalHeader = ({ children, className = "" }: ModalHeaderProps) => {
  const { isDraggable, dragControls } = useDrag();

  return (
    <div
      onPointerDown={(e) => {
        if (isDraggable && dragControls) {
          dragControls.start(e);
        }
      }}
      className={cn("text-lg font-medium mb-4", isDraggable ? "cursor-move" : "", className)}
    >
      <h1 className="text-lg">
        {children}
      </h1>
    </div>
  );
};
