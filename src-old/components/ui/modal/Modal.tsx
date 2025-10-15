import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { DragContext } from "@/context/DragContext";
import { ModalContext } from "@/context/ModalContext"; 
import { Tooltip } from "@heroui/react";


interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  size?: ModalSize;
  radius?: ModalRadius;
  position?: ModalPosition;
  backdrop?: ModalBackdrop;
  shadow?: ModalShadow;
  animation?: ModalAnimation;
  isDismissable?: boolean;
  isDraggable?: boolean;
  hideCloseButton?: boolean;
  backgroundBlur?: boolean;
  blurSize?: 'sm' | 'md' | 'lg';
  classNames?:{
    modal?: string;
    modalBody?: string;
    modalHeader?: string;
    modalFooter?: string;
    closeButton?: string;
  }
}

const animationMap: Record<ModalAnimation, any> = {
  fade: {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closing: { opacity: 0, transition: { duration: 0.2 } },
  },
  "fade-up": {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closing: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  },
  "fade-down": {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closing: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  },
  scale: {
    open: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    closing: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  },
  "spring-scale": {
    open: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    closing: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  },
  "spring-up": {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 24 } },
    closing: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  },
  "spring-down": {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 24 } },
    closing: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  },
  "spring-left": {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 500, damping: 24 } },
    closing: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  },
  "spring-right": {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 500, damping: 24 } },
    closing: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  },
  "slide-up": {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closing: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  },
  "slide-down": {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closing: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  },
  "slide-left": {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closing: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  },
  "slide-right": {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closing: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  },
};

const sizeMap: Record<ModalSize, string> = {
  auto: "max-w-auto",
  xs: "max-w-xs",
  sm: "max-w-[21rem]",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "w-full h-screen",
};

const radiusMap: Record<ModalRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

const positionMap: Record<ModalPosition, string> = {
  top: "items-start pt-10",
  bottom: "items-end pb-10",
  center: "items-center",
  left: "items-center justify-start pl-4 pt-4",
  right: "items-center justify-end pr-4 pt-4",
  "top-right": "items-start justify-end pt-4 pr-4",
  "top-left": "items-start justify-start pt-4 pl-4",
  "bottom-right": "items-end justify-end pb-4 pr-4",
  "bottom-left": "items-end justify-start pb-4 pl-4",
};

const backdropMap = {
  blur: "backdrop-blur-sm bg-black/40",
  transparent: "",
  regular: "bg-black/40",
};

const backdropProps = {
  open: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  closing: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const shadowMap = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

export const Modal = ({
  isOpen,
  onClose,
  children = "Body",
  size = "md",
  radius = "2xl",
  position = "top",
  backdrop = "regular",
  backgroundBlur = false,
  blurSize = "sm",
  isDismissable = true,
  hideCloseButton = false,
  shadow = "lg",
  animation = "fade-down",
  isDraggable = false,
  classNames = {},
}: ModalProps) => {
  const [visible, setVisible] = useState(isOpen);
  const [startClose, setStartClose] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const dragControls = useDragControls();
  const dragProps = isDraggable
    ? {
        drag: true,
        dragControls,
        dragListener: false,
        dragConstraints: modalRef,
      }
    : {};


  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setStartClose(false);
    } else if (visible) {
      setStartClose(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setStartClose(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const modalWidth = sizeMap[size] || "max-w-md";
  const modalRadius = radiusMap[radius] || "rounded-2xl";
  const isFullScreen = size === "full";

  const blurSizeMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };
  const modalBackground = backgroundBlur ? cn("bg-white/30 dark:bg-default-900/80", blurSizeMap[blurSize])  : "bg-white dark:bg-zinc-900";

  const modalClass = isFullScreen
    ? cn("relative w-full h-full min-w-full min-h-full", !isFullScreen && modalRadius, "overflow-hidden shadow-xl dark:shadow-2xl", modalBackground)
    : cn("relative", "w-full", modalWidth, !isFullScreen && modalRadius, "overflow-hidden shadow-xl dark:shadow-2xl", modalBackground);

  if (!visible) return null;

  const selectedAnimation = animationMap[animation] || animationMap["fade-up"];

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed inset-0 z-50 flex justify-center",
          !isFullScreen && positionMap[position],
          backdropMap[backdrop],
        )}
        variants={backdropProps}
        initial="closing"
        animate={startClose ? "closing" : "open"}
        exit="closing"
        aria-modal="true"
        tabIndex={-1}
        onClick={isDismissable ? handleClose : undefined}
        ref={modalRef}
      >
        <DragContext.Provider value={{ dragControls, isDraggable }}>
        <ModalContext.Provider value={{ backgroundBlur }}>
          <motion.div
            className={cn(modalClass, shadowMap[shadow])}
            style={isFullScreen ? { width: "100vw", height: "100vh" } : undefined}
            variants={selectedAnimation}
            initial="closing"
            animate={startClose ? "closing" : "open"}
            exit="closing"
            onClick={(e) => e.stopPropagation()}
            dragMomentum={false}        
            dragElastic={0} 
            dragListener={false}
            {...(isFullScreen ? undefined : dragProps)} 
            
          >
            {!hideCloseButton && (
              <Tooltip content="Esc to close" placement="left" closeDelay={0} delay={200}>
                <button
                  onClick={handleClose}
                  type="button"
                  className={cn("absolute top-2 right-2 z-10 rounded-full p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer duration-300 transition-colors", classNames.closeButton)}
                  aria-label="Close"
                >
                  <IoIosClose size={24} className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white" />
                </button>
              </Tooltip>
            )}
            <main>{children}</main>
          </motion.div>
        </ModalContext.Provider>
        </DragContext.Provider>
      </motion.div>
    </AnimatePresence>
  );
};
