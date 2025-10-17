import { useContext } from "react";
import { ModalContext } from "@/context/ModalContext";

interface ModalContentProps {
  children: (onClose: () => void) => React.ReactNode;
  onClose?: () => void;
}

export const ModalContent = ({
  children,
  onClose,
}: ModalContentProps) => {
  const { scrollBehavior } = useContext(ModalContext);
  return (
    <div className="mx-4 pt-14 pb-20 max-h-[calc(100vh-6rem)] " >
      <div className={scrollBehavior ? "overflow-auto has-scrollbar max-h-[calc(100vh-8rem)]" : "max-h-[calc(100vh-8rem)]"}>
        {children(onClose!)}
      </div>
    </div>
  );
};
