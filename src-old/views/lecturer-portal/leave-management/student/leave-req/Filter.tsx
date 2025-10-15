import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem, DatePicker } from "@/components/hero-ui";
import { Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { DrawerFilter } from "@/components/ui";
import { cn } from "@/lib/utils";

type Filter = {
  startDate: DateValue | null;
  endDate: DateValue | null;
  course: string | null;
  status: string | null;
};

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
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

  const handleDateChange = (field: keyof Filter, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "danger";
      case "Cancelled":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading} loadingType="regular" >
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
              showMonthAndYearPickers
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
              showMonthAndYearPickers
              labelPlacement="outside"
              size="sm"
              classNames={{
                selectorIcon: "text-sm",
                selectorButton: "p-0",
              }}
            />
          </div>
        </div>

        {/* General Filters */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("general")}
          </h3>
          <Divider className="mb-4" />
          <div className="grid grid-cols-1 gap-2">
            <Autocomplete
              label={t("course")}
              placeholder={t("chooseCourse")}
              selectedKey={filter.course ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev) => ({
                  ...prev,
                  course: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
              isLoading={formLoadLoading}
            >
              {formLoad?.data?.courses?.map(
                (u: { id: string; course_name_en: string; course_name_kh: string }) => (
                  <AutocompleteItem key={u.id}>
                    {u.course_name_en + " - " + u.course_name_kh}
                  </AutocompleteItem>
                )
              ) || []}
            </Autocomplete>
            <Autocomplete
              label={t("status")}
              placeholder={t("chooseStatus")}
              selectedKey={filter.status ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev) => ({
                  ...prev,
                  status: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
              isLoading={formLoadLoading}
            >
              {formLoad?.data?.status?.map(
                (u: { value: string; label: string }) => (
                 <AutocompleteItem key={u.value} textValue={u.label}>
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full flex", `bg-${statusColor(u.label)}`)}/>
                      <span className="text-xs font-medium">{u.label}</span>
                    </div>
                  </AutocompleteItem>
                )
              ) || []}
            </Autocomplete>
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;