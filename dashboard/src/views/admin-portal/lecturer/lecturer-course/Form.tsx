import { AutocompleteUI, Modal, ShowToast } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { useMutation } from "@/hooks/useMutation";
import { useFetch } from "@/hooks/useFetch";


type row = {
  id: number;
  lecturer_id: number;
  course_id: number;
}

interface FormProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: row;
}

const initialFormData: LecturerCourse = {
  id: null,
  lecturer: null,
  course: null,
};


const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  

  const { t } = useTranslation();

  const [formData, setFormData] = useState<LecturerCourse>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const id = row?.id ?? null;

  const { mutate: createFaculty, loading: creating } = useMutation();
  const { mutate: updateFaculty, loading: updating } = useMutation();

  // ========== Form Load ==========
  const { data: formLoad } = useFetch<{ rows: any[]; total_count: number }>("/lecturercourse/formload");
  
  // ========== Get Form Data ==========
  useEffect(() => {
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          lecturer: String(row.lecturer_id),
          course: String(row.course_id),
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setLoading(false);
    }
  }, [isOpen, row, id, isEdit]);

  if (!isOpen) return null;


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = async (): Promise<boolean> => {
    const validationErrors = Validation.LecturerCourse(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const payload = {
      lecturer: Number(formData.lecturer),
      course: Number(formData.course),
    };

    try {

      setLoading(true);

      if (isEdit) {
        await updateFaculty(`/lecturercourse/${id}`, payload, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createFaculty(`/lecturercourse`, payload, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      if (loadList) await loadList();
      resetForm();
      return true;

    } catch (error: any) {

      console.error("Error saving faculty:", error);
      ShowToast({ color: "danger", description: error.response.data.message });
      setErrors({ general: t("error.generic") });
      return false;

    } finally {
      setLoading(false);
    }
  };

  const onSaveClose = async (e: FormEvent<HTMLFormElement>) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const success = await onSubmit();
    if (success) onClose(false);
  };

  const onSaveNew = async (e: FormEvent<HTMLFormElement>) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const success = await onSubmit();
    if (success) resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const isFormDirty = (): boolean =>
    Object.entries(formData).some(([key, value]) => value !== (initialFormData as any)[key]);

  const closeForm = () => (isEdit || !isFormDirty() ? onClose(false) : null);


  return (
    <>
      <Modal
        onSubmit={onSubmit}
        isOpen={isOpen}
        onClose={onClose}
        title={t("create")}
        titleTwo={t("edit")}
        isEdit={isEdit}
        onSaveNew={onSaveNew}
        onSaveClose={onSaveClose}
        resetForm={resetForm}
        size="xl"
        closeForm={closeForm}
        disabledBtn={loading || creating || updating}
      >
        
        <div className="grid grid-cols-2 gap-4">
          <AutocompleteUI
            name="lecturer"
            label={t("lecturer")}
            placeholder={t("chooseLecturer")}
            options={formLoad.data.lecturerList}
            optionLabel="name_en"
            secondaryOptionLabel="name_kh"
            optionValue="id"
            selectedKey={formData.lecturer}
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "lecturer", value: key ?? "" },
              })
            }
            error={errors.lecturer}
            isRequired
          />
          <AutocompleteUI
            name="course"
            label={t("course")}
            placeholder={t("chooseCourse")}
            options={formLoad.data.courseList}
            optionLabel="name_en"
            secondaryOptionLabel="name_kh"
            optionValue="id"
            selectedKey={formData.course}
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "course", value: key ?? "" },
              })
            }
            error={errors.course}
            isRequired
          />
        </div>
      </Modal>
    </>
  );
};

export default memo(Form);
