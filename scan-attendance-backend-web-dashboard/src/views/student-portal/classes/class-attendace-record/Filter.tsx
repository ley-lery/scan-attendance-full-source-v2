import { useTranslation } from "react-i18next";
import { AutocompleteUI, DatePicker } from "@/components/hero-ui";
import { DrawerFilter } from "@/components/ui";
import { type DateValue } from "@internationalized/date";
import { Divider } from "@heroui/react";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

interface FilterData {
  class: number | null;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "";
  date: DateValue | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  page: number;
  limit: number;
}

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
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
    classes: [],
    statuses: [],
  });

  // ==== Fetch Data with useFetch ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<any>(
    "/student/leavehistory/formload"
  );

  // ==== Get list from form load ====
  useEffect(() => {
    console.log(formLoad);
    if (formLoad) {
      setList({
        classes: formLoad.data.classes,
        statuses: formLoad.data.status,
      });
    }
  }, [formLoad]);

  // ==== Event Handlers ====
  const handleSelectChange = (key: any, field: keyof FilterData) => {
    setFilter((prev: any) => ({ ...prev, [field]: key }));
  };

  const handleDateChange = (field: keyof FilterData, value: DateValue | null) => {
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
              showMonthAndYearPickers
              size="md"
              radius="md"
              classNames={{
                selectorButton: "p-0",
              }}
            />
            <DatePicker
              label={t("endDate")}
              value={filter.endDate}
              onChange={(val) => handleDateChange("endDate", val)}
              minValue={filter.startDate}
              labelPlacement="outside"
              showMonthAndYearPickers
              size="md"
              radius="md"
              classNames={{
                selectorButton: "p-0",
              }}
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
              name="class"
              label={t("class")}
              placeholder={t("chooseClass")}
              options={list.classes}
              optionLabel="class_name"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.class}
              onSelectionChange={(key: any) => handleSelectChange(key, "class")}
            />
            <AutocompleteUI
              name="status"
              label={t("status")}
              placeholder={t("chooseStatus")}
              options={list.statuses}
              optionLabel="label"
              optionValue="value"
              selectedKey={filter.status}
              onSelectionChange={(key: any) => handleSelectChange(key, "status")}
            />
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;