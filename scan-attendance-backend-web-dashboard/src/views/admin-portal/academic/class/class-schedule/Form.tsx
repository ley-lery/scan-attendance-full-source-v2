/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteUI, DatePicker, Modal, ShowToast } from "@/components/hero-ui";
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

// ======== types & interfaces ========

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

type ScheduleFormData = {
  id?: number | null; 
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

// ======== constants ========
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const TIME_SLOTS = [
  { value: "6:00-7:30", label: "6:00-7:30 PM", order: 1 },
  { value: "7:45-9:15", label: "7:45-9:15 PM", order: 2 },
] as const;

const INITIAL_FORM_DATA: ScheduleFormData = {
  id: null,
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


// ======== utility functions ========
const validateForm = (formData: ScheduleFormData, t: (key: string) => string): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.classId) errors.classId = t("validation.required");
  if (!formData.startDate) errors.startDate = t("validation.required");
  if (!formData.endDate) errors.endDate = t("validation.required");
  if (formData.sessions.length === 0) errors.sessions = "At least one session is required";

  // // Validate date range
  // if (formData.startDate && formData.endDate) {
  //   const start = new Date(formatDateValue(formData.startDate));
  //   const end = new Date(formatDateValue(formData.endDate));
  //   if (start > end) {
  //     errors.endDate = "End date must be after start date";
  //   }
  // }

  return errors;
};

const validateTempSession = (data: TempSessionData, t: (key: string) => string): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.course) errors.course = t("validation.required");
  if (!data.lecturer) errors.lecturer = t("validation.required");
  if (!data.credits || data.credits <= 0) errors.credits = t("validation.required");

  return errors;
};

const normalizeSessionData = (session: any): SessionWithDetails => ({
  day: session.day,
  time_slot: session.time_slot,
  order: session.order,
  course: session.course_id ? Number(session.course_id) : session.course ? Number(session.course) : undefined,
  lecturer: session.lecturer_id ? Number(session.lecturer_id) : session.lecturer ? Number(session.lecturer) : undefined,
  credits: session.credits ? Number(session.credits) : undefined,
});


// ======== break time component ========
const BreakTime = memo(() => (
  <tr>
    <td colSpan={8} className="text-center py-2 bg-zinc-100 dark:bg-zinc-800 font-semibold border border-blue-950 dark:border-zinc-700">
      Break Time 10mins
    </td>
  </tr>
));

BreakTime.displayName = "BreakTime";


const Form = ({ isOpen = false, onClose, loadList, isEdit, row }: FormProps) => {


  const { t } = useTranslation();
  const { isOpen: isOpenModal, onOpen, onClose: onCloseModal } = useDisclosure();
  
  // State - Unified form data
  const [formData, setFormData] = useState<ScheduleFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [tempSessionData, setTempSessionData] = useState<TempSessionData>(INITIAL_TEMP_SESSION);
  const [dataClassInfo, setDataClassInfo] = useState<ClassInfo>(INITIAL_CLASS_INFO);

  // Hooks
  const { mutate: createSchedule, loading: creating } = useMutation();
  const { mutate: updateSchedule, loading: updating } = useMutation();
  const { data: formLoad } = useFetch<{ classes: any[], courses: any[], lecturers: any[] }>("/schedule/formload");

  // ======== effects ========

  // Initialize form data when modal opens
  useEffect(() => {
    console.log("row", row);
    if (isOpen) {
      if (isEdit && row) {
        // Edit mode: populate form with existing data
        setFormData({
          id: row.id,
          classId: row.class_id,
          startDate: parseDate(row.start_date),
          endDate: parseDate(row.end_date),
          sessions: (row.sessions || []).map(normalizeSessionData),
        });

        setDataClassInfo({
          field_name_en: row.field_name_en || "",
          promotion_no: row.promotion_no || 0,
          group: row.group || "",
          stage: row.stage || "",
          year: row.year || "",
          term_no: row.term_no || 0,
          start_date: row.start_date || "",
          mid_term_start_date: row.mid_term_start_date || "",
          mid_term_end_date: row.mid_term_end_date || "",
          final_exam_date: row.final_exam_date || "",
          new_term_start_date: row.new_term_start_date || "",
          room_name: row.room_name || "",
        });
      } else {
        // Create mode: reset form
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
          promotion_no: classDetail.promotion_no || 0,
          term_no: classDetail.term_no || 0,
          room_name: classDetail.room_name || "",
          field_name_en: classDetail.faculty_name_en || "",
          group: classDetail.group || "",
          stage: classDetail.stage || "",
          year: classDetail.year || "",
        }));
      }
    }
  }, [formData.classId, formLoad?.data?.classes]);

  // ====================
  // Callbacks
  // ====================

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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleDateChange = useCallback((field: "startDate" | "endDate", value: DateValue | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Update class info start date if applicable
    if (field === "startDate" && value) {
      setDataClassInfo((prev: any) => ({ 
        ...prev, 
        start_date: formatDateValue(value)
      }));
    }
    
    // Clear error for this field
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
    
    // Clear error for this field
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
      // Remove existing session at this slot (if any)
      const filteredSessions = prev.sessions.filter(
        s => !(s.day === selectedSlot.day && s.time_slot === selectedSlot.time)
      );

      // Add new session
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
    resetTempForm();
    onCloseModal();
    return true;
  }, [tempSessionData, selectedSlot, t, onCloseModal]);

  const resetTempForm = useCallback(() => {
    setTempSessionData(INITIAL_TEMP_SESSION);
    setSelectedSlot(null);
    // Only clear temp session errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.course;
      delete newErrors.lecturer;
      delete newErrors.credits;
      return newErrors;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setTempSessionData(INITIAL_TEMP_SESSION);
    setDataClassInfo(INITIAL_CLASS_INFO);
    setErrors({});
    setSelectedSlot(null);
  }, []);

  const buildPayload = useCallback(() => {
    const basePayload = {
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

    if (isEdit) {
      // For update, include id but not classId (can't change class)
      return {
        id: Number(formData.id),
        ...basePayload
      };
    } else {
      // For create, include classId
      return {
        classId: Number(formData.classId),
        ...basePayload
      };
    }
  }, [formData, isEdit]);

  const onSubmit = useCallback(async (): Promise<boolean> => {
    // Validate form
    const validationErrors = validateForm(formData, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      ShowToast({ 
        color: "danger", 
        description: validationErrors.sessions || "Please fix the form errors" 
      });
      return false;
    }

    const payload = buildPayload();
    console.log(isEdit ? "Update payload:" : "Create payload:", payload);

    try {
      setLoading(true);

      if (isEdit) {
        await updateSchedule(`/schedule/${formData.id}`, payload, "PUT");
        ShowToast({ color: "success", description: t("updatedSuccess") });
      } else {
        await createSchedule(`/schedule`, payload, "POST");
        ShowToast({ color: "success", description: t("createdSuccess") });
      }

      // Reload list
      if (loadList) await loadList();
      
      return true;
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      const errorMessage = error.response?.data?.message || error.message || t("error.generic");
      ShowToast({ color: "danger", description: errorMessage });
      setErrors({ general: errorMessage });
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, t, isEdit, updateSchedule, createSchedule, loadList, buildPayload]);

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
    if (success) {
      resetForm();
    }
  }, [onSubmit, resetForm]);

  const isFormDirty = useCallback((): boolean => {
    return (
      formData.classId !== INITIAL_FORM_DATA.classId ||
      formData.startDate !== INITIAL_FORM_DATA.startDate ||
      formData.endDate !== INITIAL_FORM_DATA.endDate ||
      formData.sessions.length > 0
    );
  }, [formData]);

  const closeForm = useCallback(() => {
    if (isEdit || !isFormDirty()) {
      onClose(false);
      resetForm();
    } else {
      // Could add confirmation dialog here
      onClose(false);
      resetForm();
    }
  }, [isEdit, isFormDirty, onClose, resetForm]);

  const handleRemoveSession = useCallback((day: string, timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      sessions: prev.sessions.filter(
        s => !(s.day === day && s.time_slot === timeSlot)
      )
    }));
    ShowToast({ color: "warning", description: "Session removed from schedule" });
  }, []);

  // ====================
  // Memoized Values
  // ====================

  const scheduleData = useMemo(() => {
    const display: any = {};
    
    formData.sessions.forEach(session => {
      if (!display[session.time_slot]) {
        display[session.time_slot] = {};
      }
      
      const course = formLoad?.data?.courses?.find((c: any) => c.id === Number(session.course));
      const lecturer = formLoad?.data?.lecturers?.find((l: any) => l.id === Number(session.lecturer));
      
      display[session.time_slot][session.day] = {
        courseName: course?.name_en || "Unknown Course",
        credits: session.credits,
        room: dataClassInfo.room_name,
        lecturerName: lecturer?.name_en || "Unknown Lecturer",
        phone: lecturer?.phone_number || ""
      };
    });
    
    return display;
  }, [formData.sessions, formLoad?.data?.courses, formLoad?.data?.lecturers, dataClassInfo.room_name]);

  const isSubmitDisabled = useMemo(() => {
    return loading || creating || updating;
  }, [loading, creating, updating]);

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal - Schedule Table View */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? "Edit Class Schedule" : "Create Class Schedule"}
        size="full"
        onSubmit={onSubmit}
        onSaveClose={onSaveClose}
        onSaveNew={isEdit ? undefined : onSaveNew}
        resetForm={resetForm}
        closeForm={closeForm}
        disabledBtn={isSubmitDisabled}
        isEdit={isEdit}
        scrollBehavior={true}
      >
        <div className="mx-auto px-20">
          {/* Header info */}
          <ScheduleHeader data={dataClassInfo} />
          
          {/* General error message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
              {errors.general}
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4 py-10">
            <AutocompleteUI
              name="classId"
              label={t("class")}
              placeholder={t("chooseClass")}
              options={formLoad?.data?.classes}
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

          {/* Sessions error */}
          {errors.sessions && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.sessions}
            </div>
          )}

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
                              onRemove={handleRemoveSession}
                              isEmpty={true}
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