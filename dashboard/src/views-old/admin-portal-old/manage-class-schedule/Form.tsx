/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalUI from "@/components/hero-ui/modal/Modal";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/helpers/validations/index";
import facultyService from "@/services/faculty.service";
import { Spinner } from "@heroui/react";
import ScheduleUI from "@/components/schedule/ScheduleUI";
import ShowToast from "@/components/hero-ui/toast/ShowToast";

interface FormProps {
  isOpen?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row: any;
}

const initialFormData: Faculty = {
  id: null,
  facultyCode: "",
  facultyNameEn: "",
  facultyNameKh: "",
  status: "Active",
};

const Form = ({
  isOpen = false,
  onOpenChange,
  loadList,
  isEdit,
  row,
}: FormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Faculty>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const id = row?.id ?? null;

  // Load data when `id` changes
  useEffect(() => {
    console.log("Row: ", row);
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
          facultyCode: row.code ?? "",
          facultyNameEn: row.name_en ?? "",
          facultyNameKh: row.name_kh ?? "",
          status: row.status ?? "Active",
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
    const validationErrors = Validation.Faculty(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    console.log("Submitting form data:", formData);

    try {
      if (isEdit) {
        await facultyService.update(id, formData);
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await facultyService.create(formData);
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

  if(!isOpen) return null;
  
  return (
    <ModalUI
      onSubmit={onSubmit}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={t("create")}
      titleTwo={t("edit")}
      isEdit={isEdit}
      onSaveNew={onSaveNew}
      onSaveClose={onSaveClose}
      resetForm={resetForm}
      size="full"
      closeForm={() => setErrors({})}
      disabledBtn={loading}
    >
      {loading ? (
        <Spinner variant="spinner" size="sm" label={t("loading")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 h-[85vh]">
         <ScheduleUI row={row}/>
        </div>
      )}
    </ModalUI>
  );
};

export default memo(Form);
