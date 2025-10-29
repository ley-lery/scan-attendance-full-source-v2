/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShowToast } from "@/components/hero-ui";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@/hooks/useMutation";
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody } from "@/god-ui";
import { Button, Spinner, Textarea } from "@heroui/react";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface FormProps {
  isOpen?: boolean;
  onClose: () => void;
  loadList?: () => Promise<void>;
  isApprove?: boolean;
  leaveId?: number | null;
}

const initialFormData = { adminNote: "" };

const Form = ({ isOpen = false, onClose, loadList, isApprove, leaveId }: FormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialFormData);

  const id = leaveId ?? null;

  const { mutate: approveLeaveRequest, loading: approveLeaveRequestLoading } = useMutation({
    onSuccess: async (res) => {
      await loadList?.();
      onClose();
      ShowToast({ color: "success", title: "Success", description: res.response?.data?.message  ||  "Leave request approved successfully" });
    },
    onError: (err) => {
      console.log("Approve error : ", err);
      ShowToast({ color: "error", title: "Error", description: err.response?.data?.message || "Failed to approve leave request" });
    },
  });

  const { mutate: rejectLeaveRequest, loading: rejectLeaveRequestLoading } = useMutation({
    onSuccess: async (res) => {
      await loadList?.();
      onClose();
      ShowToast({ color: "success", title: "Success", description: res.response?.data?.message  ||  "Leave request rejected successfully" });
    },
    onError: (err) => {
      console.log("Reject error : ", err);
      ShowToast({ color: "error", title: "Error", description: err.response?.data?.message || "Failed to reject leave request" });
    },
  });

  // Handle input change for Textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (): Promise<boolean> => {
    console.log(formData, "formData");

    if (isApprove) {
      await approveLeaveRequest(`/lecturer/student/leavereq/approve/${id}`, formData, "PUT");
      ShowToast({ color: "success", description: t("updatedSuccess") });
    } else {
      await rejectLeaveRequest(`/lecturer/student/leavereq/reject/${id}`, formData, "PUT");
      ShowToast({ color: "success", description: t("createdSuccess") });
    }

    await loadList?.();
    setFormData(initialFormData);
    return true;
   
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDraggable isDismissable={false}>
      <ModalContent>
        {() => (
          <>
            {(approveLeaveRequestLoading || rejectLeaveRequestLoading) && (
              <div className="flex items-center justify-center min-h-36 inset-0 absolute bg-white/20 dark:bg-black/20 backdrop-blur-sm z-50">
                <Spinner
                  variant="spinner"
                  size="sm"
                  label={isApprove ? t("approving") : t("rejecting")}
                />
              </div>
            )}

            <ModalHeader>
              {t(isApprove ? "approveLeaveRequest" : "rejectLeaveRequest")}
            </ModalHeader>

            <ModalBody>
              <form>
                <Textarea
                  name="adminNote"
                  label={t("reason")}
                  placeholder={t("enterReason")}
                  value={formData.adminNote}
                  onChange={handleInputChange}
                />
              </form>
            </ModalBody>

            <ModalFooter>
              <Button
                onPress={onClose}
                variant="flat"
                color="danger"
                size="sm"
              >
                {t("cancel")}
              </Button>
              <Button
                onPress={onSubmit}
                variant="solid"
                color={isApprove ? "primary" : "danger"}
                startContent={isApprove ? <TbRosetteDiscountCheck size={16} /> : <IoIosCloseCircleOutline size={16} />}
                size="sm"
              >
                {isApprove ? t("approve") : t("reject")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default memo(Form);
