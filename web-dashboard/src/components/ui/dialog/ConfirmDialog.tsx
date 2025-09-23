import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Suspense, lazy, type FC, useRef } from "react";
const Modal = lazy(() =>
  import("@heroui/react").then((mod) => ({ default: mod.Modal }))
);

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  confirm: () => void;
  confirmLabel?: string;
  confirmIcon?: React.ReactNode;
  title?: string;
  message?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen = false,
  onOpenChange,
  confirm,
  confirmLabel = "Ok",
  confirmIcon,
  title = "Title",
  message = "Message",
}) => {
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef: targetRef as any, isDisabled: !isOpen });

  const handleConfirm = (onClose: () => void) => {
    onOpenChange(false);
    confirm();
    onClose();
  };
  return (
    <Suspense fallback={<div className="absolute left-0 top-0 w-full bg-black/50 h-full" />}>
      <Modal
        ref={targetRef}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xs"
        radius="lg"
        closeButton={false}
        classNames={{ closeButton: "hidden" }}
        backdrop="opaque"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1 text-center pb-1">
                <h2 className="text-base font-medium">{title}</h2>
              </ModalHeader>
              <ModalBody >
                <p className="text-center text-sm text-zinc-800 dark:text-zinc-300">
                  {message}
                </p>
              </ModalBody>
              <ModalFooter className="mt-2 justify-start  p-0 dark:border-white/10">
                <div className="flex w-full items-center justify-center gap-2 p-4 pt-0">
                  <Button
                    type="button"
                    onPress={onClose}
                    className="btn-small-ui"
                    color="primary"
                    radius="full"
                    >
                    {t("cancel")}
                  </Button>
                  {/* <i className="flex h-full w-px bg-black/10 dark:bg-white/10" /> */}
                  <Button
                    type="button"
                    onPress={() => handleConfirm(onClose)}
                    className="btn-small-ui"
                    color="danger"
                    radius="full"
                    startContent={confirmIcon}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Suspense>
  );
};

export default ConfirmDialog;