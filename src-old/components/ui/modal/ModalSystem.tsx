import { Button, Spinner } from "@heroui/react";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter } from "@/components/ui"
import React from "react";
import { useTranslation } from "react-i18next";
import { type FormEvent } from "react";
import { Save } from "lucide-react";

type ModalBackdrop = "regular" | "transparent" | "blur";

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
  size?: ModalSize;
  radius?: ModalRadius;
  backdrop?: ModalBackdrop;
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
  radius = "3xl",
  backdrop = "regular",
  saveCloseLabel = "saveClose",
  loading = false,
}: Props) => {
  const { t } = useTranslation();

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
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        radius={radius}
        backdrop={backdrop}
        position="top"
        isDismissable={false}
        isDraggable
      >
        <form onSubmit={onSubmit}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex items-center gap-2">
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
        </form>

      </Modal>
  );
};

export default ModalSystem;
