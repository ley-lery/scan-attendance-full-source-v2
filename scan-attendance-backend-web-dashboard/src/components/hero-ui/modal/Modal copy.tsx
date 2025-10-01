import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  Form,
  useDraggable,
  Spinner,
} from "@heroui/react";
import React, { useState } from "react";
// const Modal = lazy(() => import("@heroui/react").then(mod => ({ default: mod.Modal })));
import { FaTrash } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { IoBookmark } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { type FormEvent, useRef } from "react";

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

interface ModalUIProps {
  children: React.ReactNode;
  title?: string;
  titleTwo?: string;
  isEdit?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  closeForm?: () => void;
  resetForm?: () => void;
  onSaveDraft?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onSaveClose?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onSaveNew?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onOpenDraft?: () => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  radius?: "sm" | "md" | "lg";
  backdrop?: "blur" | "opaque" | "transparent";
  disabledBtn?: boolean;
}

const ModalUI = ({
  children,
  title = "Modal Title",
  titleTwo = "Modal Title",
  isEdit,
  isOpen,
  onOpenChange,
  resetForm,
  onSaveClose,
  onSaveNew,
  onSaveDraft,
  onOpenDraft,
  closeForm,
  onSubmit,
  size = "xl",
  radius = "lg",
  backdrop = "opaque",
  disabledBtn = false,
}: ModalUIProps) => {
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef: targetRef as any, isDisabled: !isOpen || size === "full" });

  const [loading, setLoading] = useState(false);

  const onClose = () => {
    if (closeForm) {
      closeForm();
    } else {
      onOpenChange(false);
    }
  };

  // Handler wrappers for async actions
  const handleSaveClose = async (e: any) => {
    if (!onSaveClose) return;
    setLoading(true);
    try {
      await onSaveClose(e);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveNew = async (e: any) => {
    if (!onSaveNew) return;
    setLoading(true);
    try {
      await onSaveNew(e);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveDraft = async (e: any) => {
    if (!onSaveDraft) return;
    setLoading(true);
    try {
      await onSaveDraft(e);
    } finally {
      setLoading(false);
    }
  };
  // Optionally wrap onSubmit if needed
  const handleSubmit = async (e: any) => {
    if (onSubmit) {
      setLoading(true);
      try {
        await onSubmit(e);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  
  return (
    // <Suspense fallback={<div className="absolute left-0 top-0 w-full h-full bg-black/40 z-50"></div>}>
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
      >
        <ModalContent>
          {() => (
            <>
            {
              loading && (
                <div className="flex items-center justify-center min-h-36 inset-0 absolute  bg-black/50 z-50">
                <Spinner variant="spinner" size="sm" label={t("loading")} />
              </div>
              )
            }
              <ModalHeader {...moveProps} className="flex items-center gap-2">
                {isEdit ? titleTwo : title}
              </ModalHeader>
              <Form onSubmit={onSubmit ? handleSubmit : undefined} className="w-full">
                <ModalBody className="w-full ">
                    {children}
                </ModalBody>
              </Form>
              <ModalFooter
              className={`flex w-full items-center overflow-auto ${!onOpenDraft ? "justify-end" : "justify-between"}`}
              >
                {onOpenDraft && (
                  <Tooltip content={t("fromDraft")} color="secondary">
                    <Button color="secondary" isIconOnly onPress={onOpenDraft} disabled={loading}>
                      <FaTrash />
                    </Button>
                  </Tooltip>
                )}
                <div className="flex gap-1">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    radius="sm"
                    size="sm"
                    className="px-4 pb-[18px] pt-[20px] font-semibold"
                  >
                    { t("close")}
                  </Button>
                  {!isEdit && resetForm && (
                    <Button
                      radius="sm"
                      size="sm"
                      className="px-4 pb-[18px] pt-[20px]"
                      color="danger"
                      variant="solid"
                      onPress={resetForm}
                    >
                      {t("clear")}
                    </Button>
                  )}
                  {!isEdit && onSaveDraft && (
                    <Button
                      type="submit"
                      color="primary"
                      radius="sm"
                      onPress={handleSaveDraft}
                      disabled={loading}
                      startContent={loading ? <Spinner size="sm" variant="spinner" color="white"/> : <FaTrash />}
                    >
                      {loading ? t("loading") : t("saveDraft")}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    onPress={handleSaveClose}
                    color="primary"
                    radius="sm"
                    size="sm"
                    isDisabled={loading}
                    startContent={
                      loading ? <Spinner size="sm" variant="spinner" color="white" /> : isEdit ? <RxUpdate size={16} /> : <IoBookmark size={16} />
                    }
                    className={`${onSaveClose ? "flex" : "hidden"} px-4 pb-[18px] pt-[20px]`}
                  >
                    {loading ? t("saving") : isEdit ? t("update") : t("saveClose")}
                  </Button>
                  {!isEdit && onSaveNew && (
                    <Button
                      type="submit"
                      onPress={handleSaveNew}
                      color="secondary"
                      radius="sm"
                      size="sm"
                      className="py-[1.1rem] px-[1.2rem] text-[.8rem]"
                      isDisabled={loading}
                      startContent={loading ? <Spinner size="sm" variant="spinner" color="white" /> : <IoBookmark size={16} />}
                    >
                      {loading ? t("saving") : t("saveNew")}
                    </Button>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>

      </Modal>
    // </Suspense>
  );
};

export default ModalUI;
