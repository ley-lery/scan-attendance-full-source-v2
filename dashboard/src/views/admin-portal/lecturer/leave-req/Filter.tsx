import { useTranslation } from "react-i18next";
import { AutocompleteUI, DatePicker } from "@/components/hero-ui";
import { Checkbox, Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { DrawerFilter } from "@/components/ui";
import { useEffect, useState } from "react";

interface Filter {
  lecturer?: number | null; // lecturer_id
  status?: string | null; 
  startDate?: DateValue | null;
  endDate?: DateValue | null; 
  requestDate?: DateValue | null; 
  approvedByUser?: number | null; // approved_by_user_id
  deleted?: boolean | number | null ;
  search?: string | null;
  page?: number;
  limit?: number;
}

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
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
    lecturers: [],
    users: [],
    statuses: [],
  });

   // ==== Form Load ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ users: any[] }>(
    "/admin/lecturer/leavereq/formload"
  );
  
  useEffect(() => {
    console.log(formLoad);
    if (formLoad) {
      setList({
        lecturers: formLoad.data.lecturers,
        users: formLoad.data.users,
        statuses: formLoad.data.status,
      });
    }
  }, [formLoad]);



  // ==== Event Handler ==== 
  const handleSelectChange = (key: string, field: keyof Filter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };

  const handleCheckboxChange = (field: keyof Filter, value: boolean) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: keyof Filter, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };


  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading || formLoadLoading} loadingType="regular" hideIconLoading={false} isAutoFilter={true}>
      <form className="space-y-4">
        {/* Date & Time */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("date")}
          </h3>
          <Divider className="mb-2" />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t("date")}
              value={filter.requestDate}
              onChange={(val) => handleDateChange("requestDate", val)}
              labelPlacement="outside"
              className="col-span-2"
              
            />
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

        {/* General Filters */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("general")}
          </h3>
          <Divider className="mb-4" />
          <div className="grid grid-cols-1 gap-2">
            <AutocompleteUI
              name="lecturer"
              label={t("lecturer")}
              placeholder={t("chooseLecturer")}
              options={list.lecturers}
              optionLabel="name_en"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.lecturer}
              onSelectionChange={(key: any) => handleSelectChange(key, "lecturer")}
            />
            <AutocompleteUI
              name="user"
              label={t("approvedByUser")}
              placeholder={t("chooseUser")}
              options={list.users}
              optionLabel="label"
              optionValue="id"
              selectedKey={filter.approvedByUser}
              onSelectionChange={(key: any) => handleSelectChange(key, "approvedByUser")}
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
            <Checkbox
              isSelected={filter.deleted as boolean}
              onValueChange={(val: any) => handleCheckboxChange("deleted", val)}
            >
              {t("deleted")}
            </Checkbox>
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;