import React, { useState, useEffect, type Key, type FormEvent } from "react";
import { DAYS, type Course, type Day, type SessionType } from "@/types/schedule";
import { getTimeSlotsForSession } from "@/utils/timeUtils";
import { useTranslation } from "react-i18next";
import ModalUI from "../hero-ui/modal/Modal";
import ShowToast from "../hero-ui/toast/ShowToast";
import InputTextUi from "../hero-ui/inputs/InputTextUi";
import InputNumberUi from "../hero-ui/inputs/InputNumberUi";

const lecturers = [
  { name_en: "Mr. Khoeurt Sopha", id: "1" },
  { name_en: "Mr. Youer Man", id: "2" },
  { name_en: "Phann Kompeak", id: "3" },
  { name_en: "Asit. Prof Prum Sopheanoch", id: "3" },
  { name_en: "Mr. Lor Soth", id: "3" },
];

interface AddClassFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Omit<Course, "id">) => void;
  onClose?: () => void;
  editingCourse?: Course;
  session: SessionType;
  initialDay?: Day;
  initialTimeSlot?: string;
  row?: object;
}

const initialFormData: Omit<Course, "id"> = {
  subject: "",
  credits: 1,
  room: "",
  lecturer: "",
  tel: "",
  day: "Monday",
  timeSlot: "",
  startTime: "",
  endTime: "",
};

const AddClassForm: React.FC<AddClassFormProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  onClose,
  editingCourse,
  session,
  initialDay = "Monday",
  initialTimeSlot = "",
  row,
}) => {
  const [t] = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<Course, "id">>(initialFormData);

  const timeSlots = getTimeSlotsForSession(session);

  useEffect(() => {
    console.log("Initail:", initialTimeSlot, initialDay);
    if (editingCourse) {
      setFormData({
        subject: editingCourse.subject,
        credits: editingCourse.credits,
        room: editingCourse.room,
        lecturer: editingCourse.lecturer,
        tel: editingCourse.tel,
        day: initialDay || editingCourse.day || "Monday",
        timeSlot: initialTimeSlot || editingCourse.timeSlot || "",
        startTime: editingCourse.startTime || "",
        endTime: editingCourse.endTime || "",
      });
    } else {
      setFormData({
        ...initialFormData,
        lecturer: lecturers[0].name_en,
        day: initialDay || "Monday",
        timeSlot: initialTimeSlot || "",
      });
    }
  }, [editingCourse, isOpen, initialDay, initialTimeSlot, row]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: Key } },
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (field: keyof Course, value: number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value ?? 0 }));
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    const selected = timeSlots.find((slot) => slot.label === timeSlot);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        timeSlot,
        startTime: selected.start,
        endTime: selected.end,
      }));
    }
  };

  const onSubmit = (): boolean => {

    try {
      setIsSubmitting(true);
      onSave(formData);
      onOpenChange(false);
      ShowToast({
        color: "success",
        description: editingCourse ? t("updatedSuccess") : t("createdSuccess"),
      });
      return true;
    } catch (err) {
      console.error("Failed to save course:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSaveClose = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const isSubmit = await onSubmit();
    if (isSubmit) {
      if (onClose) {
        onClose();
      }
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
  };

  if (!isOpen) return null;

  return (
      <ModalUI
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        onSaveClose={onSaveClose}
        onSaveNew={onSaveNew}
        onSubmit={onSubmit}
      >
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("lecturer")} *
            </label>
            <select
              value={formData.lecturer}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lecturer: e.target.value as string,
                }))
              }
            >
              {lecturers.map((lecturer) => (
                <option key={lecturer.name_en} value={lecturer.name_en}>
                  {lecturer.name_en}
                </option>
              ))}
            </select>
          </div>
          <InputTextUi
            label={t("subject")}
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder={t("enterSubject")}
            isRequired
            isClearable
          />
          <InputNumberUi
            label={t("credits")}
            name="credits"
            value={formData.credits}
            onValueChange={(val) => handleNumberChange("credits", val)}
            minValue={1}
            isClearable
            placeholder={t("enterCredits")}
            formatOptions={{ useGrouping: false }}
            isRequired
            labelPlacement="outside"
          />

          <InputTextUi
            label={t("room")}
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            placeholder={t("roomPlaceholder")}
            labelPlacement="outside"
            isRequired
            isClearable
          />

          <InputTextUi
            label={t("tel")}
            name="tel"
            value={formData.tel}
            onChange={handleInputChange}
            placeholder={t("phoneNumber")}
            isClearable
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("day")} *
            </label>
            <select
              value={formData.day}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  day: e.target.value as Day,
                }))
              }
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("timeSlot")} *
            </label>
            <select
              value={formData.timeSlot}
              onChange={(e) => handleTimeSlotChange(e.target.value)}
              required
            >
              <option value="">{t("selectTimeSlot")}</option>
              {timeSlots.map((slot) => (
                <option key={slot.label} value={slot.label}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalUI>
  );
};

export default AddClassForm;
