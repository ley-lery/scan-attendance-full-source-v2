import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI, Button } from "@/components/hero-ui";
import { Radio, RadioGroup } from "@heroui/react";
import { useFetch } from "@/hooks/useFetch";
import { FilterPopover } from "@/components/ui";

// === Types ===

type FormLoad = {
  faculties: any[];
  fields: any[];
  classes: any[];
  students: any[];
  promotions: any[];
  terms: any[];
  programTypes: any[];
};

type DataFilter = {
  faculty: number | null,
  field: number | null,
  classId: number | null,
  student: number | null,
  status: 'All' | 'Active' | 'Inactive' | 'Complete' | null,
  promotionNo: number | null,
  termNo: number | null,
  programType: string | null,
  searchKeyword: string | null,
  page: number,
  limit: number
};

interface FilterProps {
  filter: DataFilter;
  setFilter: React.Dispatch<React.SetStateAction<DataFilter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
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
  
  const [list, setList] = useState<FormLoad>({
    faculties: [],
    fields: [],
    classes: [],
    students: [],
    promotions: [],
    terms: [],
    programTypes: [],
  });

  // ==== Load form data ====
  const { data: formLoad } = useFetch<FormLoad>("/studentclass/formload");

  useEffect(() => {
    if (formLoad) {
      setList({
        faculties: formLoad?.data?.faculties,
        fields: formLoad?.data?.fields,
        classes: formLoad?.data?.classes,
        students: formLoad?.data?.students,
        promotions: formLoad?.data?.promotions,
        terms: formLoad?.data?.terms,
        programTypes: formLoad?.data?.programTypes,
      });
    }
  }, [formLoad]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

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

  // === Filter cascade logic ===
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

  const radioColor = (color: string) => 
    color === "Active"
        ? "success"
        : color === "Complete"
        ? "secondary"
        : color === "All"
        ? "primary"
        : "danger"
              

  return (
    <form className="flex items-center gap-1">
      <>
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
            triggerText={t("promotionNo")}
            field="promotionNo"
            onApplyFilter={handleApplyFilter}
            handleClearFilter={(key: any) => handleClearFilter(key, "promotionNo")}
            filterLoading={filterLoading}
            isActive={!!appliedFilter.promotionNo}
            header={t("promotionNo")}
        >
            <AutocompleteUI
            name="promotionNo"
            placeholder={t("choosePromotionNo")}
            options={list.promotions}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.promotionNo}
            onSelectionChange={(key: any) => handleSelectChange(key, "promotionNo")}
            />
        </FilterPopover>
        <FilterPopover
            triggerText={t("termNo")}
            field="termNo"
            onApplyFilter={handleApplyFilter}
            handleClearFilter={(key: any) => handleClearFilter(key, "termNo")}
            filterLoading={filterLoading}
            isActive={!!appliedFilter.termNo}
            header={t("termNo")}
        >
            <AutocompleteUI
            name="termNo"
            placeholder={t("chooseTermNo")}
            options={list.terms}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.termNo}
            onSelectionChange={(key: any) => handleSelectChange(key, "termNo")}
            />
        </FilterPopover>
        <FilterPopover
            triggerText={t("program")}
            field="programType"
            onApplyFilter={handleApplyFilter}
            handleClearFilter={(key: any) => handleClearFilter(key, "programType")}
            filterLoading={filterLoading}
            isActive={!!appliedFilter.programType}
            header={t("program")}
        >
            <AutocompleteUI
            name="program"
            placeholder={t("chooseProgramType")}
            options={list.programTypes}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.programType}
            onSelectionChange={(key: any) => handleSelectChange(key, "programType")}
            />
        </FilterPopover>
        <FilterPopover
            triggerText={t("status")}
            field="status"
            onApplyFilter={handleApplyFilter}
            handleClearFilter={(key: any) => handleClearFilter(key, "status")}
            filterLoading={filterLoading}
            isActive={appliedFilter.status !== null && appliedFilter.status !== "All"}
            header={t("status")}
        >
            <RadioGroup
            name="status"
            value={filter.status}
            onChange={handleRadioChange}
            orientation="vertical"
            size="md"
            >
                <div className="grid grid-cols-1 gap-1 pl-4">
                    {["All", "Active", "Complete", "Inactive"].map((status) => (
                        <Radio key={status} value={status} color={radioColor(status)} >
                            {status}
                        </Radio>
                    ))}
                </div>
            </RadioGroup>
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