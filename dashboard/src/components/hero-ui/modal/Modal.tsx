import {
  Tooltip,
  Form,
  useDraggable,
  Spinner,
} from "@heroui/react";
import { Button } from "@/components/hero-ui";
import React, { useState, useCallback, useMemo, memo, useRef, type FormEvent } from "react";
import { FaTrash } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { IoBookmark } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/god-ui";
import { cn } from "@/lib/utils";
import { PiBroomFill } from "react-icons/pi";

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
  loadingType?: "blur" | "regular";
  hideIconLoading?: boolean;
  labels?:{
    saveClose?: string;
    saveNew?: string;
    saveDraft?: string;
    openDraft?: string;
    closeButton?: string;
    clearButton?: string;
    cancelButton?: string;
  }
  scrollBehavior?: boolean;
}

const ModalUI = memo(({
  children,
  title = "Modal Title",
  titleTwo = "Modal Title",
  isEdit = false,
  isOpen,
  onClose,
  resetForm,
  onSaveClose,
  onSaveNew,
  onSaveDraft,
  onOpenDraft,
  onSubmit,
  size = "xl",
  radius = "lg",
  backdrop = "regular",
  loadingType = "regular",
  hideIconLoading = true,
  scrollBehavior = false,
}: ModalUIProps) => {
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ 
    targetRef: targetRef as any, 
    isDisabled: !isOpen || size === "full" 
  });

  const [loading, setLoading] = useState(false);

  //  Memoize loading overlay className
  const loadingOverlayClass = useMemo(() => 
    cn(
      "flex items-center justify-center min-h-36 inset-0 absolute bg-white/40 dark:bg-black/20 z-50",
      loadingType === "blur" ? "backdrop-blur-sm" : ""
    ),
    [loadingType]
  );

  // Memoize modal title
  const modalTitle = useMemo(() => 
    isEdit ? titleTwo : title,
    [isEdit, title, titleTwo]
  );

  // Memoize footer class
  const footerClass = useMemo(() => 
    `flex w-full items-center overflow-auto ${!onOpenDraft ? "justify-end" : "justify-between"}`,
    [onOpenDraft]
  );

  // Use useCallback for all handlers
  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  const handleSaveClose = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (!onSaveClose) return;
    setLoading(true);
    try {
      await onSaveClose(e);
    } catch (error) {
      console.error('Save close error:', error);
    } finally {
      setLoading(false);
    }
  }, [onSaveClose]);

  const handleSaveNew = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (!onSaveNew) return;
    setLoading(true);
    try {
      await onSaveNew(e);
    } catch (error) {
      console.error('Save new error:', error);
    } finally {
      setLoading(false);
    }
  }, [onSaveNew]);

  const handleSaveDraft = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (!onSaveDraft) return;
    setLoading(true);
    try {
      await onSaveDraft(e);
    } catch (error) {
      console.error('Save draft error:', error);
    } finally {
      setLoading(false);
    }
  }, [onSaveDraft]);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (!onSubmit) return;
    setLoading(true);
    try {
      await onSubmit(e);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  }, [onSubmit]);

  const handleReset = useCallback(() => {
    if (resetForm) {
      resetForm();
    }
  }, [resetForm]);

  // Memoize button text and icons
  const saveCloseButtonContent = useMemo(() => ({
    text: loading ? (isEdit ? t("updating") : t("saving")) : (isEdit ? t("update") : t("saveClose")),
    icon: loading ? (
      <Spinner variant="spinner" size="sm" color="white" />
    ) : isEdit ? (
      <RxUpdate size={16} />
    ) : (
      <IoBookmark size={16} />
    )
  }), [loading, isEdit, t]);

  const saveNewButtonContent = useMemo(() => ({
    text: loading ? (isEdit ? t("updating") : t("saving")) : t("saveNew"),
    icon: loading ? (
      <Spinner variant="spinner" size="sm" color="white" />
    ) : (
      <IoBookmark size={16} />
    )
  }), [loading, isEdit, t]);

  const saveDraftButtonContent = useMemo(() => ({
    text: loading ? t("saving") : t("saveDraft"),
    icon: loading ? (
      <Spinner variant="spinner" size="sm" color="white" />
    ) : (
      <FaTrash />
    )
  }), [loading, t]);

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
      animation="fade-down"
      isDismissable={false}
      isDraggable
      scrollBehavior={scrollBehavior}
    >
      <ModalContent>
        {() => (
          <>
            {loading && (
              <div className={loadingOverlayClass}>
                {!hideIconLoading && (
                  <Spinner 
                    variant="spinner" 
                    size="sm" 
                    label={isEdit ? t("updating") : t("saving")} 
                  />
                )}
              </div>
            )}

            <ModalHeader {...moveProps} className="flex items-center gap-2 px-0">
              {modalTitle}
            </ModalHeader>

            <Form onSubmit={onSubmit ? handleSubmit : undefined} className="w-full">
              <ModalBody className="w-full">
                {children}
              </ModalBody>
            </Form>

            <ModalFooter className={footerClass}>
              {onOpenDraft && (
                <Tooltip content={t("fromDraft")} color="secondary">
                  <Button 
                    color="secondary" 
                    isIconOnly 
                    onPress={onOpenDraft} 
                    disabled={loading}
                    size="sm"
                  >
                    <FaTrash />
                  </Button>
                </Tooltip>
              )}

              <div className="flex gap-1">
                <Button
                  color="danger"
                  variant="flat"
                  onPress={handleClose}
                  size="sm"
                  isDisabled={loading}
                >
                  {t("close")}
                </Button>

                {!isEdit && resetForm && (
                  <Button
                    size="sm"
                    color="danger"
                    variant="solid"
                    onPress={handleReset}
                    isDisabled={loading}
                    startContent={<PiBroomFill size={16}/>}
                  >
                    {t("clear")}
                  </Button>
                )}

                {!isEdit && onSaveDraft && (
                  <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    onPress={handleSaveDraft}
                    isDisabled={loading}
                    startContent={saveDraftButtonContent.icon}
                  >
                    {saveDraftButtonContent.text}
                  </Button>
                )}

                {onSaveClose && (
                  <Button
                    type="submit"
                    onPress={handleSaveClose}
                    color="primary"
                    size="sm"
                    isDisabled={loading}
                    startContent={saveCloseButtonContent.icon}
                  >
                    {saveCloseButtonContent.text}
                  </Button>
                )}

                {!isEdit && onSaveNew && (
                  <Button
                    type="submit"
                    onPress={handleSaveNew}
                    color="secondary"
                    size="sm"
                    isDisabled={loading}
                    startContent={saveNewButtonContent.icon}
                  >
                    {saveNewButtonContent.text}
                  </Button>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

//  Add display name
ModalUI.displayName = 'ModalUI';

export default ModalUI;