/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputNumber, Modal, ShowToast, AutocompleteUI } from "@/components/hero-ui";
import { type ChangeEventHandler, type FormEvent, type Key, memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { Radio, RadioGroup } from "@heroui/react";
import { useMutation } from "@/hooks/useMutation";
import { useFetch } from "@/hooks/useFetch";

type FormLoad = {
  faculties: any[];
  fields: any[];
  courses: any[];
};

interface FormProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: any;
}

const initialFormData: Program = {
  id: null,
  type: "Bachelor",
  faculty: null,
  field: null,
  promotionNo: 0,
  termNo: 0,
  course: null,
  credits: 0,
  status: "Active"
};


export const programTypes = [
  {key: "Bachelor", label: "Bachelor"},
  {key: "Associate", label: "Associate"},
];



const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  

  const { t } = useTranslation();

  const [formData, setFormData] = useState<Program>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<FormLoad>({
    faculties: [],
    fields: [],
    courses: [],
  });

  const id = row?.id ?? null;

  const { mutate: createField, loading: creating } = useMutation();
  const { mutate: updateField, loading: updating } = useMutation();

  const { data: formLoad } = useFetch<FormLoad>("/program/formload");

  // Load form data when modal opens or row changes
  useEffect(() => {
    console.log(formLoad, "formLoad");
    setList({
      faculties: formLoad?.data?.faculties,
      fields: formLoad?.data?.fields,
      courses: formLoad?.data?.courses,
    });
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          type: String(row.program_type),
          faculty: String(row.faculty_id),
          field: String(row.field_id),
          promotionNo: Number(row.promotion_no),
          termNo: Number(row.term_no),
          course: String(row.course_id),
          credits: Number(row.credits),
          status: String(row.status),
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setLoading(false);
    }
  }, [isOpen, row, id, isEdit, formLoad]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };


  const handleSelectChange = (key: any, field: keyof Program) => {
    console.log(formData, "formData");
    setFormData((prev) => {
      const updated = { ...prev, [field]: key };

      // Cascade reset logic
      if (field === "faculty") {
        updated.field = null;
        updated.course = null;
      } else if (field === "field") {
        updated.course = null;
      }

      return updated;
    });
  };

  
  // === FILTER CASCADE LOGIC ===
  const filteredFields = useMemo(
    () => list.fields?.filter((f) => f.faculty_id === Number(formData.faculty)),
    [list.fields, formData.faculty]
  );


  const onSubmit = async (): Promise<boolean> => {
    const validationErrors = Validation.Program(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const payload = {
      type: String(formData.type),
      faculty: Number(formData.faculty),
      field: Number(formData.field),
      promotionNo: Number(formData.promotionNo),
      termNo: Number(formData.termNo),
      course: Number(formData.course),
      credits: Number(formData.credits),
      status: formData.status,
    };

    console.log(payload, "payload");

    try {

      setLoading(true);

      if (isEdit) {
        await updateField(`/program/${id}`, payload, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createField(`/program`, payload, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      if (loadList) await loadList();
      resetForm();
      return true;

    } catch (error: any) {

      console.error("Error saving program:", error);
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
            name="type"
            label={t("programType")}
            placeholder={t("chooseProgramType")}
            options={programTypes}
            optionLabel="label"
            optionValue="key"
            selectedKey={formData.type}
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "type", value: key ?? "" },
              })
            }
            error={errors.type}
            isRequired
          />
          <AutocompleteUI
            name="faculty"
            label={t("faculty")}
            placeholder={t("chooseFaculty")}
            options={list.faculties}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="value"
            selectedKey={formData.faculty}
            onSelectionChange={(key) => handleSelectChange(key, "faculty")}
            error={errors.faculty}
            isRequired
          />

          <AutocompleteUI
            name="field"
            label={t("field")}
            placeholder={t("chooseField")}
            options={filteredFields}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="value"
            selectedKey={formData.field}
            onSelectionChange={(key) => handleSelectChange(key, "field")}
            error={errors.field}
            isRequired
          />

          <AutocompleteUI
            name="course"
            label={t("course")}
            placeholder={t("chooseCourse")}
            options={list.courses}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="value"
            selectedKey={formData.course}
            onSelectionChange={(key) =>
              handleInputChange({ target: { name: "course", value: key ?? "" } })
            }
            error={errors.course}
            isRequired
          />


          {["promotionNo", "termNo", "credits"].map((field) => (
            <InputNumber
              key={field}
              radius="md"
              label={t(field === "promotionNo" ? "promotionNo" : field === "termNo" ? "termNo" : "credits")}
              labelPlacement="outside"
              name={field}
              placeholder={t(`enter${field === "promotionNo" ? "PromotionNo" : field === "termNo" ? "TermNo" : "Credits"}`)}
              value={formData[field as keyof Program] as number}
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
