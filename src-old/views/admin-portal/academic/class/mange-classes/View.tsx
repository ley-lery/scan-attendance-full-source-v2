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
    program_type: string;
    class_name: string;
    room_name: string;
    faculty_code: string;
    faculty_name_en: string;
    faculty_name_kh: string;
    field_code: string;
    field_name_en: string;
    field_name_kh: string;
    promotion_no: number;
    term_no: number;
    status: string;
    deleted_date: string | null;
  }>;
}

const View = ({ isOpen = false, onClose, row }: ViewProps) => {
  const { t } = useTranslation();

  const fields: { label: string; value: any; isStatus?: boolean; isDate?: boolean }[] = [
    { label: t("id"), value: row?.id },
    { label: t("programType"), value: row?.program_type },
    { label: t("className"), value: row?.class_name },
    { label: t("roomName"), value: row?.room_name },
    { label: t("facultyCode"), value: row?.faculty_code },
    { label: t("facultyNameEn"), value: row?.faculty_name_en },
    { label: t("facultyNameKh"), value: row?.faculty_name_kh },
    { label: t("fieldCode"), value: row?.field_code },
    { label: t("fieldNameEn"), value: row?.field_name_en },
    { label: t("fieldNameKh"), value: row?.field_name_kh },
    { label: t("promotionNo"), value: row?.promotion_no },
    { label: t("termNo"), value: row?.term_no },
    { label: t("status"), value: row?.status, isStatus: true },
    { label: t("deletedData"), value: row?.deleted_date, isDate: true },
  ];

  return (
    <ModalView isOpen={isOpen} onClose={onClose} title={t("viewDetail")} size="xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">

          {/* Labels */}
          <div className="space-y-2 text-base font-medium text-zinc-700 dark:text-zinc-400">
            {fields.map((field) => (
              <p key={field.label}>{field.label}</p>
            ))}
          </div>

          {/* Values */}
          <div className="space-y-2 text-base font-normal text-zinc-500 dark:text-zinc-400">
            {fields.map((field) => {
              if (field.isStatus) {
                return (
                  <p key={field.label} className={cn(field.value === "Active" ? "text-success" : "text-danger")}>
                    : {field.value}
                  </p>
                );
              }
              if (field.isDate) {
                return <p key={field.label}>: {field.value ?? t("notDeleted")}</p>;
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
