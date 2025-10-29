import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ModalView } from "@/components/hero-ui";
import { Chip, Divider } from "@heroui/react";
import { KhmerDate } from "@/helpers";

interface LecturerLeave {
  id: number;
  lecturer_id: number;
  lecturer_code: string;
  lecturer_name_kh: string;
  lecturer_name_en: string;
  lecturer_email: string;
  lecturer_phone?: string | null;
  request_date: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason_preview?: string;
  status: "Approved" | "Rejected" | "Pending" | "Cancelled";
  approved_by_username?: string | null;
  approval_date?: string | null;
}

interface ViewProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  row: Partial<LecturerLeave> | null;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-base text-zinc-500 dark:text-zinc-400 ">{title}</h2>
    <Divider className="mb-4" />
    {children}
  </div>
);

const View = memo(({ isOpen = false, onClose, row }: ViewProps) => {
  
  if (!isOpen) return null;

  const { t } = useTranslation();

  if (!row) return null;

  const getStatusColor = (status?: LecturerLeave["status"]) => {
    const colorMap: Record<LecturerLeave["status"], string> = {
      Approved: "success",
      Rejected: "danger",
      Pending: "warning",
      Cancelled: "default",
    };
    return status ? colorMap[status] : "default";
  };

  const InfoItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-left">{label} </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-right break-words">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <ModalView
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={t("leaveRequestDetails")}
      size="xl"
    >
      <div className="space-y-6 pr-4">
        {/* Lecturer Info */}
        <Section title={t("lecturerInformation")}>
          <div className="grid grid-cols-1 gap-4">
            <InfoItem label={t("lecturerId")} value={row.lecturer_id} />
            <InfoItem label={t("lecturerCode")} value={row.lecturer_code} />
            <InfoItem label={t("lecturerNameKh")} value={row.lecturer_name_kh} />
            <InfoItem label={t("lecturerNameEn")} value={row.lecturer_name_en} />
            <InfoItem label={t("lecturerEmail")} value={row.lecturer_email} />
            <InfoItem label={t("lecturerPhone")} value={row.lecturer_phone} />
          </div>
        </Section>

        {/* Leave Info */}
        <Section title={t("leaveRequestInformation")}>
          <div className="grid grid-cols-1 gap-4">
            <InfoItem label={t("requestDate")} value={row.request_date} />
            <InfoItem label={t("startDate")} value={row.start_date} />
            <InfoItem label={t("endDate")} value={row.end_date} />
            <InfoItem label={t("totalDays")} value={row.total_days} />
            <InfoItem label={t("reasonPreview")} value={row.reason_preview} />
            <InfoItem
              label={t("status")}
              value={
                <Chip size="sm" color={getStatusColor(row.status) as any} variant="light">
                  {t(row.status || "unknown")}
                </Chip>
              }
            />
          </div>
        </Section>

        {/* Approval Info */}
        <Section title={t("approvedInfo")}>
          <div className="grid grid-cols-1 gap-4">
            <InfoItem label={t("approvedByUser")} value={row.approved_by_username} />
            <InfoItem label={t("approvedDate")} value={row.approval_date} />
            <InfoItem label={t("fullDate")} value={<KhmerDate date={String(row.approval_date)} withDayName />} />
          </div>
        </Section>
      </div>
    </ModalView>
  );
});

export default View;


