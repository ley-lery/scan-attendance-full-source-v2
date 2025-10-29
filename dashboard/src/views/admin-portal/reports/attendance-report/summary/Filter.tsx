import { useTranslation } from "react-i18next";
import { AutocompleteUI, } from "@/components/hero-ui";
import { Checkbox, Divider } from "@heroui/react";
// import { type DateValue } from "@internationalized/date";
import { DrawerFilter } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

const termList = [
  {
    value: "1",
    label: "Term 1",
  },
  {
    value: "2",
    label: "Term 2",
  },
]

type FilterData = {
  classId?: number | null,
  course?: number | null,
  student?: number | null,
  faculty?: number | null,
  field?: number | null,
  promotionNo?: number | null,
  termNo?: number | null,
  minAttendancePercentage?: number | null,
  maxAttendancePercentage?: number | null,
  showAtRiskOnly?: any,
  page?: number,
  limit?: number,
}


interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
  offAutoClose?: boolean;
  setOffAutoClose?: (value: boolean) => void;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
  offAutoClose = false,
  setOffAutoClose = () => {},
}: FilterProps) => {
  
  if (!isOpen) return null;

  const { t } = useTranslation();

  // ==== Fetch Data with useFetch ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<any>(
    "/reports/attendance-report/summary/formload"
  );

  const [list, setList] = useState<any>({
    courses: [],
    fields: [],
    faculties: [],
    classes: [],
    students: [],
  });

  useEffect(() => {
    console.log(formLoad);
    if (formLoad) {
      setList({
        courses: formLoad.data.courses,
        fields: formLoad.data.fields,
        faculties: formLoad.data.faculties,
        classes: formLoad.data.classes,
        students: formLoad.data.students,
      });
    }
  }, [formLoad]);

  const handleSelectChange = (key: string, field: keyof FilterData) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };

  // const handleDateChange = (field: keyof FilterData, value: DateValue | null) => {
  //   setFilter((prev: FilterData) => ({ ...prev, [field]: value }));
  // };

  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading || formLoadLoading} loadingType="regular" hideIconLoading={false} isAutoFilter={true} offAutoClose={offAutoClose} setOffAutoClose={setOffAutoClose} >
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
              labelPlacement="outside"
              showMonthAndYearPickers
            />
            <DatePicker
              label={t("endDate")}
              value={filter.endDate}
              onChange={(val) => handleDateChange("endDate", val)}
              minValue={filter.startDate}
              labelPlacement="outside"  
              showMonthAndYearPickers
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
              name="class"
              label={t("class")}
              placeholder={t("chooseClass")}
              options={list.classes}
              optionLabel="class_name"
              optionValue="id"
              selectedKey={filter.classId}
              onSelectionChange={(key: any) => handleSelectChange(key, "classId")}
            />
            <AutocompleteUI
              name="course"
              label={t("course")}
              placeholder={t("chooseCourse")}
              options={list.courses}
              optionLabel="name_en"
              secondaryOptionLabel="name_kh"
              optionValue="id"
              selectedKey={filter.course}
              onSelectionChange={(key: any) => handleSelectChange(key, "course")}
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
              name="term"
              label={t("term")}
              placeholder={t("chooseTerm")}
              options={termList}
              optionLabel="label"
              optionValue="value"
              selectedKey={filter.termNo}
              onSelectionChange={(key: any) => handleSelectChange(key, "termNo")}
            />
           
            {/* <InputNumber
              label={t("promotionNo")}
              placeholder={t("enterPromotionNo")}
              value={filter.promotionNo}
              onChange={(e) =>
                setFilter((prev: any) => ({
                  ...prev,
                  promotionNo: e.target.value,
                }))
              }
              labelPlacement="outside"
              size="sm"
            /> */}
            <Checkbox 
              isSelected={filter.showAtRiskOnly}
              onValueChange={() =>
                setFilter((prev: any) => ({
                  ...prev,
                  showAtRiskOnly: !filter.showAtRiskOnly,
                }))
              }
            >
              {t("showAtRiskOnly")}
            </Checkbox>
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;