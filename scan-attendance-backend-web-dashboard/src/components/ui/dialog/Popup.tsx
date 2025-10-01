/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCloseOutline } from "react-icons/io5";

interface PopupUiProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: () => void;
  children?: React.ReactNode;
  header?: string;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  radius?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  position?: "top" | "bottom" | "center";
  animation?: "scale" | "fade" | "clip" | "fade-top" | "fade-bottom";
  footerPlacement?: "left" | "center" | "right";
  btnLabel?: string;
  iconClose?: boolean
}

const sizeMap: Record<NonNullable<PopupUiProps["size"]>, string> = {
  sm: "max-w-[21rem]",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "w-full max-w-full",
};

const radiusMap: Record<NonNullable<PopupUiProps["radius"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

const positionMap: Record<NonNullable<PopupUiProps["position"]>, string> = {
  top: "items-start pt-20",
  bottom: "items-end pb-10",
  center: "items-center",
};
const footerPlacementMap: Record<NonNullable<PopupUiProps["footerPlacement"]>, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
}

const modalVariantsMap = {
  scale: {
    open: {
      opacity: 1,
      scale: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
    closing: {
      opacity: 0,
      scale: 0.9,
      height: 0,
      overflow: "hidden",
      transition: { duration: 0.2 },
    },
  },
  fade: {
    open: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closing: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
  clip: {
    open: {
      height: "auto",
      transition: { duration: 0.3 },
    },
    closing: {
      height: 0,
      overflow: "hidden",
      transition: { duration: 0.2 },
    },
  },
  "fade-top": {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    closing: {
      opacity: 0,
      y: -40,
      transition: { duration: 0.2 },
    },
  },
  "fade-bottom": {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    closing: {
      opacity: 0,
      y: 40,
      transition: { duration: 0.2 },
    },
  },
};


const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const PopupUi = ({
  isOpen,
  onClose,
  children = "Body",
  header ,
  size = "md",
  radius = "2xl",
  position = "center",
  animation = "scale",
  footerPlacement = "right",
  onSave,
  btnLabel = "save",
  iconClose = true

}: PopupUiProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isOpen);
  const [startClose, setStartClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setStartClose(false);
    } else {
      handleClose();
    }
  }, [isOpen]);

  const handleClose = () => {
    setStartClose(true);
    setTimeout(() => {
      setVisible(false);
      setStartClose(false);
      if (onClose) {
        onClose();
      }
    }, 200);
  };

  const modalVariants = modalVariantsMap[animation] || modalVariantsMap.scale;
  const modalWidth = sizeMap[size] || "max-w-md";
  const modalRadius = radiusMap[radius] || "rounded-2xl";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed inset-0 z-50 flex justify-center ${positionMap[position] || "items-center"} bg-black/50 backdrop-blur-sm`}
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          <motion.div
            className={`relative w-full ${modalWidth} ${modalRadius} overflow-hidden bg-white shadow-xl dark:bg-zinc-900 dark:shadow-2xl`}
            variants={modalVariants}
            initial="open"
            animate={startClose ? "closing" : "open"}
          >
            {
              onClose && iconClose && 
              <button
                className="absolute right-3 top-3 rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-200 dark:hover:bg-zinc-700 "
                onClick={handleClose}
              >
                <IoCloseOutline size={20} />
              </button>
            }
            <div className="p-4">
              {
              header &&
                <header>
                  <h2 className="mb-4 text-lg font-medium">{header}</h2>
                </header>
              }
              <main>{children}</main>
              <footer className={`flex items-center gap-2 pt-4  ${footerPlacementMap[footerPlacement] || "justify-end"}`}>
                <Button onPress={handleClose}  color="danger" variant="solid" radius="full" className="btn-small-ui">
                  {t('close')}
                </Button>
                {onSave && (
                  <Button onPress={()=>{
                    onSave();
                    handleClose();
                  }} color="primary" variant="solid" radius="full" className="btn-small-ui">
                    {t(btnLabel)}
                  </Button>
                )}
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupUi;
