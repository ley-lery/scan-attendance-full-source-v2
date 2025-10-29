/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Modal, ShowToast, Textarea } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { useMutation } from "@/hooks/useMutation";


interface FormProps {
  isOpen?: boolean;
  onClose: () => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: any;
}

const initialFormData: Role = {
  id: null,
  name: "",
  description: "",
};


const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  
  if (!isOpen) return null;

  const { t } = useTranslation();

  const [formData, setFormData] = useState<Role>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const id = row?.id ?? null;

  const { mutate: createFaculty, loading: creating } = useMutation();
  const { mutate: updateFaculty, loading: updating } = useMutation();

  // Load form data when modal opens or row changes
  useEffect(() => {
    console.log(row, 'row');
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          name: row.name,
          description: row.description,
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setLoading(false);
    }
  }, [isOpen, row, id, isEdit]);


  // Handle change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const onSubmit = async (): Promise<boolean> => {
    const validationErrors = Validation.Role(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }


    try {

      setLoading(true);

      if (isEdit) {
        await updateFaculty(`/role/${id}`, formData, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createFaculty(`/role`, formData, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      if (loadList) await loadList();
      resetForm();
      return true;

    } catch (error: any) {

      console.error("Error saving role:", error);
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
    if (success) onClose();
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

  const closeForm = () => (isEdit || !isFormDirty() ? onClose() : null);

  if (!isOpen) return null;

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
        size="md"
        closeForm={closeForm}
        disabledBtn={loading || creating || updating}
      >
        
        <div className="grid grid-cols-1 gap-4">
          <Input
            radius="md"
            label={t('name')}
            labelPlacement="outside"
            name='name'
            placeholder={t(`enterRoleName`)}
            value={formData.name}
            isInvalid={!!errors.name}
            errorMessage={errors.message}
            className="w-full"
            onChange={handleInputChange}
            isRequired
          />
          <Textarea
            radius="md"
            label={t('description')}
            labelPlacement="outside"
            name='description'
            placeholder={t(`enterRoleDescription`)}
            value={formData.description}
            isInvalid={!!errors.description}
            errorMessage={errors.message}
            className="w-full"
            onChange={handleInputChange}
            isRequired
          />
        </div>
      </Modal>
    </>
  );
};

export default memo(Form);
