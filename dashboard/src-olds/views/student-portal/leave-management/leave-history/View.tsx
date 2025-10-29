/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ModalView } from "@/components/hero-ui";
import { cn } from "@/lib/utils";

interface ViewProps {
  isOpen?: boolean;
  onClose: () => void;
  row: Partial<{
    id: number;
    student_id: number;
    request_date: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: string;
    approved_by_user_id: string;
    approved_by_username: string;
    approved_by_user_email: string;
    approved_by_lecturer_id: string;
    approved_by_lecturer_kh: string;
    approved_by_lecturer_en: string;
    approval_date: string;
    approval_time: string;
    admin_notes: string;
    deleted_date: string | null;
  }>;
}

const View = ({ isOpen = false, onClose, row }: ViewProps) => {
  const { t } = useTranslation();

  const fields: { label: string; value: any; isStatus?: boolean; isDate?: boolean; isUnassigned?: boolean }[] = [
    { label: t("id"), value: row?.id },
    { label: t("studentId"), value: row?.student_id },
    { label: t("requestDate"), value: row?.request_date },
    { label: t("startDate"), value: row?.start_date },
    { label: t("endDate"), value: row?.end_date },
    { label: t("totalDays"), value: row?.total_days },
    { label: t("reason"), value: row?.reason },
    { label: t("status"), value: row?.status, isStatus: true },
    { label: t("approvedByUsername"), value: row?.approved_by_username },
    { label: t("approvedByUserEmail"), value: row?.approved_by_user_email },
    { label: t("approvedByLecturerKh"), value: row?.approved_by_lecturer_kh, isUnassigned: true },
    { label: t("approvedByLecturerEn"), value: row?.approved_by_lecturer_en, isUnassigned: true },
    { label: t("approvalDate"), value: row?.approval_date },
    { label: t("approvalTime"), value: row?.approval_time },
    { label: t("adminNotes"), value: row?.admin_notes },
    { label: t("deletedDate"), value: row?.deleted_date, isDate: true },
  ];

  return (
    <ModalView isOpen={isOpen} onClose={onClose} title={t("viewDetail")} size="xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          
          {/* Labels */}
          <div className="space-y-2 text-base font-medium text-zinc-700 dark:text-zinc-300">
            {fields.map((field) => (
              <p key={field.label}>{field.label}</p>
            ))}
          </div>

          {/* Values */}
          <div className="space-y-2 text-base font-normal text-zinc-500 dark:text-zinc-400">
            {fields.map((field) => {
              if (field.isStatus) {
                const statusColors: Record<string, string> = {
                  Approved: "text-success",
                  Pending: "text-warning",
                  Rejected: "text-danger",
                  Active: "text-success",
                };
                const colorClass = statusColors[field.value as string] || "text-zinc-500";
                return (
                  <p key={field.label} className={cn(colorClass)}>
                    : {field.value ?? "-"}
                  </p>
                );
              }
              if (field.isDate) {
                return (
                  <p key={field.label} className="text-success">
                    : {field.value && field.value !== "Unassigned" ? field.value : t("available")}
                  </p>
                );
              }
              if (field.isUnassigned) {
                return (
                  <p key={field.label} className={cn(field.value === "Unassigned" && "text-zinc-400 italic")}>
                    : {field.value === "Unassigned" ? t("unassigned") : field.value ?? "-"}
                  </p>
                );
              }
              return <p key={field.label}>: {field.value ?? "-"}</p>;
            })}
          </div>
        </div>
      </div>
    </ModalView>
  );
};

export default memo(View);