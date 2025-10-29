/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, ShowToast } from "@/components/hero-ui";
import { ConfirmDialog } from "@/components/ui";
import {  type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { Autocomplete, AutocompleteItem, Spinner, useDisclosure } from "@heroui/react";
import lecturerCourseService from "@/services/lecturer-course.service";

interface FormProps {
  isOpen?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row: any;
}

const initialFormData: LecturerCourse = {
  id: null,
  lecturer: null,
  course: null,
};


const useConfrimClosure = () => {
  const { isOpen, onOpen, onOpenChange, onClose, ...rest } = useDisclosure();
  return {
    isOpenConfirm: isOpen,
    onOpenConfirm: onOpen,
    onOpenChangeConfirm: onOpenChange,
    onCloseConfirm: onClose,
    ...rest,
  };
};


const Form = ({
  isOpen = false,
  onOpenChange,
  loadList,
  isEdit,
  row,
}: FormProps) => {
  const { t } = useTranslation();
  const { isOpenConfirm, onOpenConfirm, onOpenChangeConfirm, onCloseConfirm } = useConfrimClosure();
  const [formData, setFormData] = useState<LecturerCourse>(initialFormData);
  const [lecturerData, setLecturerData] = useState<Lecturer[]>([]);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const id = row?.id ?? null;

  // ==== Form Load ====
  useEffect(() => {
    if (isOpen) {
      formLoad();
    }
  }, [isOpen]);

  const formLoad = async () => {
    try {
      const res = await lecturerCourseService.formLoad();
      const data = res.data 
      const activeLecturers = data.lecturers.filter((lecturer: Lecturer) => lecturer.status === "Active");
      const activeCourses = data.courses.filter((course: Course) => course.status === "Active");
      setLecturerData(activeLecturers);
      setCourseData(activeCourses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Load data when `id` changes
  useEffect(() => {
    if (isOpen && id) {
      loadData();
    } else if (isOpen && !id) {
      setLoading(false);
      setFormData({ ...initialFormData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, row, id]);

  const loadData = () => {
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id ?? null,
          lecturer: String(row.lecturer_id),
          course: String(row.course_id),
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: Key } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
    }

    try {
      if (isEdit) {
        await lecturerCourseService.update(id, payload);
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await lecturerCourseService.create(payload);
        ShowToast({ color: "success", description: t("createdSuccess") });
      }
      if (loadList) {
        await loadList();
      }
      setFormData(initialFormData);
      setErrors({});
      return true;
    } catch (error) {
      console.error("Error saving room:", error);
      setErrors({ general: t("error.generic") });
      return false;
    }
  };

  const onSaveClose = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const isSubmit = await onSubmit();
    if (isSubmit) {
      onOpenChange(false);
      resetForm();
    }
  };

  const onSaveNew = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const isSubmit = await onSubmit();
    if (isSubmit) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // ====== Check if form data has been modified ======

  const isFormDirty = (): boolean => {
    return Object.entries(formData).some(
      ([key, value]) => value !== (initialFormData as any)[key]
    );
  };

  // Close form with confirm check if needed
  const closeForm = () => {
    const shouldConfirmClose = !isEdit && isFormDirty();

    if (shouldConfirmClose) {
      onOpenConfirm(); 
    } else {
      handleClose(); 
    }
  };

  // Handle confirmed form close 
  const handleClose = () => {
    onCloseConfirm();        
    onOpenChange(false);     
    resetForm();           
    setErrors({});         
  };



  if(!isOpen) return null;

  return (
    <>
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onOpenChange={onOpenChangeConfirm}
        confirm={handleClose}
        confirmLabel={t("close")}
        title={t("unSaveTitle")}
        message={t("unSaveMessage")}
      />
      <Modal
        onSubmit={onSubmit}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={t("create")}
        titleTwo={t("edit")}
        isEdit={isEdit}
        onSaveNew={onSaveNew}
        onSaveClose={onSaveClose}
        resetForm={resetForm}
        size="xl"
        closeForm={closeForm}
        disabledBtn={loading}
      >
        {loading ? (
          <Spinner variant="spinner" size="sm" label={t("loading")} />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Autocomplete
              radius="md"
              label={t("lecturer")}
              labelPlacement="outside"
              name="lecturer"
              placeholder={t("chooseLecturer")}
              selectedKey={formData.lecturer}
              isInvalid={!!errors.lecturer}
              errorMessage={errors.lecturer}
              className="w-full"
              onSelectionChange={(key) =>
                handleInputChange({
                  target: { name: "lecturer", value: key ?? "" },
                })
              }
              isRequired
            >
              {lecturerData.map((item: any) => (
                <AutocompleteItem key={item.id} textValue={item.name_kh}>
                  <p className={`truncate w-[95%] `}>{item.name_en} - {item.name_kh}</p>
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              radius="md"
              label={t("course")}
              labelPlacement="outside"
              name="course"
              placeholder={t("chooseCourse")}
              selectedKey={formData.course}
              isInvalid={!!errors.course}
              errorMessage={errors.course}
              className="w-full"
              onSelectionChange={(key) =>
                handleInputChange({
                  target: { name: "course", value: key ?? "" },
                })
              }
              isRequired
            >
              {courseData.map((item: any) => (
                <AutocompleteItem key={item.id} textValue={item.name_en}>
                  <p className="truncate w-[95%]">{item.name_en} - {item.name_kh}</p>
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        )}
      </Modal>
    </>
  );
};

export default memo(Form);
