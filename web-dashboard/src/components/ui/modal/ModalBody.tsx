import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ModalBody = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={cn("space-y-2 text-sm", className)}>{children}</div>
);
