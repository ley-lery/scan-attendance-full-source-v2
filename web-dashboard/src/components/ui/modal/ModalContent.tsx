interface ModalContentProps {
  children: (onClose: () => void) => React.ReactNode;
  onClose?: () => void;
}

export const ModalContent = ({
  children,
  onClose,
}: ModalContentProps) => {
  return (
    <div className="p-4 pb-20">{children(onClose!)}</div>
  );
};
