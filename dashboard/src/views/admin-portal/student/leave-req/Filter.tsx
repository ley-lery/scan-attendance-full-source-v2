import { useTranslation } from "react-i18next";
import { AutocompleteUI, DatePicker } from "@/components/hero-ui";
import { Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { DrawerFilter } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

type Filter = {
  faculty: string | null;
  field: string | null;
  classId: string | null;
  student: string | null;
  status: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  search: string | null;
  page: number;
  limit: number;
};

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
    users: [],
    faculties: [],
    fields: [],
    classes: [],
    students: [],
    statuses: [],
  });

  // ==== Form Load ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ users: any[] }>(
    "/student/leavereq/formload"
  );

  // ==== Get list from form load ====
  useEffect(() => {
    console.log(formLoad);
    if (formLoad) {
      setList({
        users: formLoad.data.users,
        faculties: formLoad.data.faculties,
        fields: formLoad.data.fields,
        classes: formLoad.data.classes,
        students: formLoad.data.students,
        statuses: formLoad.data.status,
      });
    }
  }, [formLoad]);

  // ==== Event Handler ====
  const handleSelectChange = (key: string, field: keyof Filter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };

  const handleDateChange = (field: keyof Filter, value: DateValue | null) => {
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
              name="faculty"
              label={t("faculty")}
              placeholder={t("chooseFaculty")}
              options={list.faculties}
              optionLabel="name_en"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.faculty}
              onSelectionChange={(key: any) => handleSelectChange(key, "faculty")}
            />

            <AutocompleteUI
              name="field"
              label={t("field")}
              placeholder={t("chooseField")}
              options={list.fields}
              optionLabel="field_name_en"
              secondaryOptionLabel="field_name_kh"
              optionValue="id"
              selectedKey={filter.field}
              onSelectionChange={(key: any) => handleSelectChange(key, "field")}
            />
            <AutocompleteUI
              name="classId"
              label={t("class")}
              placeholder={t("chooseClass")}
              options={list.classes}
              optionLabel="class_name"
              optionValue="id"
              selectedKey={filter.classId}
              onSelectionChange={(key: any) => handleSelectChange(key, "classId")}
            />

            <AutocompleteUI
              name="student"
              label={t("student")}
              placeholder={t("chooseStudent")}
              options={list.students}
              optionLabel="name_en"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.student}
              onSelectionChange={(key: any) => handleSelectChange(key, "student")}
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