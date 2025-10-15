/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { ModalView } from "@/components/hero-ui";
import { cn } from "@/lib/utils";
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { HiOutlineUser, HiOutlineMail, HiOutlineCalendar, HiOutlineClock, HiOutlineDesktopComputer, HiOutlineDocumentText, HiOutlineInformationCircle } from "react-icons/hi";

interface ViewProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  row: Partial<{
    id: number;
    table_name: string;
    record_id: string;
    action: string;
    old_data: Record<string, any>;
    new_data: Record<string, any>;
    changed_by_user_id: number;
    user_username: string;
    user_email: string;
    changed_date: string;
    changed_time: string;
    client_ip: string;
    session_info: string;
    description: string;
  }>;
}

const fieldIcons: Record<string, JSX.Element> = {
  "Changed By": <HiOutlineUser className="inline-block mr-1 text-blue-500" />,
  "Email": <HiOutlineMail className="inline-block mr-1 text-blue-500" />,
  "Date": <HiOutlineCalendar className="inline-block mr-1 text-blue-500" />,
  "Time": <HiOutlineClock className="inline-block mr-1 text-blue-500" />,
  "Client IP": <HiOutlineDesktopComputer className="inline-block mr-1 text-blue-500" />,
  "Session Info": <HiOutlineDocumentText className="inline-block mr-1 text-blue-500" />,
  "Description": <HiOutlineInformationCircle className="inline-block mr-1 text-blue-500" />,
};

const View = ({ isOpen = false, onClose, row }: ViewProps) => {
  const { t } = useTranslation();

  // Basic audit information fields
  const auditFields: { label: string; value: any; className?: string; icon?: JSX.Element }[] = [
    { label: t("auditId") || "Audit ID", value: row?.id },
    { label: t("tableName") || "Table Name", value: row?.table_name },
    { label: t("recordId") || "Record ID", value: row?.record_id },
    { 
      label: t("action") || "Action", 
      value: row?.action,
      className: cn(
        "font-semibold",
        row?.action === "CREATE" && "text-green-600 dark:text-green-400",
        row?.action === "UPDATE" && "text-blue-600 dark:text-blue-400",
        row?.action === "DELETE" && "text-red-600 dark:text-red-400"
      )
    },
    { label: t("changedBy") || "Changed By", value: row?.user_username, icon: fieldIcons["Changed By"] },
    { label: t("userEmail") || "Email", value: row?.user_email, icon: fieldIcons["Email"] },
    { label: t("changedDate") || "Date", value: row?.changed_date, icon: fieldIcons["Date"] },
    { label: t("changedTime") || "Time", value: row?.changed_time, icon: fieldIcons["Time"] },
    { label: t("clientIp") || "Client IP", value: row?.client_ip, icon: fieldIcons["Client IP"] },
    { label: t("sessionInfo") || "Session Info", value: row?.session_info, icon: fieldIcons["Session Info"] },
    { label: t("description") || "Description", value: row?.description, icon: fieldIcons["Description"] },
  ];

  // Get all unique keys from both old_data and new_data
  const getDataFields = () => {
    const oldKeys = Object.keys(row?.old_data || {});
    const newKeys = Object.keys(row?.new_data || {});
    const allKeys = [...new Set([...oldKeys, ...newKeys])];
    
    return allKeys.map(key => ({
      field: key,
      oldValue: row?.old_data?.[key],
      newValue: row?.new_data?.[key],
      isChanged: row?.old_data?.[key] !== row?.new_data?.[key],
      action: row?.action
    }));
  };

  const dataFields = getDataFields();

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // For status badge
  const statusBadge = (isChanged: boolean, action: string) => {
    if (isChanged) {
      if (action === "INSERT" || action === "CREATE") {
        return (
          <Chip size="sm" variant="flat" color="success">{t("created")}</Chip>
        );
      }
      if (action === "DELETE") {
        return (
          <Chip size="sm" variant="flat" color="danger">{t("deleted")}</Chip>
        );
      }
      return (
        <Chip size="sm" variant="flat" color="warning">{t("changed")}</Chip>
      );
    }
    return (
      <Chip size="sm" variant="flat" color="default">{t("unchanged")}</Chip>
    );
  };
   
  return (
    <ModalView isOpen={isOpen} onClose={() => onClose(false)} title={t("auditLogDetails") || "Audit Log Details"} size="4xl">
      <div className="space-y-8">
        {/* Audit Information Section */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 ">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <HiOutlineInformationCircle className="text-blue-500 text-2xl" />
            {t("auditInformation") || "Audit Information"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {auditFields.map((field) => (
              <div key={field.label} className="flex items-start gap-3">
                {field.icon && <div className="p- rounded-full"><span className="mt-1 text-xl">{field.icon}</span></div>}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {field.label}
                  </span>
                  <span className={cn(
                    "text-base text-gray-900 dark:text-gray-100 break-all",
                    field.className
                  )}>
                    {formatValue(field.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Change Table */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <HiOutlineDocumentText className="text-2xl text-blue-500" />
            {t("dataChanges") || "Data Changes"}
          </h4>
          <div className="overflow-x-auto">
            <Table aria-label="Audit data changes" removeWrapper>
              <TableHeader>
                <TableColumn className="w-1/4">{t('field')}</TableColumn>
                <TableColumn className="w-1/4">{t('oldValue')}</TableColumn>
                <TableColumn className="w-1/4">{t('newValue')}</TableColumn>
                <TableColumn className="w-1/6">{t('status')}</TableColumn>
              </TableHeader>
              <TableBody>
                {dataFields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-6">
                      {t("noDataChanges") || "No data changes to display."}
                    </TableCell>
                  </TableRow>
                ) : (
                  dataFields.map((item, index) => (
                    <TableRow
                      key={index}
                      className={cn(
                        item.isChanged && item.action !== "INSERT" && "bg-yellow-50 dark:bg-yellow-900/10"
                      )}
                    >
                      <TableCell className="font-mono text-xs text-blue-700 dark:text-blue-300">{item.field}</TableCell>
                      <TableCell className={cn(
                        "break-all",
                        item.isChanged && "line-through text-red-500 dark:text-red-400"
                      )}>
                        {item.oldValue === null || item.oldValue === undefined || item.oldValue === "" ? '-' : formatValue(item.oldValue)}
                      </TableCell>
                      <TableCell className={cn(
                        "break-all",
                        item.isChanged && "font-medium text-green-700 dark:text-green-400"
                      )}>
                        {item.newValue === null || item.newValue === undefined || item.newValue === "" ? '-' : formatValue(item.newValue)}
                      </TableCell>
                      <TableCell>
                        {statusBadge(item.isChanged, item.action as string)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ModalView>
  );
};

export default memo(View);