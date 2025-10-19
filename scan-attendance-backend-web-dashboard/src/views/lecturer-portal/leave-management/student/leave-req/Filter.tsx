import { useTranslation } from "react-i18next";
import { AutocompleteUI, DatePicker } from "@/components/hero-ui";
import { Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { useFetch } from "@/hooks/useFetch";
import { DrawerFilter } from "@/components/ui";
import { useEffect, useState } from "react";

type StudentLeaveFilter = {
  course: string | null;
  status: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  page: number;
  limit: number;
};


interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: StudentLeaveFilter;
  setFilter: React.Dispatch<React.SetStateAction<StudentLeaveFilter>>;
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
    courses: [],
    status: [],
  });

   // ==== Form Load ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ users: any[] }>(
    "/lecturer/student/leavereq/formload"
  );
  
  useEffect(() => {
    console.log(formLoad);
    if (formLoad) {
      setList({
        courses: formLoad.data.courses,
        status: formLoad.data.status,
      });
    }
  }, [formLoad]);

  // ==== Event Handler ==== 
  const handleSelectChange = (key: string, field: keyof StudentLeaveFilter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };

  const handleDateChange = (field: keyof StudentLeaveFilter, value: DateValue | null) => {
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

        {/* General Filters */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("general")}
          </h3>
          <Divider className="mb-4" />
          <div className="grid grid-cols-1 gap-2">
            
            <AutocompleteUI
              name="course"
              label={t("course")}
              placeholder={t("chooseCourse")}
              options={list.courses}
              optionLabel="course_name_en"
              secondaryOptionLabel="course_name_kh"
              optionValue="id"
              selectedKey={filter.course}
              onSelectionChange={(key: any) => handleSelectChange(key, "course")}
            />
            <AutocompleteUI
              name="status"
              label={t("status")}
              placeholder={t("chooseStatus")}
              options={list.status}
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