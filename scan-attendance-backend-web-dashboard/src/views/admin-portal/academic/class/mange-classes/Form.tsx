/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Modal, ShowToast, InputNumber, AutocompleteUI } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { Radio, RadioGroup } from "@heroui/react";
import { useMutation } from "@/hooks/useMutation";
import { useFetch } from "@/hooks/useFetch";

interface FormProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: any;
}

const initialFormData: Class = {
  id: null,
  programType: "Bachelor",
  faculty: null,
  field: null,
  promotionNo: 0,
  termNo: 0,
  className: "",
  roomName: "",
  status: "Active"
};

export const programTypes = [
  {key: "Bachelor", label: "Bachelor"},
  {key: "Associate", label: "Associate"},
];


const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {


  const { t } = useTranslation();

  const [formData, setFormData] = useState<Class>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const id = row?.id ?? null;

  const { mutate: createField, loading: creating } = useMutation();
  const { mutate: updateField, loading: updating } = useMutation();


  const { data: formLoad } = useFetch<{ faculties: any[]; fields: any[] }>("/class/formload");


  // Load form data when modal opens or row changes
  useEffect(() => {
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          programType: row.program_type,
          faculty: String(row.faculty_id),
          field: String(row.field_id),
          promotionNo: Number(row.promotion_no),
          termNo: Number(row.term_no),
          className: String(row.class_name),
          roomName: String(row.room_name),
          status: row.status,
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
    const validationErrors = Validation.Class(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const payload = {
      programType: formData.programType,
      faculty: Number(formData.faculty),
      field: Number(formData.field),
      promotionNo: String(formData.promotionNo),
      termNo: String(formData.termNo),
      className: formData.className,
      roomName: formData.roomName,
      status: formData.status,
    };
    console.log(payload, "payload");

    try {

      setLoading(true);

      if (isEdit) {
        await updateField(`/class/${id}`, payload, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createField(`/class`, payload, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      if (loadList) await loadList();
      resetForm();
      return true;

    } catch (error: any) {

      console.error("Error saving class:", error);
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
        size="xl"
        closeForm={closeForm}
        disabledBtn={loading || creating || updating}
      >
        <div className="grid grid-cols-2 gap-4">
          <AutocompleteUI
            name="programType"
            label={t("programType")}
            placeholder={t("chooseProgramType")}
            options={programTypes}
            optionLabel="label"
            optionValue="key"
            selectedKey={formData.programType?.toString()}
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "programType", value: key ?? "" },
              })
            }
            error={errors.programType}
            isRequired
          />
          {["className", "roomName"].map((field) => (
            <Input
              key={field}
              radius="md"
              label={t(field === "className" ? "className" : "roomName")}
              labelPlacement="outside"
              name={field}
              placeholder={t(`enter${field === "className" ? "ClassName" : "RoomName"}`)}
              value={formData[field as keyof Class] as string}
              isInvalid={!!errors[field]}
              errorMessage={errors[field]}
              className="w-full"
              onChange={handleInputChange}
              isRequired
            />
          ))}
          
          <AutocompleteUI
            name="faculty"
            label={t("faculty")}
            placeholder={t("chooseFaculty")}
            options={formLoad.data.faculties}
            optionLabel="name_en"
            secondaryOptionLabel="name_kh"
            optionValue="id"
            selectedKey={formData.faculty}
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "faculty", value: key ?? "" },
              })
            }
            error={errors.faculty}
            isRequired
          />
          <AutocompleteUI
            name="field"
            label={t("field")}
            placeholder={t("chooseField")}
            options={formLoad.data.fields}
            optionLabel="field_name_en"
            secondaryOptionLabel="field_name_kh"
            optionValue="id"
            selectedKey={formData.field}
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "field", value: key ?? "" },
              })
            }
            error={errors.field}
            isRequired
          />
          
          {["promotionNo", "termNo"].map((field) => (
            <InputNumber
              key={field}
              radius="md"
              label={t(field === "promotionNo" ? "promotionNo" : "termNo")}
              labelPlacement="outside"
              name={field}
              placeholder={t(`enter${field === "promotionNo" ? "PromotionNo" : "TermNo"}`)}
              value={formData[field as keyof Class] as number}
              isInvalid={!!errors[field]}
              errorMessage={errors[field]}
              className="w-full"
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, [field]: value }));
                if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
              }}
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
