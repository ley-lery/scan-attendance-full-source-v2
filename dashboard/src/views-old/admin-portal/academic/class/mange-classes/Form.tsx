/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Modal, ShowToast, Autocomplete, AutocompleteItem, InputNumber } from "@/components/hero-ui";
import { type ChangeEventHandler, type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
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

  const handleSelectionChange = (e: any) => {
    setFormData((prev) => ({ ...prev, programType: e.target.value }));
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
          <Select
            label={t("programType")}
            name="programType"
            labelPlacement="outside"
            placeholder={t("chooseProgramType")}
            selectedKeys={[formData.programType] as any}
            onChange={handleSelectionChange}
            multiple={false}
            isInvalid={!!errors.programType}
            errorMessage={errors.programType}
            isRequired
          >
            {programTypes.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
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
          
          <Autocomplete
            radius="md"
            size="md"
            label={t("faculty")}
            labelPlacement="outside"
            name="faculty"
            placeholder={t("chooseFaculty")}
            selectedKey={formData.faculty}
            isInvalid={!!errors.faculty}
            errorMessage={errors.faculty}
            className="w-full"
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "faculty", value: key ?? "" },
              })
            }
            isRequired
          >
            {formLoad.data.faculties.map((item: any) => (
              <AutocompleteItem  key={item.id} textValue={item.name_en + " - " + item.name_kh}>
                <p className={`truncate w-[95%] `}>{item.name_en} - {item.name_kh}</p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Autocomplete
            radius="md"
            size="md"
            label={t("field")}
            labelPlacement="outside"
            name="field"
            placeholder={t("chooseField")}
            selectedKey={formData.field}
            isInvalid={!!errors.field}
            errorMessage={errors.field}
            className="w-full"
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "field", value: key ?? "" },
              })
            }
            isRequired
          >
            {formLoad.data.fields.map((item: any) => (
              <AutocompleteItem  key={item.id} textValue={item.field_name_en + " - " + item.field_name_kh}>
                <p className={`truncate w-[95%] `}>{item.field_name_en} - {item.field_name_kh}</p>
              </AutocompleteItem>
            ))}
          </Autocomplete>
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
              onChange={handleInputChange as ChangeEventHandler<HTMLInputElement> & ((value: number) => void)}
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
