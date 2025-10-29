import { useTranslation } from "react-i18next";
import { AutocompleteUI, DatePicker } from "@/components/hero-ui";
import { Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { DrawerFilter } from "@/components/ui";

type AuditLog = {
  action: string;
  tableName: string;
  user: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  startTime: string | null;
  endTime: string | null;
  clientIp: string;
};

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: AuditLog;
  setFilter: React.Dispatch<React.SetStateAction<AuditLog>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
}: FilterProps) => {

  const { t } = useTranslation();
  const [list, setList] = useState<any>({
    users: [],
    tableList: [],
    actionList: [],
  });


  // ==== Form Load ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ users: any[] }>(
    "/auditlog/formload"
  );

  useEffect(() => {
    if (formLoad) {
      setList({
        users: formLoad.data.users,
        tableList: formLoad.data.tableList,
        actionList: formLoad.data.actionList,
      });
    }
  }, [formLoad]);

  // ==== Event Handler ====
  const handleSelectChange = (key: string, field: keyof AuditLog) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };

  const handleDateChange = (field: keyof AuditLog, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  // if (!isOpen) return null;

  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading || formLoadLoading} loadingType="regular" hideIconLoading={false} isAutoFilter={true}>
      <form className="space-y-4">
        {/* Date & Time */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("dateTimeRange")}
          </h3>
          <Divider className="mb-2" />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t("startDate")}
              value={filter.startDate}
              onChange={(val) => handleDateChange("startDate", val)}
              maxValue={filter.endDate}
              labelPlacement="outside"
            />
            <DatePicker
              label={t("endDate")}
              value={filter.endDate}
              onChange={(val) => handleDateChange("endDate", val)}
              minValue={filter.startDate}
              labelPlacement="outside"
            />
          </div>
        </div>
        {/* General */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("general")}
          </h3>
          <Divider className="mb-4" />
          <div className="grid grid-cols-1 gap-2">
            <AutocompleteUI
              name="tableName"
              label={t("table")}
              placeholder={t("chooseTable")}
              options={list.tableList}
              optionLabel="name_en"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.tableName}
              onSelectionChange={(key: any) => handleSelectChange(key, "tableName")}
            />

            <AutocompleteUI
              name="action"
              label={t("action")}
              placeholder={t("chooseAction")}
              options={list.actionList}
              optionLabel="name_en"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.action}
              onSelectionChange={(key: any) => handleSelectChange(key, "action")}
            />

            <AutocompleteUI
              name="user"
              label={t("user")}
              placeholder={t("chooseUser")}
              options={list.users}
              optionLabel="name_en"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.user}
              onSelectionChange={(key: any) => handleSelectChange(key, "user")}
            />

          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;