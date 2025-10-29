import { useEffect,  useMemo,  useState } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI, Button, DatePicker, DateRangePickerUI } from "@/components/hero-ui";
import { useFetch } from "@/hooks/useFetch";
import { FilterPopover } from "@/components/ui";
import { getLocalTimeZone, parseDate, today, type DateValue } from "@internationalized/date";
import type { RangeValue } from "@heroui/react";

// === Types ===

type FormLoad = {
  users: any[];
  faculties: any[];
  fields: any[];
  classes: any[];
  students: any[];
  statuses: any[];
};


interface DataFilter {
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
}


interface FilterProps {
  filter: DataFilter;
  setFilter: React.Dispatch<React.SetStateAction<DataFilter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
}
const initialDateRange = {
    start: parseDate(today(getLocalTimeZone()).toString()),
    end: parseDate(today(getLocalTimeZone()).add({days: 1}).toString()), 
}

const FilterData = ({
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
}: FilterProps) => {
  const { t } = useTranslation();
  const [appliedFilter, setAppliedFilter] = useState<DataFilter>(filter);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>(initialDateRange);
  
  const [list, setList] = useState<any>({
    users: [],
    faculties: [],
    fields: [],
    classes: [],
    students: [],
    statuses: [],
  });


  // ==== Load form data ====
  const { data: formLoad } = useFetch<FormLoad>("/student/leavereq/formload");

  useEffect(() => {
    if (formLoad) {
      setList({
        users: formLoad?.data?.users,
        faculties: formLoad?.data?.faculties,
        fields: formLoad?.data?.fields,
        classes: formLoad?.data?.classes,
        students: formLoad?.data?.students,
        statuses: formLoad?.data?.status,
      });
    }
  }, [formLoad]);

  // ==== Event Handler ==== 
  const handleSelectChange = (key: any, field: keyof DataFilter) => {
    setFilter((prev) => {
      const updated = { ...prev, [field]: key };
      if (field === "faculty") {
        updated.field = null;
        updated.classId = null;
        updated.student = null;
      } else if (field === "field") {
        updated.classId = null;
        updated.student = null;
      } else if (field === "classId") {
        updated.student = null;
      }
      return updated;
    });
  };

  const filteredFields = useMemo(
    () => list.fields?.filter((f: any) => f.faculty_id === Number(filter.faculty)),
    [list.fields, filter.faculty]
  );

  const filteredClasses = useMemo(
    () => list.classes?.filter((c: any) => !filter.field || c.field_id === Number(filter.field)),
    [list.classes, filter.field]
  );

  const filteredStudents = useMemo(
    () => list.students?.filter((s: any) => s.class_id === Number(filter.classId)),
    [list.students, filter.classId]
  );

  const handleClearFilter = (key: any, field: keyof DataFilter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };
  
  const handleApplyFilter = () => {
    setAppliedFilter(filter);
    onApplyFilter();
  };

  const handleResetFilter = () => {
    setAppliedFilter(filter);
    onResetFilter();
  };

  const handleDateRangeChange = (value: RangeValue<DateValue>) => {
    setDateRange(value);
    setFilter((prev) => ({
      ...prev,
      startDate: value.start,
      endDate: value.end,
    }));
  };

  const handleDateChange = (field: keyof DataFilter, value: DateValue) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form className="flex items-center gap-1">
      <>
      
        <FilterPopover
          triggerText={t("dateRange")}
          field="dateRange"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => {
            handleClearFilter(key, "startDate");
            handleClearFilter(key, "endDate");
          }}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.startDate || !!appliedFilter.endDate}
          header={t("dateRange")}
          classNames={{
            content: "grid grid-cols-1 gap-1 p-2",
            popoverContent: "min-w-78",
          }}
        >
          {/* <DatePicker
            value={filter.startDate}
            onChange={(val: any) => handleDateChange("startDate", val)}
            labelPlacement="outside"
          />
          <DatePicker
            value={filter.endDate}
            onChange={(val: any) => handleDateChange("endDate", val)}
            labelPlacement="outside"
          /> */}
          <DateRangePickerUI
            value={dateRange}
            onChange={(value: RangeValue<DateValue> | null) => handleDateRangeChange(value as RangeValue<DateValue>)} 
          /> 

        </FilterPopover>
        <FilterPopover
          triggerText={t("faculty")}
          field="faculty"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => handleClearFilter(key, "faculty")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.faculty}
          header={t("faculty")}
        >
          <AutocompleteUI
            name="faculty"
            placeholder={t("chooseFaculty")}
            options={list.faculties}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={filter.faculty}
            onSelectionChange={(key: any) => handleSelectChange(key, "faculty")}
            />
        </FilterPopover>
        <FilterPopover
          triggerText={t("field")}
          field="field"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => handleClearFilter(key, "field")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.field}
          header={t("field")}
        >
          <AutocompleteUI
            name="field"
            placeholder={t("chooseField")}
            options={filteredFields}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={filter.field}
            onSelectionChange={(key: any) => handleSelectChange(key, "field")}
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("class")}
          field="classId"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => handleClearFilter(key, "classId")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.classId}
          header={t("class")}
        >
          <AutocompleteUI
            name="classId"
            placeholder={t("chooseClass")}
            options={filteredClasses}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={filter.classId}
            onSelectionChange={(key: any) => handleSelectChange(key, "classId")}
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("student")}
          field="student"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => handleClearFilter(key, "student")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.student}
          header={t("student")}
        >
          <AutocompleteUI
            name="student"
            placeholder={t("chooseStudent")}
            options={filteredStudents}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={filter.student}
            onSelectionChange={(key: any) => handleSelectChange(key, "student")}
          />
        </FilterPopover>
       
        <FilterPopover
            triggerText={t("status")}
            field="status"
            onApplyFilter={handleApplyFilter}
            handleClearFilter={(key: any) => handleClearFilter(key, "status")}
            filterLoading={filterLoading}
            isActive={!!appliedFilter.status}
            header={t("status")}
        >
            <AutocompleteUI
              name="status"
              placeholder={t("chooseStatus")}
              options={list.statuses}
              optionLabel="label"
              optionValue="value"
              selectedKey={filter.status}
              onSelectionChange={(key: any) => handleSelectChange(key, "status")}
            />
        </FilterPopover>
      </>

      {/* Action Buttons */}
      <div className="flex gap-1 ml-auto border-l border-black/10 dark:border-white/10 pl-2">
        <Button type="button" onClick={handleResetFilter} variant="flat" color="danger" radius="full" size="sm">
          {t("reset")}
        </Button>
      </div>
    </form>
  );
};

export default FilterData;