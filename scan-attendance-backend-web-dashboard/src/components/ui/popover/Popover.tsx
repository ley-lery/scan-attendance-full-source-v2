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

type Placement = "top" | "bottom" | "left" | "right";

interface PopoverContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  placement: Placement;
}

const PopoverContext = createContext<PopoverContextType | null >(null);

export const Popover = ({ children }: { children: ReactNode }) => {
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
    <PopoverContext.Provider value={{ isOpen, toggle, close, triggerRef, placement }}>
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

export const PopoverContent = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverContent must be used inside Popover");

  const { isOpen, placement } = ctx;

  const placementClass = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-0 my-2 translate-x-4",
    right: "left-0 my-2 -translate-x-4",
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
          className={`absolute z-50 ${placementClass} ${className}`}
        >
          <div className="rounded-2xl bg-zinc-100 dark:bg-neutral-900 p-2">
            {children}
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
