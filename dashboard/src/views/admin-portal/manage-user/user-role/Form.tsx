/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, AutocompleteItem, Modal, ShowToast } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { useMutation } from "@/hooks/useMutation";
import { useFetch } from "@/hooks/useFetch";


interface FormProps {
  isOpen?: boolean;
  onClose: () => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: any;
}

const initialFormData: UserRole = {
  id: null,
  user: null,
  role: null,
};


const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  
  if (!isOpen) return null;

  const { t } = useTranslation();

  const [formData, setFormData] = useState<UserRole>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const id = row?.id ?? null;

  const { mutate: createFaculty, loading: creating } = useMutation();
  const { mutate: updateFaculty, loading: updating } = useMutation();
  const { data: formLoad } = useFetch<{ users: any[], roles: any[] }>("/userrole/formload");


  // Load form data when modal opens or row changes
  useEffect(() => {
    console.log(row, 'row');
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          user: String(row.user_id),
          role: String(row.role_id),
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
    const validationErrors = Validation.UserRole(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }


    try {

      setLoading(true);

      if (isEdit) {
        await updateFaculty(`/userrole/${id}`, formData, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createFaculty(`/userrole`, formData, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      if (loadList) await loadList();
      resetForm();
      return true;

    } catch (error: any) {

      console.error("Error saving permission:", error);
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
        
        <div className="grid grid-cols-1 gap-4">
          <Autocomplete
            radius="md"
            size="md"
            label={t("user")}
            labelPlacement="outside"
            name="user"
            placeholder={t("chooseUser")}
            selectedKey={formData.user}
            isInvalid={!!errors.user}
            errorMessage={errors.user}
            className="w-full"
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "user", value: key ?? "" },
              })
            }
            isRequired
          >
            {formLoad?.data?.users.map((item: any) => (
              <AutocompleteItem  key={item.id} textValue={item.username }>
                <p className={`truncate w-[95%] `}>{item.username}</p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Autocomplete
            radius="md"
            size="md"
            label={t("role")}
            labelPlacement="outside"
            name="role"
            placeholder={t("chooseRole")}
            selectedKey={formData.role}
            isInvalid={!!errors.role}
            errorMessage={errors.role}
            className="w-full"
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "role", value: key ?? "" },
              })
            }
            isRequired
          >
            {formLoad?.data?.roles.map((item: any) => (
              <AutocompleteItem  key={item.id} textValue={item.name}>
                <p className={`truncate w-[95%] `}>{item.name}</p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
      </Modal>
    </>
  );
};

export default memo(Form);
