import { useTranslation } from "react-i18next";
import { AutocompleteUI, DatePicker } from "@/components/hero-ui";
import { Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { DrawerFilter } from "@/components/ui";
import { useEffect, useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";

interface FilterData {  
  classId: number | null,
  course: number | null,
  startDate: DateValue | null,
  endDate: DateValue | null
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
    courses: [],
  });

  // ==== Fetch Data with useFetch ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ classes: any[]; courses: any[] }>(
    "/lecturer/report/myclassatt/formload"
  );

  // ==== Get list from form load ==== 
  useEffect(() => {
    console.log(formLoad);
    if (formLoad) {
      setList({
        classes: formLoad.data.classes,
        courses: formLoad.data.courses,
      });
    }
  }, [formLoad]);

  // ==== Event Handler ==== 

  const handleDateChange = (field: keyof FilterData, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (key: string, field: keyof FilterData) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
     setFilter((prev) => {
        const updated = { ...prev, [field]: key };
  
        if (field === "classId") {
          updated.course = null;
        }
        return updated;
      });
  };
  
  // === FILTER CASCADE LOGIC ===
  const filteredCourses = useMemo(() => list.courses?.filter((f: any) => f.class_id === Number(filter.classId)),
    [list.courses, filter.classId]
  );


  // if (!isOpen) return null;

  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading || formLoadLoading} loadingType="regular" backdrop={filterLoading || formLoadLoading ? "regular" : "transparent"}>
      <form className="space-y-4">
        {/* Date & Time */}
        {/* <div>
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
            />
            <DatePicker
              label={t("endDate")}
              value={filter.endDate}
              onChange={(val) => handleDateChange("endDate", val)}
              minValue={filter.startDate}
              showMonthAndYearPickers
              labelPlacement="outside"
            />
          </div>
        </div> */}
        {/* General */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("general")}
          </h3>
          <Divider className="mb-4" />
          <div className="grid grid-cols-1 gap-2">
              <AutocompleteUI
                name="classId"
                label={t("class")}
                placeholder={t("chooseClass")}
                options={list.classes}
                optionLabel="label_1"
                secondaryOptionLabel="label_2"
                optionValue="id"
                selectedKey={filter.classId}
                onSelectionChange={(key: any) => handleSelectChange(key, "classId")}
              />
              <AutocompleteUI
                name="course"
                label={t("course")}
                placeholder={t("chooseCourse")}
                options={filteredCourses}
                optionLabel="label_1"
                secondaryOptionLabel="label_2"
                optionValue="id"
                selectedKey={filter.course}
                onSelectionChange={(key: any) => handleSelectChange(key, "course")}
              />
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;