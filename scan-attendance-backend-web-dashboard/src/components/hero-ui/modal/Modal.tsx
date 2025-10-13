import {
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
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/god-ui";




interface ModalUIProps {
  children: React.ReactNode;
  title?: string;
  titleTwo?: string;
  isEdit?: boolean;
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  closeForm?: () => void;
  resetForm?: () => void;
  onSaveDraft?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onSaveClose?: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onSaveNew?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onOpenDraft?: () => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  radius?: "sm" | "md" | "lg";
  backdrop?: "blur" | "regular" | "transparent";
  disabledBtn?: boolean;
}

const ModalUI = ({
  children,
  title = "Modal Title",
  titleTwo = "Modal Title",
  isEdit,
  isOpen,
  onClose,
  resetForm,
  onSaveClose,
  onSaveNew,
  onSaveDraft,
  onOpenDraft,
  closeForm,
  onSubmit,
  size = "xl",
  radius = "lg",
  backdrop = "regular",
}: ModalUIProps) => {
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef: targetRef as any, isDisabled: !isOpen || size === "full" });

  const [loading, setLoading] = useState(false);

  

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
        isOpen={isOpen}
        onClose={() => onClose(false)}
        size={size}
        radius={radius}
        backdrop={backdrop}
        position="top"
        animation="fade-down"
        isDismissable={false}
        isDraggable
      >
        <ModalContent>
          {() => (
            <>
              {
                loading && (
                  <div className="flex items-center justify-center min-h-36 inset-0 absolute bg-white/20 dark:bg-black/20 backdrop-blur-sm z-50">
                  <Spinner variant="spinner" size="sm" label={isEdit ? t("updating") : t("saving")} />
                </div>
                )
              }
              <ModalHeader {...moveProps} className="flex items-center gap-2 px-0">
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
                    variant="flat"
                    onPress={() => onClose(false)}
                    radius="sm"
                    size="sm"
                  >
                    { t("close")}
                  </Button>
                  {!isEdit && resetForm && (
                    <Button
                      radius="sm"
                      size="sm"
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
                      startContent={ loading ? <Spinner variant="spinner" size="sm" color="white" /> : <FaTrash />}
                    >
                      {loading ? t("saving") : t("saveDraft")}
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
                      loading ? <Spinner variant="spinner" size="sm" color="white" /> : isEdit ? <RxUpdate size={16} /> : <IoBookmark size={16} />
                    }
                    className={`${onSaveClose ? "flex" : "hidden"}`}
                  >
                    {loading ? isEdit ? t("updating") : t("saving") : isEdit ? t("update") : t("saveClose")}
                  </Button>
                  {!isEdit && onSaveNew && (
                    <Button
                      type="submit"
                      onPress={handleSaveNew}
                      color="secondary"
                      radius="sm"
                      size="sm"
                      isDisabled={loading}
                      startContent={ loading ? <Spinner variant="spinner" size="sm" color="white"/> : <IoBookmark size={16} />}
                    >
                      {loading ? isEdit ? t("updating") : t("saving") : t("saveNew")}
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
