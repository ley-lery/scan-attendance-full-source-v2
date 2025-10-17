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
    lecturer_code: string;
    lecturer_name_en: string;
    lecturer_name_kh: string;
    course_code: string;
    course_name_en: string;
    course_name_kh: string;
    status: string;
    deleted_date: string | null;
  }>;
}

const View = ({ isOpen = false, onClose, row }: ViewProps) => {
  
  if (!isOpen) return null;

  const { t } = useTranslation();

  const fields: { label: string; value: any; isStatus?: boolean; isDate?: boolean }[] = [
    { label: t("id"), value: row?.id },
    { label: t("lecturerCode"), value: row?.lecturer_code },
    { label: t("lecturerNameEn"), value: row?.lecturer_name_en },
    { label: t("lecturerNameKh"), value: row?.lecturer_name_kh },
    { label: t("courseCode"), value: row?.course_code },
    { label: t("courseNameEn"), value: row?.course_name_en },
    { label: t("courseNameKh"), value: row?.course_name_kh },
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
                return (
                  <p key={field.label} className={cn(field.value === "Active" ? "text-success" : "text-danger")}>
                    : {field.value ?? "-"}
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
