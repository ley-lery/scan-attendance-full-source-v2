/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, AutocompleteItem, DatePicker, Modal, ShowToast } from "@/components/hero-ui";
import { type FormEvent, type Key, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@/hooks/useMutation";
import { type DateValue, parseDate } from "@internationalized/date";
import { useDisclosure } from "@/god-ui";
import { useFetch } from "@/hooks/useFetch";
import { formatDateValue } from "@/helpers";
import React from "react";
import { TimeSlot } from "./TimeSlot";
import { ScheduleHeader } from "./ScheduleHeader";
import AddClass from "./AddClass";
import ScheduleFooter from "./ScheduleFooter";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface FormProps {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  loadList?: () => Promise<void>;
  isEdit?: boolean;
  row?: any;
}

type SessionWithDetails = {
  day: string;
  time_slot: string;
  order: number;
  course?: number;
  lecturer?: number;
  credits?: number;
}

type ScheduleData = {
  classId: number | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  sessions: SessionWithDetails[];
}

type ClassInfo = {
  field_name_en: string;
  promotion_no: number;
  group: string;
  stage: string;
  year: string;
  term_no: number;
  start_date: string;
  mid_term_start_date: string;
  mid_term_end_date: string;
  final_exam_date: string;
  new_term_start_date: string;
  room_name: string;
}

type TempSessionData = {
  course: number | null;
  lecturer: number | null;
  credits: number | null;
}

type SelectedSlot = {
  time: string;
  day: string;
  order: number;
}

// ============================================================================
// Constants
// ============================================================================

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const TIME_SLOTS = [
  { value: "6:00-7:30", label: "6:00-7:30 PM", order: 1 },
  { value: "7:45-9:15", label: "7:45-9:15 PM", order: 2 },
] as const;

const INITIAL_FORM_DATA: ScheduleData = {
  classId: null,
  startDate: null,
  endDate: null,
  sessions: []
};

const INITIAL_CLASS_INFO: ClassInfo = {
  field_name_en: "",
  promotion_no: 0,
  group: "",
  stage: "",
  year: "",
  term_no: 0,
  start_date: "",
  mid_term_start_date: "",
  mid_term_end_date: "",
  final_exam_date: "",
  new_term_start_date: "",
  room_name: ""
};

const INITIAL_TEMP_SESSION: TempSessionData = {
  course: null,
  lecturer: null,
  credits: null,
};

// ============================================================================
// Utility Functions
// ============================================================================

const validateForm = (formData: ScheduleData, t: (key: string) => string): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.classId) errors.classId = t("validation.required");
  if (!formData.startDate) errors.startDate = t("validation.required");
  if (!formData.endDate) errors.endDate = t("validation.required");
  if (formData.sessions.length === 0) errors.sessions = "At least one session is required";

  return errors;
};

const validateTempSession = (data: TempSessionData, t: (key: string) => string): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.course) errors.course = t("validation.required");
  if (!data.lecturer) errors.lecturer = t("validation.required");
  if (!data.credits || data.credits <= 0) errors.credits = t("validation.required");

  return errors;
};

// ============================================================================
// Sub-components
// ============================================================================

const BreakTime = memo(() => (
  <tr>
    <td colSpan={8} className="text-center py-2 bg-zinc-100 dark:bg-zinc-800 font-semibold border border-blue-950 dark:border-zinc-700">
      Break Time 10mins
    </td>
  </tr>
));

BreakTime.displayName = "BreakTime";

// ============================================================================
// Main Component
// ============================================================================

const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {
  const { t } = useTranslation();
  const { isOpen: isOpenModal, onOpen, onClose: onCloseModal } = useDisclosure();
  
  // State
  const [formData, setFormData] = useState<ScheduleData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [tempSessionData, setTempSessionData] = useState<TempSessionData>(INITIAL_TEMP_SESSION);
  const [dataClassInfo, setDataClassInfo] = useState<ClassInfo>(INITIAL_CLASS_INFO);

  const id = row?.id ?? null;

  // Hooks
  const { mutate: createSchedule, loading: creating } = useMutation();
  const { mutate: updateSchedule, loading: updating } = useMutation();
  const { data: formLoad } = useFetch<{ classes: any[], courses: any[], lecturers: any[] }>("/schedule/formload");

  useEffect(() => {
    console.log("formLoad", formLoad);
  }, [formLoad]);

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    if (isOpen) {
      if (isEdit && row) {
        setFormData({
          classId: row.class_id, 
          startDate: parseDate(row.start_date),
          endDate: parseDate(row.end_date),
          sessions: row.sessions?.map((session: any) => ({
            day: session.day,
            time_slot: session.time_slot,
            order: session.order,
            course: Number(session.course_id),
            lecturer: Number(session.lecturer_id),
            credits: Number(session.credits),
          })) || [],
        });
        setDataClassInfo({
          field_name_en: row.field_name_en,
          promotion_no: row.promotion_no,
          group: row.group,
          stage: row.stage,
          year: row.year,
          term_no: row.term_no,
          start_date: row.start_date,
          mid_term_start_date: row.mid_term_start_date,
          mid_term_end_date: row.mid_term_end_date,
          final_exam_date: row.final_exam_date,
          new_term_start_date: row.new_term_start_date,
          room_name: row.room_name,
        });
      } else {
        resetForm();
      }
      setErrors({});
      setLoading(false);
    }
  }, [isOpen, row, isEdit]);

  // Update class info when classId changes
  useEffect(() => {
    if (formData.classId && formLoad?.data?.classes) {
      const classDetail = formLoad.data.classes.find((c: any) => c.id === Number(formData.classId));
      if (classDetail) {
        setDataClassInfo((prev) => ({ 
          ...prev,
          promotion_no: classDetail.promotion_no,
          term_no: classDetail.term_no,
          room_name: classDetail.room_name,
          field_name_en: classDetail.faculty_name_en,
        }));
      }
    }
  }, [formData.classId, formLoad?.data?.classes]);

  // ============================================================================
  // Callbacks
  // ============================================================================

  const handleSlotClick = useCallback((time: string, day: string) => {
    const timeSlot = TIME_SLOTS.find(ts => ts.value === time);
    const order = timeSlot?.order || 1;

    setSelectedSlot({ time, day, order });
    
    const existingSession = formData.sessions.find(
      s => s.day === day && s.time_slot === time
    );
    
    if (existingSession) {
      setTempSessionData({
        course: existingSession.course ?? null,
        lecturer: existingSession.lecturer ?? null,
        credits: existingSession.credits ?? null,
      });
    } else {
      setTempSessionData(INITIAL_TEMP_SESSION);
    }
    
    onOpen();
  }, [formData.sessions, onOpen]);

  const handleTempInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
    const { name, value } = e.target;
    setTempSessionData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleDateChange = useCallback((field: string, value: DateValue | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "startDate" && value) {
      setDataClassInfo((prev: any) => ({ 
        ...prev, 
        start_date: formatDateValue(value)
      }));
    }
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: Key } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const onApply = useCallback(async (): Promise<boolean> => {
    const validationErrors = validateTempSession(tempSessionData, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    if (!selectedSlot) return false;

    setFormData(prev => {
      const filteredSessions = prev.sessions.filter(
        s => !(s.day === selectedSlot.day && s.time_slot === selectedSlot.time)
      );

      return {
        ...prev,
        sessions: [
          ...filteredSessions,
          {
            day: selectedSlot.day,
            time_slot: selectedSlot.time,
            order: selectedSlot.order,
            course: tempSessionData.course!,
            lecturer: tempSessionData.lecturer!,
            credits: tempSessionData.credits!,
          }
        ]
      };
    });

    ShowToast({ color: "success", description: "Session added to schedule!" });
    onCloseModal();
    return true;
  }, [tempSessionData, selectedSlot, t, onCloseModal]);

  const resetTempForm = useCallback(() => {
    setTempSessionData(INITIAL_TEMP_SESSION);
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setTempSessionData(INITIAL_TEMP_SESSION);
    setDataClassInfo(INITIAL_CLASS_INFO);
    setErrors({});
    setSelectedSlot(null);
  }, []);

  const onSubmit = useCallback(async (): Promise<boolean> => {
    const validationErrors = validateForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      ShowToast({ color: "danger", description: "Please add at least one session to the schedule" });
      return false;
    }

    const payload = {
      classId: Number(formData.classId),
      startDate: formatDateValue(formData.startDate),
      endDate: formatDateValue(formData.endDate),
      sessions: formData.sessions.map(session => ({
        day: session.day,
        time_slot: session.time_slot,
        order: session.order,
        course: Number(session.course),
        lecturer: Number(session.lecturer),
        credits: Number(session.credits),
      }))
    };

    try {
      setLoading(true);

      if (isEdit) {
        await updateSchedule(`/schedule/${id}`, payload, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createSchedule(`/schedule`, payload, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      if (loadList) await loadList();
      resetForm();
      return true;
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      ShowToast({ color: "danger", description: error.response?.data?.message || t("error.generic") });
      setErrors({ general: t("error.generic") });
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, t, isEdit, updateSchedule, id, createSchedule, loadList, resetForm]);

  const onSaveClose = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (e?.preventDefault) e.preventDefault();
    const success = await onSubmit();
    if (success) {
      onClose(false);
      resetForm();
    }
  }, [onSubmit, onClose, resetForm]);

  const onSaveNew = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (e?.preventDefault) e.preventDefault();
    const success = await onSubmit();
    if (success) resetForm();
  }, [onSubmit, resetForm]);

  const isFormDirty = useCallback((): boolean => {
    return Object.entries(formData).some(([key, value]) => value !== (INITIAL_FORM_DATA as any)[key]);
  }, [formData]);

  const closeForm = useCallback(() => {
    if (isEdit || !isFormDirty()) {
      onClose(false);
    } else {
      onClose(false);
    }
  }, [isEdit, isFormDirty, onClose]);

  // ============================================================================
  // Memoized Values
  // ============================================================================

  const scheduleData = useMemo(() => {
    const display: any = {};
    
    formData.sessions.forEach(session => {
      if (!display[session.time_slot]) {
        display[session.time_slot] = {};
      }
      
      const course = formLoad?.data?.courses?.find((c: any) => c.id === Number(session.course));
      const lecturer = formLoad?.data?.lecturers?.find((l: any) => l.id === Number(session.lecturer));
      
      display[session.time_slot][session.day] = {
        courseName: course?.name_en,
        credits: session.credits,
        room: dataClassInfo.room_name,
        lecturerName: lecturer?.name_en,
        phone: lecturer?.phone_number
      };
    });
    
    return display;
  }, [formData.sessions, formLoad?.data?.courses, formLoad?.data?.lecturers, dataClassInfo.room_name]);

  // ============================================================================
  // Render
  // ============================================================================

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal - Schedule Table View */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Class Schedule"
        size="full"
        onSubmit={onSubmit}
        onSaveClose={onSaveClose}
        onSaveNew={onSaveNew}
        resetForm={resetForm}
        closeForm={closeForm}
        disabledBtn={loading || creating || updating}
        isEdit={isEdit}
      >
        <div className="mx-auto px-20">
          {/* Header info */}
          <ScheduleHeader data={dataClassInfo} />
          
          <div className="grid grid-cols-3 gap-4">
            <Autocomplete
              radius="md"
              size="md"
              label={t("class")}
              labelPlacement="outside"
              name="classId"
              placeholder={t("chooseclass")}
              selectedKey={formData.classId?.toString()}
              isInvalid={!!errors.classId}
              errorMessage={errors.classId}
              className="w-full"
              onSelectionChange={(key) =>
                handleInputChange({
                  target: { name: "classId", value: key ?? "" },
                })
              }
              isRequired
            >
              {formLoad?.data?.classes?.map((item: any) => (
                <AutocompleteItem key={item.id} textValue={item.class_name}>
                  <p className="truncate w-[95%]">{item.class_name}</p>
                </AutocompleteItem>
              ))}
            </Autocomplete>
  
            <DatePicker
              labelPlacement="outside"
              label={t("startDate")}
              name="startDate"
              value={formData.startDate}
              onChange={(val) => handleDateChange("startDate", val)}
              isRequired
              isInvalid={!!errors.startDate}
              errorMessage={errors.startDate}
            />
  
            <DatePicker
              labelPlacement="outside"
              label={t("endDate")}
              name="endDate"
              value={formData.endDate}
              onChange={(val) => handleDateChange("endDate", val)}
              isRequired
              isInvalid={!!errors.endDate}
              errorMessage={errors.endDate}
            />
          </div>

          {/* Schedule Table */}
          <div className="bg-white dark:bg-zinc-800 shadow-lg overflow-hidden mt-6 w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white dark:bg-zinc-800">
                  <th className="py-2 px-4 text-center font-bold border border-blue-950 text-blue-950 dark:border-zinc-700 dark:text-zinc-100">
                    Time
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="py-2 px-4 text-center font-bold border border-blue-950 text-blue-950 dark:border-zinc-700 dark:text-zinc-100"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((timeSlot, idx) => {
                  const isFirstSlot = idx === 0;
                  
                  return (
                    <React.Fragment key={timeSlot.value}>
                      <tr className="bg-white dark:bg-zinc-800">
                        <td className="py-3 px-4 font-semibold text-center border border-blue-950 min-w-40 w-40 dark:border-zinc-700 dark:text-zinc-100">
                          {timeSlot.label}
                        </td>
                        {DAYS.map((day) => {
                          const course = scheduleData[timeSlot.value]?.[day];
                          return (
                            <TimeSlot
                              key={`${timeSlot.value}-${day}`}
                              time={timeSlot.value}
                              day={day}
                              course={course}
                              onSlotClick={handleSlotClick}
                            />
                          );
                        })}
                      </tr>
                      {isFirstSlot && <BreakTime />}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <ScheduleFooter />
        </div>
      </Modal>

      {/* AddClass Modal Component */}
      <AddClass
        isOpen={isOpenModal}
        onClose={onCloseModal}
        onApply={onApply}
        isLoading={loading}
        selectedSlot={selectedSlot}
        tempSessionData={tempSessionData}
        errors={errors}
        formLoad={formLoad}
        handleInputChange={handleInputChange}
        handleTempInputChange={handleTempInputChange}
        resetTempForm={resetTempForm}
      />
    </>
  );
};

export default memo(Form);