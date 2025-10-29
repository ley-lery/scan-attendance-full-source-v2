import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI } from "@/components/hero-ui";
import { DrawerFilter } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { Divider } from "@heroui/react";

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
  isOpen: boolean;
  onClose: () => void;
  filter: DataFilter;
  setFilter: React.Dispatch<React.SetStateAction<DataFilter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isBulkFilter?: boolean;
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
  isBulkFilter = false,
}: FilterProps) => {
  const { t } = useTranslation();

  const [list, setList] = useState<FormLoad>({
    faculyties: [],
    fields: [],
    classes: [],
    courses: [],
    students: [],
    sessions: [],
    programType: [],
    promotionNo: [],
    termNo: [],
    gender: [],
    studentStatus: [],
    classStudentStatus: [],
    transferred: [],
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
        promotionNo: formLoad.data.promotionNo,
        termNo: formLoad.data.termNo,
        programType: formLoad.data.programType,
        gender: formLoad.data.gender,
        studentStatus: formLoad.data.studentStatus,
        classStudentStatus: formLoad.data.classStudentStatus,
        transferred: formLoad.data.transferred,
      });
    }
  }, [formLoad, isOpen]);

  const handleSelectChange = (key: any, field: keyof DataFilter) => {

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

  const filteredCourses = useMemo(() => list.courses?.filter((co) =>  co.class_id === Number(filter.classId)),
    [list.courses, filter.classId]
  );

  const filteredStudents = useMemo(() => list.students?.filter((s) => (s.class_id === Number(filter.classId)) && (!filter.course || s.course_id === Number(filter.course))),
    [list.students, filter.classId, filter.course]
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
    >
      <form className="space-y-4">
        {/* === Academic Info === */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t("academicInfo")}
            </h2>
            <Divider />
          </div>

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
        </div>

        {/* === Student Info === */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t("studentInfo")}
            </h2>
            <Divider />
          </div>

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
        </div>

        {/* === Study Info === */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t("studyInfo")}
            </h2>
            <Divider />
          </div>

          {
            !isBulkFilter && (
              <AutocompleteUI
                name="sessionNo"
                label={t("session")}
                placeholder={t("chooseSession")}
                options={list.sessions}
                optionLabel="label"
                optionValue="value"
                selectedKey={filter.sessionNo}
                onSelectionChange={(key: any) => handleSelectChange(key, "sessionNo")}
              />
            )
          }
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
            name="classStudentStatus"
            label={t("classStudentStatus")}
            placeholder={t("chooseClassStudentStatus")}
            options={list.classStudentStatus}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.classStudentStatus}
            onSelectionChange={(key: any) => handleSelectChange(key, "classStudentStatus")}
          />
          <AutocompleteUI
            name="transferred"
            label={t("transferred")}
            placeholder={t("chooseTransferred")}
            options={list.transferred}
            optionLabel="label"
            optionValue="value"
            selectedKey={String(filter.transferred)}
            onSelectionChange={(key: any) => handleSelectChange(key, "transferred")}
          />
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;
