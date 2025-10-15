import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem, DatePicker } from "@/components/hero-ui";
import { Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { DrawerFilter } from "@/components/ui";

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
  formLoad: any;
  formLoadLoading: boolean;
  filterLoading: boolean;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  formLoad,
  formLoadLoading,
  filterLoading,
}: FilterProps) => {
  const { t } = useTranslation();

  const handleDateChange = (field: keyof FilterData, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading} loadingType="regular" hideIconLoading={false} isAutoFilter={true}>
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
              size="sm"
              classNames={{
                selectorIcon: "text-sm",
                selectorButton: "p-0",
              }}
            />
            <DatePicker
              label={t("endDate")}
              value={filter.endDate}
              onChange={(val) => handleDateChange("endDate", val)}
              minValue={filter.startDate}
              labelPlacement="outside"
              size="sm"
              classNames={{
                selectorIcon: "text-sm",
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
            <Autocomplete
              label={t("class")}
              placeholder={t("chooseClass")}
              selectedKey={filter.class ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  class: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
              isLoading={formLoadLoading}
            >
              {formLoad?.data?.classes?.map((u: { id: string; class_name: string }) => (
                <AutocompleteItem key={u.id}>{u.class_name}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label={t("status")}
              placeholder={t("chooseStatus")}
              selectedKey={filter.status ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  status: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
              isLoading={formLoadLoading}
            >
              {formLoad?.data?.status?.map((u: { id: string; label: string }) => (
                <AutocompleteItem key={u.id}>{u.label}</AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;