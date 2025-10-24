/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, ShowToast,AutocompleteUI, SelectUI } from "@/components/hero-ui";
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

const initialFormData: ClassStudent = {
  id: null,
  classId: null,
  studentId: null,
  status: "Active",
};

const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {

  const { t } = useTranslation();

  const [formData, setFormData] = useState<ClassStudent>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const id = row?.id ?? null;

  const { mutate: createClassStudent, loading: creating } = useMutation({
    onSuccess(res){
      onClose(false);
      resetForm();
      ShowToast({ color: "success", description: res?.message || t("createdSuccess") });
    },
    onError(err){
      console.log(err, 'create');
      ShowToast({ color: "error", description: err?.message || t("createdFailed") });
    }
  });
  const { mutate: updateClassStudent, loading: updating } = useMutation({
    onSuccess(res){
      console.log(res, 'update');
      onClose(false);
      resetForm();
      ShowToast({ color: "success", description: res?.message[0]?.message || t("updatedSuccess") });
    },
    onError(err){
      console.log(err, 'update');
      ShowToast({ color: "error", description: err?.message[0]?.message || t("updatedFailed") });
    }
  });


  const { data: formLoad } = useFetch<{ rows: any[]; total_count: number }>("/studentclass/formload");


  // Load form data when modal opens or row changes
  useEffect(() => {
    console.log(formLoad, 'formLoad');
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          classId: String(row.class_id),
          studentId: String(row.student_id),
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
    const validationErrors = Validation.ClassStudent(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const payload = {
      classId: Number(formData.classId),
      studentId: Number(formData.studentId),
      status: formData.status,
    };

    setLoading(true);

    if (isEdit) {
      await updateClassStudent(`/studentclass/${id}`, payload, "PUT");
    } else {
      await createClassStudent(`/studentclass`, payload, "POST");
    }

    setLoading(false);
    resetForm();

    return true;

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
            name="classId"
            label={t("class")}
            placeholder={t("chooseClass")}
            options={formLoad?.data?.classList}
            optionLabel="class_name"
            optionValue="id"
            selectedKey={formData.classId?.toString()}
            onSelectionChange={(key) =>
              handleInputChange({
                target: { name: "classId", value: key ?? "" },
              })
            }
            error={errors.classId}
            isRequired
          />
          <SelectUI
            name="studentId"
            label={t("student")}
            placeholder={t("chooseStudent")}
            options={formLoad?.data?.studentList}
            optionLabel="name_en"
            optionValue="id"
            selectedKeys={formData.studentId?.toString()}
            onChange={(e) =>
              handleInputChange({ target: { name: "studentId", value: e?.target?.value ?? "" } })
            }
            error={errors.studentId}
            isRequired
          />
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
