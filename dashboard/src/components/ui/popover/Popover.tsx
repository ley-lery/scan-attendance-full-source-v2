import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  useLayoutEffect,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSmartPlacement } from "@/hooks/useSmartPlacement";
import { cn } from "@/lib/utils";

type Placement = "top" | "bottom" | "left" | "right";

interface PopoverContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  placement: Placement;
  showArrow: boolean;
}

const PopoverContext = createContext<PopoverContextType | null>(null);

interface PopoverProps {
  children: ReactNode;
  showArrow?: boolean;
}

export const Popover = ({ children, showArrow = false }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  const close = useCallback(() => setIsOpen(false), []);

  // useSmartPlacement hook
  const placement = useSmartPlacement(triggerRef as React.RefObject<HTMLElement>);

  // click outside + ESC close
  useClickOutside(triggerRef as React.RefObject<HTMLElement>, () => setIsOpen(false));
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PopoverContext.Provider value={{ isOpen, toggle, close, triggerRef, placement, showArrow }}>
      <div ref={triggerRef} className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverTrigger must be used inside Popover");

  return (
    <div onClick={ctx.toggle} className="cursor-pointer select-none">
      {children}
    </div>
  );
};

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  classNames?: {
    base?: string;
    content?: string;
  };
}

export const PopoverContent = ({
  children,
  className = "",
  classNames = {}
}: PopoverContentProps) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverContent must be used inside Popover");

  const { isOpen, placement, showArrow } = ctx;

  const placementClass = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-0 my-2 translate-x-4",
    right: "left-0 my-2 -translate-x-4",
  }[placement];

  // Arrow positioning based on placement
  const arrowClass = {
    top: "left-1/2 -translate-x-1/2 top-full -mt-[1px]",
    bottom: "left-1/2 -translate-x-1/2 bottom-full -mb-[1px]",
    left: "top-1/2 -translate-y-1/2 left-full -ml-[1px]",
    right: "top-1/2 -translate-y-1/2 right-full -mr-[1px]",
  }[placement];

  // Arrow rotation based on placement
  const arrowRotation = {
    top: "rotate-180",
    bottom: "rotate-0",
    left: "rotate-90",
    right: "-rotate-90",
  }[placement];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={placement}
          initial={{ opacity: 0, scale: 0.95, y: placement === "top" ? 8 : -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: placement === "top" ? 8 : -8 }}
          transition={{ duration: 0.2 }}
          className={`absolute z-50 ${placementClass} ${classNames.base}`}
        >
          <div className={cn("rounded-2xl bg-zinc-100 dark:bg-neutral-900 p-2 relative w-fit", classNames.content, className)}>
            {children}
            
            {/* Arrow */}
            {showArrow && (
              <div className={cn("absolute w-3 h-3", arrowClass)}>
                <svg
                  className={cn("w-full h-full ", arrowRotation)}
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 0L12 12H0L6 0Z"
                    className="fill-zinc-100 dark:fill-neutral-900 "
                  />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PopoverCloseWrapper = ({ children }: { children: (ctx: { close: () => void }) => React.ReactNode }) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverCloseWrapper must be used inside Popover");
  return <>{children({ close: ctx.close })}</>;
};