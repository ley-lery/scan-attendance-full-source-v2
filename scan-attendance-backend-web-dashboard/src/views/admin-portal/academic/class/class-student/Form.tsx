/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, ShowToast, AutocompleteUI, MultiSelect } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  studentIds: [],
  status: "Active",
};

const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ClassStudent>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<Set<string>>(new Set());

  const id = row?.id ?? null;

  const { mutate: createClassStudent, loading: creating } = useMutation({
    onSuccess(res) {
      console.log(res, "create");
      onClose(false);
      resetForm();
      loadList?.();
      ShowToast({ color: "success", description: res?.message[0]?.message });
    },
    onError(err) {
      console.log(err, "create");
      ShowToast({ color: "error", description: err?.response?.data?.message });
    },
  });

  const { mutate: updateClassStudent, loading: updating } = useMutation({
    onSuccess(res) {
      console.log(res, "update");
      onClose(false);
      resetForm();
      loadList?.();
      ShowToast({ color: "success", description: res?.message[0]?.message });
    },
    onError(err) {
      console.log(err, "update");
      ShowToast({ color: "error", description: err?.response?.data?.message });
    },
  });

  const { data: formLoad } = useFetch<{ rows: any[]; total_count: number }>("/studentclass/formload");

  // Load form data when modal opens or row changes
  useEffect(() => {
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          id: id,
          classId: String(row.class_id),
          studentIds: Array.isArray(row.student_id) ? row.student_id : [String(row.student_id)],
          status: row.status,
        });
        setStudents(new Set(Array.isArray(row.student_id) ? row.student_id.map(String) : [String(row.student_id)]));
      } else {
        setFormData(initialFormData);
        setStudents(new Set());
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
    const payloadCreate = {
      classId: Number(formData.classId),
      studentIds: Array.from(students).map(String), // convert Set to array of numbers
      status: formData.status,
    };
    
    const payloadUpdate = {
      classId: Number(formData.classId),
      studentId: Number(formData.studentId), // convert Set to array of numbers
      status: formData.status,
    };
    

    setLoading(true);

    try {
      if (isEdit) {
        await updateClassStudent(`/studentclass/${id}`, payloadUpdate, "PUT");
      } else {
        await createClassStudent(`/studentclass`, payloadCreate, "POST");
      }
      resetForm();
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
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
    setStudents(new Set());
  };

  if (!isOpen) return null;

  return (
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
            handleInputChange({ target: { name: "classId", value: key ?? "" } })
          }
          error={errors.classId}
          isRequired
        />

        <MultiSelect
          label={t("student")}
          placeholder={t("chooseStudent")}
          options={formLoad?.data?.studentList}
          selectedKeys={students}
          onSelectionChange={setStudents}
          isDisabled={isEdit}
          isRequired
          name="studentIds"
          optionLabel="name_kh"
          optionValue="id"
        />

        <div className="col-span-2">
          <p className="text-small text-default-500">Selected: {Array.from(students).join(", ")}</p>
        </div>

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
              <Radio value={status} color={status === "Active" ? "primary" : "danger"}>
                {status}
              </Radio>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Modal>
  );
};

export default memo(Form);
