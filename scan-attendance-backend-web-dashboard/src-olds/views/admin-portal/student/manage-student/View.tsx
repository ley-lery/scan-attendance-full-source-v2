/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ModalView } from "@/components/hero-ui";
import { cn } from "@/lib/utils";

interface ViewProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  row: Partial<{
    id: number;
    code: string;
    name_en: string;
    name_kh: string;
    status: string;
    deleted_date: string | null;
  }>;
}

const View = ({ isOpen = false, onClose, row }: ViewProps) => {
  const { t } = useTranslation();

  const fields: { label: string; value: any; isStatus?: boolean; isDate?: boolean }[] = [
    { label: t("id"), value: row?.id },
    { label: t("facultyCode"), value: row?.code },
    { label: t("facultyNameEn"), value: row?.name_en },
    { label: t("facultyNameKh"), value: row?.name_kh },
    { label: t("status"), value: row?.status, isStatus: true },
    { label: t("deletedData"), value: row?.deleted_date, isDate: true },
  ];

  return (
    <ModalView isOpen={isOpen} onClose={() => onClose(false)} title={t("viewDetail")} size="xl">
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
