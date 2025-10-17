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
  
  if (!isOpen) return null;

  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const id = leaveId ?? null;

  // ========== Approve Mutation ========== 
  const { mutate: approveLeaveRequest, loading: approveLoading } = useMutation({
    onSuccess: async (res) => {
      await loadList?.();
      onClose();
      ShowToast({
        color: "success",
        title: t("success"),
        description:
          res.response?.data?.message || t("leaveRequestApprovedSuccessfully"),
      });
    },
    onError: (err) => {
      console.error("Approve error:", err);
      ShowToast({
        color: "error",
        title: t("error"),
        description:
          err.response?.data?.message || t("failedToApproveLeaveRequest"),
      });
    },
  });

  // ========== Reject Mutation ========== 
  const { mutate: rejectLeaveRequest, loading: rejectLoading } = useMutation({
    onSuccess: async (res) => {
      await loadList?.();
      onClose();
      ShowToast({
        color: "success",
        title: t("success"),
        description:
          res.response?.data?.message || t("leaveRequestRejectedSuccessfully"),
      });
    },
    onError: (err) => {
      console.error("Reject error:", err);
      ShowToast({
        color: "error",
        title: t("error"),
        description:
          err.response?.data?.message || t("failedToRejectLeaveRequest"),
      });
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
      await approveLeaveRequest(`/admin/lecturer/leavereq/approve/${id}`, formData, "PUT");
    } else {
      await rejectLeaveRequest(`/admin/lecturer/leavereq/reject/${id}`, formData, "PUT");
    }

    setFormData(initialFormData);
  };


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
