import {
  cn,
  Spinner,
} from "@heroui/react";
import { Button } from "@/components/hero-ui";
import { useTranslation } from "react-i18next";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/god-ui";


interface ReportModalProps {
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
  isLoading?: boolean
  loadingBackdrop?: boolean
  onPrint?: () => void
  onExport?: () => void
  scrollBehavior?: boolean;
}

const ReportModal = ({
  children,
  title = "Modal Title",
  titleTwo = "Modal Title",
  isEdit,
  isOpen,
  onClose,
  size = "full",
  radius = "lg",
  backdrop = "regular",
  animation = "slide-down",
  isLoading = false,
  loadingBackdrop = true,
  onPrint,
  onExport,
  scrollBehavior = false
}: ReportModalProps) => {
  const { t } = useTranslation("common");
  if (!isOpen) return null;
  return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        radius={radius}
        backdrop={backdrop}
        position="top"
        isDismissable={false}
        isDraggable={false}
        animation={animation}
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {() => (
            <>
             {
                isLoading && (
                  <div className={cn("flex items-center justify-center min-h-36 inset-0 absolute z-50 bg-white/20 dark:bg-black/20 ", loadingBackdrop && "backdrop-blur-sm")}>
                  <Spinner variant="spinner" size="sm" label={t('loading')} />
                </div>
                )
              }
              <ModalHeader>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{isEdit ? titleTwo : title}</p>
              </ModalHeader>
              <ModalBody>
                <div>{children}</div>
              </ModalBody>
              <ModalFooter className={`flex w-full items-center justify-end`}>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("close")}
                </Button>
                {
                  onPrint && (
                    <Button color="primary" onPress={onPrint}>
                      {t("print")}
                    </Button>
                  )
                }
                {
                  onExport && (
                    <Button color="secondary" onPress={onExport}>
                      {t("export")}
                    </Button>
                  )
                }
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
};

export default ReportModal;
//
