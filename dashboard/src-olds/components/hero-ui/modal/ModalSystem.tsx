import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  useDraggable,
  Spinner,
} from "@heroui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { type FormEvent, useRef } from "react";
import { Save } from "lucide-react";

const motionProps = {
  variants: {
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  },
};

interface Props {
  children: React.ReactNode;
  title?: string;
  titleTwo?: string;
  isEdit?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  closeForm?: () => void;
  resetForm?: () => void;
  onSaveClose?: () => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  radius?: "sm" | "md" | "lg";
  backdrop?: "blur" | "opaque" | "transparent";
  saveCloseLabel?: string;
  loading?: boolean;
}

const ModalSystem = ({
  children,
  title = "Modal Title",
  isOpen,
  onOpenChange,
  onSaveClose,
  closeForm,
  resetForm,
  onSubmit,
  size = "xl",
  radius = "lg",
  backdrop = "opaque",
  saveCloseLabel = "saveClose",
  loading = false,
}: Props) => {
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef: targetRef as any, isDisabled: !isOpen || size === "full" });

  const onClose = () => {
    if (closeForm) {
      closeForm();
    } else {
      onOpenChange(false);
    }
  };
  
  if (!isOpen) return null;

  return (
      <Modal
        ref={size === "full" ? null : targetRef}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={size}
        radius={radius}
        backdrop={backdrop}
        placement="top"
        motionProps={motionProps}
        scrollBehavior="inside"
        isDismissable={false}
        classNames={{
          backdrop: "bg-zinc-100/20 dark:bg-zinc-800/20",
        }}
      >
        <Form onSubmit={onSubmit} className="w-full">
          <ModalContent>
            {() => (
              <>
                <ModalHeader {...moveProps} className="flex items-center gap-2">
                  {title}
                </ModalHeader>
                  <ModalBody className="w-full ">
                      {children}
                  </ModalBody>
                  <ModalFooter
                  className={`flex w-full items-center overflow-auto justify-end`}
                  >
                    <div className="flex gap-1">
                      <Button
                        color="danger"
                        variant="flat"
                        onPress={onClose}
                        radius="md"
                        size="sm"
                        className="btn-small-ui"
                      >
                        {t("close")}
                      </Button>
                      {
                        resetForm && (
                          <Button
                            color="secondary"
                            variant="flat"
                            onPress={resetForm}
                            radius="md"
                            size="sm"
                            className="btn-small-ui"
                          >
                            {t("reset")}
                          </Button>
                        )
                      }
                      <Button
                        type="submit"
                        color="primary"
                        variant="solid"
                        onPress={onSaveClose}
                        radius="md"
                        size="sm"
                        className="btn-small-ui"
                        isDisabled={loading}
                        startContent={loading ? <Spinner variant="spinner" size="sm" color="white"/> : <Save size={14} />}
                      >
                        {t(saveCloseLabel)}
                      </Button>
                    </div>
                  </ModalFooter>
              </>
            )}
          </ModalContent>
        </Form>

      </Modal>
  );
};

export default ModalSystem;
