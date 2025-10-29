import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody } from "@/god-ui"
import { Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { memo, useMemo, useCallback } from "react";
import { BsSend } from "react-icons/bs";
import { Button } from "@/components/hero-ui"
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
interface ModalRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (e?: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  children: React.ReactNode;
  title: string;
  onRequest?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  cancelText?: string;
  requestText?: string;
  isDisabled?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  submitText?: string;
  showOverlayLoading?: boolean;
}

const ModalRequest = memo(({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  children,
  title,
  onRequest,
  size = "xl",
  cancelText,
  requestText,
  isDisabled = false,
  onApprove,
  onReject,
  submitText,
  showOverlayLoading = false,
}: ModalRequestProps) => {
  const { t } = useTranslation();

  const loadingOverlayClass = useMemo(
    () =>
      "flex items-center justify-center min-h-36 inset-0 absolute bg-white/20 dark:bg-black/20 backdrop-blur-sm z-50",
    []
  );

  const buttonTexts = useMemo(
    () => ({
      cancel: cancelText || t("cancel"),
      request: requestText || t("request"),
      approve: submitText || t("approve"),
      reject: submitText || t("reject"),
    }),
    [cancelText, requestText, t, submitText]
  );

  const handleApprove = useCallback(() => {
    if (!isLoading && !isDisabled) {
      onApprove?.();
    }
  }, [onApprove, isLoading, isDisabled]);

  const handleReject = useCallback(() => {
    if (!isLoading && !isDisabled) {
      onReject?.();
    }
  }, [onReject, isLoading, isDisabled]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  const handleRequest = useCallback(() => {
    if (!isLoading && !isDisabled) {
      onRequest?.();
    }
  }, [onRequest, isLoading, isDisabled]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(e);
      }
    },
    [onSubmit]
  );

  const loadingSpinner = useMemo(
    () => (
      <div className={loadingOverlayClass}>
        <Spinner variant="spinner" size="sm" label={t("loading")} />
      </div>
    ),
    [loadingOverlayClass, t]
  );

  const footerButtons = useMemo(
    () => (
      <>
        <Button
          onPress={handleClose}
          variant="flat"
          color="danger"
          isDisabled={isLoading}
        >
          {buttonTexts.cancel}
        </Button>
        { !onApprove && !onReject && <Button
            onPress={handleRequest}
            variant="solid"
            color="primary"
            startContent={!isLoading && <BsSend size={16} />}
            isLoading={isLoading}
            isDisabled={isDisabled}
            spinner={<Spinner variant="spinner" size="sm" color="white"/>}
          >
            {buttonTexts.request}
          </Button>}
          {onApprove && (
          <Button
            onPress={handleApprove}
            variant="solid"
            color="primary"
            startContent={!isLoading && <IoCheckmarkCircleOutline size={20} />}
            isLoading={isLoading}
            isDisabled={isDisabled}
            spinner={<Spinner variant="spinner" size="sm" color="white"/>}
          >
            {buttonTexts.approve}
          </Button>
        )}
        {onReject && (
          <Button
            onPress={handleReject}
            variant="solid"
            color="danger"
            startContent={!isLoading && <IoIosCloseCircleOutline size={16} />}
            isLoading={isLoading}
            isDisabled={isDisabled}
            spinner={<Spinner variant="spinner" size="sm" color="white"/>}
          >
            {buttonTexts.reject}
          </Button>
        )}
      </>
    ),
    [handleClose, handleRequest, buttonTexts, isLoading, isDisabled, onApprove, onReject]
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isDraggable
      isDismissable={!isLoading}
      size={size}
    >
      <ModalContent>
        {() => (
          <>
            {isLoading && showOverlayLoading && loadingSpinner}

            <ModalHeader>{title}</ModalHeader>

            <ModalBody>
              {onSubmit ? (
                <form onSubmit={handleSubmit}>
                  {children}
                </form>
              ) : (
                children
              )}
            </ModalBody>

            <ModalFooter>{footerButtons}</ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

ModalRequest.displayName = "ModalRequest";

export default ModalRequest;