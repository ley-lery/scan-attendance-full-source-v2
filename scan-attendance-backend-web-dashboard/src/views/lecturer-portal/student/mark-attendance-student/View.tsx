/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalView } from "@/components/hero-ui";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { cn } from "@/lib/utils";
import { GoDotFill } from "react-icons/go";

interface ViewProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  row: {
    student_code: string;
    student_name_en: string;
    student_name_kh: string;
    all_sessions: Record<string, any>;
    status: string;
  };
}

const View = ({ isOpen = false, onClose, row }: ViewProps) => {
  const { t } = useTranslation();

  const [sessionKeys, setSessionKeys] = useState<string[]>([]);

  useEffect(() => {
    if (row && row.all_sessions) {
      const keys = Object.keys(row.all_sessions).sort((a, b) => {
        const numA = parseInt(a.replace("session_", ""), 10);
        const numB = parseInt(b.replace("session_", ""), 10);
        return numA - numB;
      });
      setSessionKeys(keys);
    }
  }, [row]);

  const fields = [
    { label: t("studentCode"), value: row?.student_code },
    { label: t("studentNameEn"), value: row?.student_name_en },
    { label: t("studentNameKh"), value: row?.student_name_kh },
    { label: t("status"), value: row?.status },
  ];

  const statusIcon = (action: string | null) => {
    switch (action) {
      case "1":
        return { icon: <GoDotFill />, text: t("present"), class: "text-success bg-success/20" };
      case "P":
        return { icon: <GoDotFill />, text: t("permission"), class: "text-primary bg-primary/20" };
      case "A":
        return { icon: <GoDotFill />, text: t("absent"), class: "text-danger bg-danger/20" };
      case "L":
        return { icon: <GoDotFill />, text: t("late"), class: "text-warning bg-warning/20" };
      default:
        return { icon: <GoDotFill className="text-gray-400" />, text: t("notMarked"), class: "text-gray-500 bg-zinc-500/20" };
    }
  };

  const customizeCols = (data: any) => {
    const status = statusIcon(data);
    return (
      <span className={cn("px-3 py-1 rounded-full w-fit text-xs/tight font-medium inline-flex items-center gap-1 whitespace-nowrap", status.class)}>
        {status.icon} {status.text}
      </span>
    );
  };

  return (
    <ModalView isOpen={isOpen} onClose={() => onClose(false)} title={t("viewDetail")} size="full" animation="scale">
      <div className="space-y-10 p-4">
        <div className="grid grid-cols-4 gap-4">
          {fields.map((field, index) => (
            <div key={index} className="col-span-1">
              <p className="font-medium">{field.label}</p>
              <p className="text-zinc-400">{field.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <Table aria-label="Sessions Table" removeWrapper className="has-scrollbar pb-10" classNames={{thead: "bg-transparent", th: "bg-transparent border-b border-zinc-200 dark:border-zinc-700"}}>
            <TableHeader>
              {sessionKeys.map((key) => (
                <TableColumn key={key}><span className="capitalize">{t(key)}</span></TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                {sessionKeys.map((key) => (
                  <TableCell key={key}>{customizeCols(row.all_sessions[key])}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </ModalView>
  );
};

export default memo(View);
