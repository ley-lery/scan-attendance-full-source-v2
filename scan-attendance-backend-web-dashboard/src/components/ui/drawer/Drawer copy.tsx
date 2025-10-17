import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@heroui/react";
import { DrawerContext,useDrawerContext } from "@/context/DrawerContext";

type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
type DrawerPlacement = "top" | "bottom" | "left" | "right";
type DrawerRadius = "none" | "sm" | "md" | "lg";
type DrawerBackdrop = "blur" | "transparent" | "regular";
type DrawerBackground = "default" | "blur";
type DrawerShadow = "none" | "sm" | "md" | "lg";

type DrawerProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  radius?: DrawerRadius;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  shouldBlockScroll?: boolean;
  hideCloseButton?: boolean;
  closeButton?: ReactNode;
  backdrop?: DrawerBackdrop;
  background?: DrawerBackground;
  shadow?: DrawerShadow;
  classNames?: {
    drawer?: string;
    drawerContent?: string;
    drawerBody?: string;
    drawerFooter?: string;
    drawerHeader?: string;
   };
};

const sizeMap: Record<string, string> = {
  xs: "min-w-xs max-w-xs",
  sm: "min-w-sm max-w-sm",
  md: "min-w-md max-w-md",
  lg: "min-w-lg max-w-lg",
  xl: "min-w-xl max-w-xl",
  "2xl": "min-w-2xl max-w-2xl",
  "3xl": "min-w-3xl max-w-3xl",
  "4xl": "min-w-4xl max-w-4xl",
  "5xl": "min-w-5xl max-w-5xl",
  full: "w-screen h-screen",
};

const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-tl-sm rounded-bl-sm rounded-tr-none rounded-br-none",
  md: "rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none",
  lg: "rounded-tl-lg rounded-bl-lg rounded-tr-none rounded-br-none",
};

export const Drawer = ({
  children,
  isOpen,
  onClose,
  placement = "right",
  size = "md",
  radius = "lg",
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  shouldBlockScroll = true,
  hideCloseButton = false,
  closeButton,
  backdrop = "regular",
  background = "default",
  shadow = "lg",
  classNames = {},
}: DrawerProps) => {
  useEffect(() => {
    if (shouldBlockScroll && isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [shouldBlockScroll, isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isKeyboardDismissDisabled && e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isKeyboardDismissDisabled, isOpen, onClose]);

  const placementStyles = {
    right: "right-0 top-0 h-full",
    left: "left-0 top-0 h-full",
    top: "top-0 left-0 w-full",
    bottom: "bottom-0 left-0 w-full",
  };

  const motionVariants = {
    hidden: {
      x: placement === "right" ? "100%" : placement === "left" ? "-100%" : 0,
      y: placement === "bottom" ? "100%" : placement === "top" ? "-100%" : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type: "tween" },
    },
    exit: {
      x: placement === "right" ? "100%" : placement === "left" ? "-100%" : 0,
      y: placement === "bottom" ? "100%" : placement === "top" ? "-100%" : 0,
      opacity: 1,
      transition: { type: "tween" },
    },
  };

  const backdropMap = {
    blur: "backdrop-blur-sm bg-black/40",
    transparent: "",
    regular: "bg-black/40"
  };
  const backgroundMap = {
    default: "bg-white dark:bg-zinc-900 border-l dark:border-zinc-800 border-transparent shadow-xl shadow-transparent dark:shadow-black/80",
    blur: "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm",
  };
  const shadowMap = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };
  return (
    <DrawerContext.Provider
      value={{
        classNames,
      }}
    >

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className={cn("fixed inset-0 z-50 pointer-events-auto", backdropMap[backdrop])}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => isDismissable && onClose()}
            />

            {/* Drawer panel */}
            <motion.div
              className={cn(
                "fixed z-50 flex flex-col",
                placementStyles[placement],
                sizeMap[size],
                radiusMap[radius],
                backgroundMap[background],
                shadowMap[shadow]
              )}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={motionVariants as any}
              onClick={(e) => e.stopPropagation()}
            >
              {!hideCloseButton && (
                <div className="absolute top-3 right-3 z-10">
                  {closeButton ?? (
                    <Button onClick={onClose} isIconOnly startContent={<X size={16}/>} size="sm" variant="light" radius="full" color="default"/>
                  )}
                </div>
              )}
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
  </DrawerContext.Provider>
  );
};

export const DrawerContent = ({ children }: { children: ReactNode }) => {
    const {classNames} = useDrawerContext();
    return (
    <div className={cn("px-4 overflow-hidden flex-1 mb-14", classNames.drawerContent)}>{children}</div>
  );
};
  
  export const DrawerHeader = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const {classNames} = useDrawerContext();
    return (
    <div className={cn("text-xl font-semibold  p-4", className, classNames.drawerHeader)}>{children}</div>
  );
};
  
  export const DrawerBody = ({ children }: { children: ReactNode }) => {
    const {classNames} = useDrawerContext();
    return (
    <div className={cn("mb-4 h-[90%] overflow-y-auto overflow-x-hidden has-scrollbar relative", classNames.drawerBody)}>{children}</div>
  );
};
  
export const DrawerFooter = ({ children }: { children: ReactNode }) => {
  const {classNames} = useDrawerContext();
  return (
    <div className={cn("absolute bottom-0 left-0 w-full p-4 flex justify-end gap-2", classNames.drawerFooter)}>{children}</div>
  );
};
  