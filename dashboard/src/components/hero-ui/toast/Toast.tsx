import { IoIosWarning } from "react-icons/io"; 
import {
  IoCloseCircle,
  IoCloseOutline,
  IoCheckmarkCircle,
} from "react-icons/io5"; 
import { motion, type Variants } from "framer-motion"; 

interface ToastProps {
  type: "warning" | "success" | "error";
  msg: string;
  onClose: () => void;
  onUndo?: () => void;
  className?: string;
  option?: string;
  link?: string;
}

const toastVariants: Variants = {
  hidden: { opacity: 0, y: -20 }, 
  visible: { opacity: 1, y: 0 }, 
  exit: { opacity: 0, y: -20 }, 
};

const Toast: React.FC<ToastProps> = ({
  type,
  msg,
  onClose,
  onUndo,
  className = "",
  option,
}) => {
  // Conditional rendering for different toast types
  let icon;
  let iconColor;

  switch (type) {
    case "warning":
      icon = <IoIosWarning size={22} />;
      iconColor = "text-yellow-500";
      break;
    case "success":
      icon = <IoCheckmarkCircle size={22} />;
      iconColor = "text-green-500";
      break;
    case "error":
      icon = <IoCloseCircle size={22} />;
      iconColor = "text-red-500";
      break;
    default:
      icon = <IoIosWarning size={22} />;
      iconColor = "text-gray-500";
      break;
  }

  return (
    <motion.div
      className={`bg-white border border-white rounded-2xl shadow-lg shadow-zinc-200/10 dark:bg-black/30 dark:border-transparent"  absolute right-4 top-4 z-10 ${className}`}
      role="alert"
      variants={toastVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit" 
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex mr-4">
          <div className={`shrink-0 ${iconColor}`}>{icon}</div>
          <div className="ms-3">
            <p
              id="hs-toast-normal-example-label"
              className="text-sm dark:text-zinc-100 text-zinc-700 flex items-center gap-2"
            >
              {msg}
              {option && (
                <button onClick={onUndo} className="underline text-blue-500">
                  {option}
                </button>
              )}
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose}>
          <IoCloseOutline className="w-4 h-4 ml-auto dark:text-zinc-200 text-zinc-700" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
