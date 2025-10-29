/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { ModalView } from "@/components/hero-ui";

interface ViewProps {
  isOpen?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  row: any;
}

const View = ({ isOpen = false, onOpenChange, row }: ViewProps) => {
  const { t } = useTranslation();

  const renderStudent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 *:text-base *:font-medium *:text-zinc-700 dark:*:text-zinc-300">
          <p>{t("id")}</p>
          <p>{t("lecturerCode")}</p>
          <p>{t("lecturerNameEn")}</p>
          <p>{t("lecturerNameKh")}</p>
          <p>{t("courseCode")}</p>
          <p>{t("courseNameEn")}</p>
          <p>{t("courseNameKh")}</p>
          <p>{t("deleltedDate")}</p>
        </div>
        <div className="space-y-2 *:text-base *:font-normal *:text-zinc-500 dark:*:text-zinc-400">
          <p>: {row?.id}</p>
          <p>: {row?.lecturer_code}</p>
          <p>: {row?.lecturer_name_en}</p>
          <p>: {row?.lecturer_name_kh}</p>
          <p>: {row?.course_code}</p>
          <p>: {row?.course_name_en}</p>
          <p>: {row?.course_name_kh}</p>
          <p>: {row?.deleted_date}</p>
        </div>
      </div>
    </div>
  );

  return (
    <ModalView
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={t("viewDetail")}
      size="xl"
    >
      {renderStudent()}
    </ModalView>
  );
};

export default memo(View);
