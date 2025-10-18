import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI } from "@/components/hero-ui";
import { DrawerFilter } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";

// === Types ===

type FormLoad = {
  faculyties: any[]; 
  fields: any[];
  classes: any[];
  courses: any[];
  students: any[];
  sessions: any[];
};

type Filter = {
  faculty: number | null,
  field: number | null,
  classId: number | null,
  course: number | null,
  student: number | null,
  promotionNo: number | null,
  termNo: number | null,
  programType: string | null,
  gender: string | null,
  studentStatus: string | null,
  searchKeyword: string | null,
  sessionNo: string | null,
  page: number,
  limit: number
};


interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
  errors,
  setErrors,
}: FilterProps) => {
  const { t } = useTranslation();

  const [list, setList] = useState<FormLoad>({
    faculyties: [],
    fields: [],
    classes: [],
    courses: [],
    students: [],
    sessions: [],
  });

  const { data: formLoad } = useFetch<FormLoad>("/admin/markattstudent/formload");

  useEffect(() => {
    console.log(formLoad, "formLoad");
    
    if (isOpen && formLoad) {
      setList({
        faculyties: formLoad.data.faculyties,
        fields: formLoad.data.fields,
        classes: formLoad.data.classes,
        courses: formLoad.data.courses,
        students: formLoad.data.students,
        sessions: formLoad.data.sessions,
      });
    }
  }, [formLoad, isOpen]);

  const handleSelectChange = (key: any, field: keyof Filter) => {

    // clear next-level selections when parent changes
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

  // === FILTER CASCADE LOGIC ===
  const filteredFields = useMemo(() => list.fields?.filter((f) => f.faculty_id === Number(filter.faculty)),
    [list.fields, filter.faculty]
  );

  const filteredClasses = useMemo(() => list.classes?.filter((c) => !filter.field || c.field_id === Number(filter.field)),
    [list.classes, filter.field]
  );

  const filteredCourses = useMemo(() => list.courses?.filter((co) => !filter.classId || co.class_id === Number(filter.classId)),
    [list.courses, filter.classId]
  );

  const filteredStudents = useMemo(() => list.students?.filter((s) => (!filter.classId || s.class_id === Number(filter.classId)) && (!filter.course || s.course_id === Number(filter.course))),
    [list.students, filter.classId, filter.course]
  );

  // === UI ===
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
    >
      <form className="space-y-4">

        {/* Faculty */}
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

        {/* Field */}
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

        {/* Class */}
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

        {/* Course */}
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

        {/* Student */}
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

        {/* Session */}
        <AutocompleteUI
          name="session"
          label={t("session")}
          placeholder={t("chooseSession")}
          options={list.sessions}
          optionLabel="label"
          optionValue="value"
          selectedKey={filter.sessionNo}
          onSelectionChange={(key: any) => handleSelectChange(key, "sessionNo")}
          error={errors.sessionNo}
          isRequired
        />
      </form>
    </DrawerFilter>
  );
};

export default Filter;
