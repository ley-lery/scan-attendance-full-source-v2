import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDraggable,
} from "@heroui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import React from "react";

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

interface ModalViewUIProps {
  children: React.ReactNode;
  title?: string;
  titleTwo?: string;
  isEdit?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  radius?: "sm" | "md" | "lg";
  backdrop?: "blur" | "opaque" | "transparent";
}

const ModalViewUI = ({
  children,
  title = "Modal Title",
  titleTwo = "Modal Title",
  isEdit,
  isOpen,
  onOpenChange,
  size = "xl",
  radius = "lg",
  backdrop = "opaque",
}: ModalViewUIProps) => {
  const { t } = useTranslation("common");
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef: targetRef as any, isDisabled: !isOpen });
  if (!isOpen) return null;
  return (
      <Modal
        ref={targetRef}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={size}
        radius={radius}
        backdrop={backdrop}
        placement="top"
        motionProps={motionProps}
        scrollBehavior="inside"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps}>
                {isEdit ? titleTwo : title}
              </ModalHeader>
              <ModalBody>
                <div>{children}</div>
              </ModalBody>
              <ModalFooter className={`flex w-full items-center justify-end`}>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
};

export default ModalViewUI;
//
