import { addToast } from "@heroui/toast";
import { cn } from "@heroui/react";
import { IoClose } from "react-icons/io5";

interface ToastProps {
  title?: string;
  description: string;
  icon?: React.ReactNode;
  color: string | "success" | "error" | "warning";
  duration?: number;
  undo?: () => void;
}
const colorClassMap: Record<string, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
};
const SuccesIcon = ({ color }: { color: keyof typeof colorClassMap }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={cn(colorClassMap[color], "size-6")}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 
        3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 
        1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 
        3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 
        0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 
        1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 
        0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 
        0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
    />
  </svg>
);
const ErrorIcon = ({ color }: { color: keyof typeof colorClassMap }) =>(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn(colorClassMap[color], 'size-6')}>
  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
)
const WarningIcon = ({ color }: { color: keyof typeof colorClassMap }) =>(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={cn(colorClassMap[color], 'size-6')}>
  <path stroke-linecap="round" stroke-linejoin="round" d="m12 8.25-4.5 4.5m0-4.5 4.5 4.5M12 15v4.5m-6-4.5H18" />
</svg>
)

const ShowToast = ({ color, title, description, icon, undo, duration = 5000 }: ToastProps) => {
  if (!icon) {
    icon = {
      success: <SuccesIcon color={color} />,
      error: <ErrorIcon color={color} />,
      warning: <WarningIcon color={color} />,
    }[color];
  }
  return addToast({
    title: title,
    description: description,
    timeout: duration,
    icon: icon,
    classNames: {
      base: "max-w-full bg-zinc-50/80 border border-white rounded-2xl shadow-none dark:bg-black/60 backdrop-blur-sm dark:border-transparent py-3 ",
      closeButton: "opacity-100 absolute right-2 top-2 text-xl",
      icon: cn([`text-${color}-500`], 'size-6'),
    },
    endContent: undo ? (
      <button onClick={undo} className="mr-10 text-blue-500 text-sm">
        Undo
      </button>
    ) : null,
    closeIcon: <IoClose />,
  });
};

export default ShowToast;
