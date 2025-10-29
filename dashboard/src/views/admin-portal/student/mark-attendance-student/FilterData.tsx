import { useEffect,  useMemo,  useState } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI, Button, SelectUI } from "@/components/hero-ui";
import { useFetch } from "@/hooks/useFetch";
import { FilterPopover } from "@/components/ui";

// === Types ===

type FormLoad = {
  faculyties: any[]; 
  fields: any[];
  classes: any[];
  courses: any[];
  students: any[];
  sessions: any[];
  promotionNo: any[];
  termNo: any[];
  programType: any[];
  gender: any[];
  studentStatus: any[];
  classStudentStatus: any[];
  transferred: any[];
};

type DataFilter = {
  faculty: number | null;
  field: number | null;
  classId: number | null;
  course: number | null;
  student: number | null;
  promotionNo: number | null;
  termNo: number | null;
  programType: string | null;
  gender: string | null;
  studentStatus: string | null;
  classStudentStatus: string | null, // new filter: active, inactive, complete
  transferred: number | null, // 0 = all, 1 = not transferred, 2 = transferred
  searchKeyword: string | null;
  sessionNo?: string | null;
  page: number;
  limit: number;
};


interface FilterProps {
  filter: DataFilter;
  setFilter: React.Dispatch<React.SetStateAction<DataFilter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  isBulkFilter?: boolean;
}

const FilterData = ({
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
  errors,
  setErrors,
  isBulkFilter = false,
}: FilterProps) => {
  const { t } = useTranslation();
  const [appliedFilter, setAppliedFilter] = useState<DataFilter>(filter);
  
  const [list, setList] = useState<any>({
    users: [],
    faculties: [],
    fields: [],
    classes: [],
    students: [],
    statuses: [],
  });


  // ==== Load form data ====
  const { data: formLoad } = useFetch<FormLoad>("/admin/markattstudent/formload");

  useEffect(() => {
    if (formLoad) {
      setList({
        faculyties: formLoad.data.faculyties,
        fields: formLoad.data.fields,
        classes: formLoad.data.classes,
        courses: formLoad.data.courses,
        students: formLoad.data.students,
        sessions: formLoad.data.sessions,
        promotionNo: formLoad.data.promotionNo,
        termNo: formLoad.data.termNo,
        programType: formLoad.data.programType,
        gender: formLoad.data.gender,
        studentStatus: formLoad.data.studentStatus,
        classStudentStatus: formLoad.data.classStudentStatus,
        transferred: formLoad.data.transferred,
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
        updated.course = null;
        updated.student = null;
      } else if (field === "field") {
        updated.classId = null;
        updated.course = null;
        updated.student = null;
      } else if (field === "classId") {
        updated.course = null;
        updated.student = null;
      } else if (field === "course") {
        updated.student = null;
      }
      return updated;
    });
    if(filter.sessionNo?.trim() !== ""){
      setErrors({});
    }
  };
  const filteredFields = useMemo(() => list.fields?.filter((f: any) => f.faculty_id === Number(filter.faculty) || !filter.faculty),
    [list.fields, filter.faculty]
  );

  const filteredClasses = useMemo(() => list.classes?.filter((c: any) => !filter.field || c.field_id === Number(filter.field)),
    [list.classes, filter.field]
  );

  const filteredCourses = useMemo(() => list.courses?.filter((co: any) =>  co.class_id === Number(filter.classId) ),
    [list.courses, filter.classId]
  );

  const filteredStudents = useMemo(() => list.students?.filter((s: any) => (s.class_id === Number(filter.classId) && s.course_id === Number(filter.course))),
    [list.students, filter.classId, filter.course]
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

  const handleClearAcademicFilter = () => {
    handleClearFilter(null, "faculty");
    handleClearFilter(null, "field");
    handleClearFilter(null, "classId");
    handleClearFilter(null, "course");
    handleClearFilter(null, "student");
  };

  const academicFilter = useMemo(() => {
    return !!appliedFilter.faculty || !!appliedFilter.field || !!appliedFilter.classId || !!appliedFilter.course || !!appliedFilter.student;
  }, [appliedFilter]);

  return (
    <form className="flex items-center gap-1">
      <>
        <FilterPopover
          triggerText={t("academic")}
          field=""
          onApplyFilter={handleApplyFilter}
          handleClearFilter={handleClearAcademicFilter}
          filterLoading={filterLoading}
          isActive={academicFilter}
          header={t("academic")}
          classNames={{ popoverContent: "min-w-72", content: 'p-2 space-y-1' }}
        >
          <AutocompleteUI
            name="faculty"
            label={t("faculty")}
            placeholder={t("chooseFaculty")}
            options={list.faculyties}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={filter.faculty}
            onSelectionChange={(key: any) => handleSelectChange(key, "faculty")}
          />

          <AutocompleteUI
            name="field"
            label={t("field")}
            placeholder={t("chooseField")}
            options={filteredFields}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={filter.field}
            onSelectionChange={(key: any) => handleSelectChange(key, "field")}
          />

          <AutocompleteUI
            name="class"
            label={t("class")}
            placeholder={t("chooseClass")}
            options={filteredClasses}
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
            name="student"
            label={t("student")}
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
          triggerText={t("student")}
          field=""
          onApplyFilter={handleApplyFilter}
          handleClearFilter={() => {
            handleClearFilter(null, "gender");
            handleClearFilter(null, "studentStatus");
          }}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.gender || !!appliedFilter.studentStatus}
          header={t("student")}
          classNames={{ popoverContent: "min-w-72", content: 'p-2 space-y-1' }}
        >
         
          <AutocompleteUI
            name="gender"
            label={t("gender")}
            placeholder={t("chooseGender")}
            options={list.gender}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.gender}
            onSelectionChange={(key: any) => handleSelectChange(key, "gender")}
          />

          <AutocompleteUI
            name="studentStatus"
            label={t("studentStatus")}
            placeholder={t("chooseStudentStatus")}
            options={list.studentStatus}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.studentStatus}
            onSelectionChange={(key: any) => handleSelectChange(key, "studentStatus")}
          />

        </FilterPopover>

        {
          !isBulkFilter && (
            <FilterPopover
              triggerText={t("session")}
              field=""
              onApplyFilter={handleApplyFilter}
              handleClearFilter={() => handleClearFilter(null, "sessionNo")}
              filterLoading={filterLoading}
              isActive={!!appliedFilter.sessionNo}
              header={t("session")}
              isDisableds={{
                buttonClear: true,
              }}
            >
            
              <AutocompleteUI
                name="sessionNo"
                placeholder={t("chooseSession")}
                options={list.sessions}
                optionLabel="label"
                optionValue="value"
                selectedKey={filter.sessionNo}
                onSelectionChange={(key: any) => handleSelectChange(key, "sessionNo")}
                isDisabled={false}
                isClearable={false}
              />

            </FilterPopover>
        )}      
        <FilterPopover
          triggerText={t("program")}
          field="programType"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={() => handleClearFilter(null, "programType")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.programType}
          header={t("program")}
        >
         
          <AutocompleteUI
            name="programType"
            placeholder={t("chooseProgramType")}
            options={list.programType}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.programType}
            onSelectionChange={(key: any) => handleSelectChange(key, "programType")}
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("promotion")}
          field="promotionNo"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={() => handleClearFilter(null, "promotionNo")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.promotionNo}
          header={t("promotion")}
        >
         
          <AutocompleteUI
            name="promotionNo"
            placeholder={t("choosePromotion")}
            options={list.promotionNo}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.promotionNo}
            onSelectionChange={(key: any) => handleSelectChange(key, "promotionNo")}
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("term")}
          field="termNo"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={() => handleClearFilter(null, "termNo")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.termNo}
          header={t("term")}
        >
         
          <AutocompleteUI
            name="termNo"
            placeholder={t("chooseTerm")}
            options={list.termNo}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.termNo}
            onSelectionChange={(key: any) => handleSelectChange(key, "termNo")}
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("classStudentStatus")}
          field="classStudentStatus"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={() => handleClearFilter(null, "classStudentStatus")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.classStudentStatus}
          header={t("classStudentStatus")}
        >
         
          <AutocompleteUI
            name="classStudentStatus"
            placeholder={t("chooseClassStudentStatus")}
            options={list.classStudentStatus}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.classStudentStatus}
            onSelectionChange={(key: any) => handleSelectChange(key, "classStudentStatus")}
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("transferred")}
          field="transferred"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={() => handleClearFilter(null, "transferred")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.transferred}
          header={t("transferred")}
        >
         
          <AutocompleteUI
            name="transferred"
            placeholder={t("chooseTransferred")}
            options={list.transferred}
            optionLabel="label"
            optionValue="value"
            selectedKey={String(filter.transferred)}
            onSelectionChange={(key: any) => handleSelectChange(key, "transferred")}
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