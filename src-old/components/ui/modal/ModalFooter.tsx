import { type ReactNode, useContext } from "react";
import { cn } from "@/lib/utils";
import { ModalContext } from "@/context/ModalContext";

export const ModalFooter = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const { backgroundBlur } = useContext(ModalContext);

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 px-4 py-2 pb-4 w-full flex items-center justify-end gap-2 pt-4 z-10",
        backgroundBlur
          ? "bg-white/0 dark:bg-default-900/80"
          : "bg-white dark:bg-zinc-900",
        className
      )}
    >
      {children}
    </div>
  );
};
