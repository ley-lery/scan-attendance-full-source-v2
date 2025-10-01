interface ModalContentProps {
  children: (onClose: () => void) => React.ReactNode;
  onClose?: () => void;
}

export const ModalContent = ({
  children,
  onClose,
}: ModalContentProps) => {
  return (
    <div className="mx-4 mt-12 pt-4 pb-20 max-h-[calc(100vh-6rem)] overflow-auto has-scrollbar">
      {children(onClose!)}
    </div>
  );
};
