import { memo, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { ModalRequest, ShowToast } from "@/components/hero-ui";
import { useMutation } from "@/hooks/useMutation";
import { Textarea } from "@heroui/react";

interface FormProps {
  isOpen?: boolean;
  onClose: () => void;
  loadList?: () => Promise<void>;
  isApprove?: boolean;
  leaveId?: number | null;
}

interface FormData {
  adminNote: string;
}

const initialFormData: FormData = { adminNote: "" };

const Form = memo(({ isOpen = false, onClose, loadList, isApprove, leaveId }: FormProps) => {

  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const id = leaveId ?? null;

  // ========== Approve Mutation ========== 
  const { mutate: approveLeaveRequest, loading: approveLoading } = useMutation({
    onSuccess: async (res) => {
      await loadList?.();
      onClose();
      setTimeout(() => {
        ShowToast({
          color: "success",
          title: t("success"),
          description:
            res.response?.data?.message || t("leaveRequestApprovedSuccessfully"),
        });
      }, 500);
    },
    onError: (err) => {
      console.error("Approve error:", err);
      setTimeout(() => {
        ShowToast({
          color: "error",
          title: t("error"),
          description:
            err.response?.data?.message || t("failedToApproveLeaveRequest"),
        });
      }, 500);
    },
  });

  // ========== Reject Mutation ========== 
  const { mutate: rejectLeaveRequest, loading: rejectLoading } = useMutation({
    onSuccess: async (res) => {
      await loadList?.();
      onClose();
      setTimeout(() => {
        ShowToast({
          color: "success",
          title: t("success"),
          description:
            res.response?.data?.message || t("leaveRequestRejectedSuccessfully"),
        });
      }, 500);
    },
    onError: (err) => {
      console.error("Reject error:", err);
      setTimeout(() => {
        ShowToast({
          color: "error",
          title: t("error"),
          description:
            err.response?.data?.message || t("failedToRejectLeaveRequest"),
        });
      }, 500);
    },
  });

  // ========== Handle Change ========== 
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ========== Handle Submit ========== 
  const onSubmit = async (): Promise<void> => {
    
    if (isApprove) {
      await approveLeaveRequest(`/student/leavereq/approve/${id}`, formData, "PUT");
    } else {
      await rejectLeaveRequest(`/student/leavereq/reject/${id}`, formData, "PUT");
    }

    setFormData(initialFormData);
  };

  if (!isOpen) return null;

  return (
    <ModalRequest
      title={t(isApprove ? "approveLeaveRequest" : "rejectLeaveRequest")}
      isOpen={isOpen}
      onClose={onClose}
      onApprove={isApprove ? onSubmit : undefined}
      onReject={!isApprove ? onSubmit : undefined}
      isLoading={approveLoading || rejectLoading}
      isDisabled={approveLoading || rejectLoading}
      size="lg"
    >
      <Textarea
        name="adminNote"
        label={t("reason")}
        labelPlacement="outside"
        placeholder={t("enterReason")}
        value={formData.adminNote}
        onChange={handleInputChange}
        minRows={4}
        isDisabled={approveLoading || rejectLoading}
      />
    </ModalRequest>
  );
});

export default Form;
