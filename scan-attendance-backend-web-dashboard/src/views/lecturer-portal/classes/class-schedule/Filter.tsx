import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI, DatePicker } from "@/components/hero-ui";
import { DrawerFilter } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { Divider } from "@heroui/react";
import type { DateValue } from "@internationalized/date";

// === Types ===

type FormLoad = {
  classes: any[];
  courses: any[];
  promotionNo: any[];
  termNo: any[];
  programType: any[];
  dayOfWeek: any[];
};

type FilterData = {
  classId: number | null;
  course: number | null;
  programType: string | null;
  promotionNo: number | null;
  termNo: number | null;
  dayOfWeek: string | null;
  status: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
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

  const [list, setList] = useState<FormLoad>({
    classes: [],
    courses: [],
    promotionNo: [],
    termNo: [],
    programType: [],
    dayOfWeek: [],
  });

  const { data: formLoad } = useFetch<FormLoad>("/lecturer/schedule/formload");

  useEffect(() => {
    console.log(formLoad, "formLoad");
    
    if (isOpen && formLoad) {
      setList({
        classes: formLoad.data.classes,
        courses: formLoad.data.courses,
        promotionNo: formLoad.data.promotionNo,
        termNo: formLoad.data.termNo,
        programType: formLoad.data.programType,
        dayOfWeek: formLoad.data.dayOfWeek,
      });
    }
  }, [formLoad, isOpen]);

  const handleDateChange = (field: keyof FilterData, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (key: any, field: keyof FilterData) => {

    // clear next-level selections when parent changes
    setFilter((prev) => {
      const updated = { ...prev, [field]: key };

      if (field === "classId") {
        updated.course = null;
      } 
      return updated;
    });
  };

  

  // === FILTER CASCADE LOGIC ===

  const filteredCourses = useMemo(() => list.courses?.filter((co) =>  co.class_id === Number(filter.classId)),
    [list.courses, filter.classId]
  );




  return (
    <DrawerFilter
      isOpen={isOpen}
      onClose={onClose}
      title="filter"
      onApplyFilter={onApplyFilter}
      onResetFilter={onResetFilter}
      filterLoading={filterLoading}
      isLoading={filterLoading}
      loadingType="regular"
      hideIconLoading={false}
      isAutoFilter={true}
      backdrop={filterLoading ? "regular" : "transparent"}
    >
      <form className="space-y-4">
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
        </div>
        {/* === Academic Info === */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t("academicInfo")}
            </h2>
            <Divider />
          </div>

          <AutocompleteUI
            name="class"
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
           <AutocompleteUI
            name="programType"
            label={t("programType")}
            placeholder={t("chooseProgramType")}
            options={list.programType}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.programType}
            onSelectionChange={(key: any) => handleSelectChange(key, "programType")}
          />

          <AutocompleteUI
            name="promotionNo"
            label={t("promotionNo")}
            placeholder={t("choosePromotion")}
            options={list.promotionNo}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.promotionNo}
            onSelectionChange={(key: any) => handleSelectChange(key, "promotionNo")}
          />

          <AutocompleteUI
            name="termNo"
            label={t("termNo")}
            placeholder={t("chooseTerm")}
            options={list.termNo}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.termNo}
            onSelectionChange={(key: any) => handleSelectChange(key, "termNo")}
          />
          <AutocompleteUI
            name="dayOfWeek"
            label={t("dayOfWeek")}
            placeholder={t("chooseDayOfWeek")}
            options={list.dayOfWeek}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.dayOfWeek}
            onSelectionChange={(key: any) => handleSelectChange(key, "dayOfWeek")}
          />

        </div>

       
      </form>
    </DrawerFilter>
  );
};

export default Filter;
