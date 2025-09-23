import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export const ModalFooter = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={cn("absolute bottom-0 left-0 p-4 w-full flex items-center justify-end gap-2 pt-4", className)}>{children}</div>
);
