import {
  cn,
  Spinner,
} from "@heroui/react";
import { Button } from "@/components/hero-ui";
import { useTranslation } from "react-i18next";
import React, { memo, useMemo, useCallback, Suspense, lazy } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/god-ui";

interface ModalViewUIProps {
  children: React.ReactNode;
  title?: string;
  titleTwo?: string;
  isEdit?: boolean;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  radius?: "sm" | "md" | "lg";
  backdrop?: "blur" | "regular" | "transparent";
  animation?: "fade" | "fade-up" | "fade-down" | "scale" | "spring-scale" | "spring-up" | "spring-down" | "spring-left" | "spring-right" | "slide-up" | "slide-down" | "slide-left" | "slide-right";
  isLoading?: boolean;
  loadingBackdrop?: boolean;
  lazyLoadContent?: boolean; // Option to lazy load content
}

// Lazy load modal content (optional)
const LazyModalContent = lazy(() => Promise.resolve({ 
  default: ({ children }: { children: React.ReactNode }) => <>{children}</> 
}));

const ModalViewUI = memo(({
  children,
  title = "Modal Title",
  titleTwo = "Modal Title",
  isEdit = false,
  isOpen,
  onClose,
  size = "xl",
  radius = "lg",
  backdrop = "regular",
  animation = "slide-down",
  isLoading = false,
  loadingBackdrop = false,
  lazyLoadContent = false,
}: ModalViewUIProps) => {
  const { t } = useTranslation("common");

  // Memoize loading overlay className
  const loadingOverlayClass = useMemo(() => 
    cn(
      "flex items-center justify-center min-h-36 inset-0 absolute z-50 bg-white/20 dark:bg-black/20",
      loadingBackdrop && "backdrop-blur-sm"
    ),
    [loadingBackdrop]
  );

  // Memoize modal title
  const modalTitle = useMemo(() => 
    isEdit ? titleTwo : title,
    [isEdit, title, titleTwo]
  );

  // Use useCallback for onClose handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Memoize loading spinner
  const loadingSpinner = useMemo(() => (
    <div className={loadingOverlayClass}>
      <Spinner variant="spinner" size="sm" label={t('loading')} />
    </div>
  ), [loadingOverlayClass, t]);

  // Memoize close button
  const closeButton = useMemo(() => (
    <Button 
      color="danger" 
      variant="flat" 
      onPress={handleClose}
    >
      {t("close")}
    </Button>
  ), [handleClose, t]);

  //  Memoize modal body content
  const modalBodyContent = useMemo(() => {
    if (lazyLoadContent) {
      return (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[200px]">
            <Spinner size="sm" />
          </div>
        }>
          <LazyModalContent>{children}</LazyModalContent>
        </Suspense>
      );
    }
    return children;
  }, [children, lazyLoadContent]);

  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={size}
      radius={radius}
      backdrop={backdrop}
      position="top"
      isDismissable={false}
      isDraggable
      animation={animation}
    >
      <ModalContent>
        {() => (
          <>
            {isLoading && loadingSpinner}
            
            <ModalHeader>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {modalTitle}
              </p>
            </ModalHeader>
            
            <ModalBody>
              {modalBodyContent}
            </ModalBody>
            
            <ModalFooter className="flex w-full items-center justify-end">
              {closeButton}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

ModalViewUI.displayName = 'ModalViewUI';

export default ModalViewUI;