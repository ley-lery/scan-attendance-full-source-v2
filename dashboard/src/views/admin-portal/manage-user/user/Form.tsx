/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Modal, ShowToast } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { Radio, RadioGroup } from "@heroui/react";
import { useMutation } from "@/hooks/useMutation";

interface FormProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: any;
}

const initialFormData: Faculty = {
  id: null,
  facultyNameEn: "",
  facultyNameKh: "",
  facultyCode: "",
  status: "Active",
};

const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  
  if (!isOpen) return null;

  const { t } = useTranslation();

  const [formData, setFormData] = useState<Faculty>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const id = row?.id ?? null;

  const { mutate: createFaculty, loading: creating } = useMutation();
  const { mutate: updateFaculty, loading: updating } = useMutation();

  // Load form data when modal opens or row changes
  useEffect(() => {
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          facultyNameEn: String(row.name_en),
          facultyNameKh: String(row.name_kh),
          facultyCode: String(row.code),
          status: String(row.status),
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setLoading(false);
    }
  }, [isOpen, row, id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = async (): Promise<boolean> => {
    const validationErrors = Validation.Faculty(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const payload = {
      facultyNameEn: formData.facultyNameEn,
      facultyNameKh: formData.facultyNameKh,
      facultyCode: formData.facultyCode,
      status: formData.status,
    };

    try {

      setLoading(true);

      if (isEdit) {
        await updateFaculty(`/faculty/${id}`, payload, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createFaculty(`/faculty`, payload, "POST");
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

  const closeForm = () => (isEdit || !isFormDirty() ? onClose(false) : onClose(false));


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
          {["facultyNameEn", "facultyNameKh", "facultyCode"].map((field) => (
            <Input
              key={field}
              radius="md"
              label={t(field === "facultyNameEn" ? "nameEn" : field === "facultyNameKh" ? "nameKh" : "code")}
              labelPlacement="outside"
              name={field}
              placeholder={t(`enter${field === "facultyNameEn" ? "NameEn" : field === "facultyNameKh" ? "NameKh" : "Code"}`)}
              value={formData[field as keyof Faculty] as string}
              isInvalid={!!errors[field]}
              errorMessage={errors[field]}
              className="w-full"
              onChange={handleInputChange}
              isRequired
            />
          ))}
          <RadioGroup 
            className="flex gap-4" 
            classNames={{ label: "text-sm" }} 
            orientation="horizontal" 
            label={t("status")}
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            size="sm"
          >
            {["Active", "Inactive"].map((status) => (
              <div key={status} className="flex items-center gap-2">
                <Radio value={status} color={status === "Active" ? "primary" : "danger"}>{status}</Radio>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Modal>
    </>
  );
};

export default memo(Form);
