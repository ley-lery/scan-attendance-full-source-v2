/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalViewUI from "@/components/hero-ui/modal/ModalView";
import { memo } from "react";
import { useTranslation } from "react-i18next";

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
          <p>{t('id')}</p>
          <p>{t('code')}</p>
          <p>{t('nameEn')}</p>
          <p>{t('nameKh')}</p>
          <p>{t('status')}</p>
        </div>
        <div className="space-y-2 *:text-base *:font-normal *:text-zinc-500 dark:*:text-zinc-400">
          <p>: {row?.id}</p>
          <p>: {row?.code}</p>
          <p>: {row?.name_en}</p>
          <p>: {row?.name_kh}</p>
          <p>: {row?.status}</p>
        </div>
      </div>
    </div>
  );

  return (
    <ModalViewUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={t("viewDetail")}
      size="xl"
    >
      {renderStudent()}
    </ModalViewUI>
  );
};

export default memo(View);
