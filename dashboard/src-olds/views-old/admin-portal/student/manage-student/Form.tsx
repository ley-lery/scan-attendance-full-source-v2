/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Input, Modal, ShowToast } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Validation } from "@/validations/index";
import { Radio, RadioGroup, Select, SelectItem } from "@heroui/react";
import { useMutation } from "@/hooks/useMutation";
import moment from "moment";
import {
  type DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";

interface FormProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: any;
}

const initialFormData: Student = {
  id: null,
  studentNameEn: "",
  studentNameKh: "",
  studentCode: "",
  dob: today(getLocalTimeZone()),
  gender: "Male",
  email: "",
  phone: "",
  password: "1234567",
  status: "Active",
};


export const genders = [
  {key: "Male", label: "Male"},
  {key: "Female", label: "Female"},
];

const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Student>(initialFormData);
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
          studentNameEn: String(row.name_en),
          studentNameKh: String(row.name_kh),
          studentCode: String(row.code),
          dob: parseDate(moment(row.dob).format("YYYY-MM-DD")),
          gender: row.gender,
          email: String(row.email),
          phone: String(row.phone_number),
          password: String(row.password),
          status: row.status,
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
  const handleDateChange = (field: keyof Student, value: DateValue | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSelectionChange = (e: any) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const formatDateValue = (date: DateValue | null) =>
    date ? date.toString() : null;
  

  const onSubmit = async (): Promise<boolean> => {
    const validationErrors = Validation.Student(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const payload = {
      studentNameEn: formData.studentNameEn,
      studentNameKh: formData.studentNameKh,
      studentCode: formData.studentCode,
      dob: formatDateValue(formData.dob as DateValue | null),
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      status: formData.status,
    };

    console.log(payload, 'payload');

    try {

      setLoading(true);

      if (isEdit) {
        await updateFaculty(`/student/${id}`, payload, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createFaculty(`/student`, payload, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      if (loadList) await loadList();
      resetForm();
      return true;

    } catch (error: any) {

      console.error("Error saving student:", error);
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
          {["studentNameEn", "studentNameKh", "studentCode", "email", "phone"].map((field) => {
            return (
              <Input
                key={field}
                radius="md"
                label={t(field)}
                labelPlacement="outside"
                name={field}
                placeholder={t(`enter${field}`)}
                value={formData[field as keyof Student] as string}
                isInvalid={!!errors[field]}
                errorMessage={errors[field as keyof Student]}
                className="w-full"
                onChange={handleInputChange}
                isRequired
              />
            )
          })}
          
          <DatePicker
            labelPlacement="outside"
            label={t("dob")}
            name="dob"
            value={formData.dob as DateValue | null}
            onChange={(val) =>
              handleDateChange("dob", val as DateValue | null)
            }
            isRequired
            isInvalid={!!errors.dob}
            errorMessage={errors.dob}
          />

          <Select
            label={t("gender")}
            name="gender"
            labelPlacement="outside"
            placeholder={t("chooseGender")}
            selectedKeys={[formData.gender] as any}
            onChange={handleSelectionChange}
            multiple={false}
            isInvalid={!!errors.gender}
            errorMessage={errors.gender}
            isRequired
          >
            {genders.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

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
