import { AutocompleteUI, Modal } from "@/components/hero-ui";
import { useEffect, type Key } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, CheckboxGroup } from "@heroui/react";

const credits = [
  {key: "1", label: "1"},
  {key: "2", label: "2"},
  {key: "3", label: "3"},
  {key: "4", label: "4"},
  {key: "5", label: "5"},
  {key: "6", label: "6"},
];

const TIME_SLOTS = [
  { value: "6:00-7:30", label: "6:00-7:30 PM", order: 1 },
  { value: "7:45-9:15", label: "7:45-9:15 PM", order: 2 },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Props {
  onApply: () => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  selectedSlot: { day: string; time: string; order: number } | null;
  tempSessionData: {
    course: number | null;
    lecturer: number | null;
    credits: number | null;
  };
  selectedTimeSlots?: string[];
  selectedDay?: string;
  errors: Record<string, string>;
  formLoad?: {
    data?: {
      classes?: any[];
      courses?: any[];
      lecturers?: any[];
    };
  };
  handleInputChange: (e: { target: { name: string; value: Key } }) => void;
  handleTempInputChange: (e: { target: { name: string; value: Key } }) => void;
  handleTimeSlotsChange?: (slots: string[]) => void;
  handleDayChange?: (day: string) => void;
  resetTempForm: () => void;
  isEditMode?: boolean;
}

const AddClass = ({
  onApply,
  isOpen,
  onClose,
  isLoading,
  selectedSlot,
  tempSessionData,
  selectedTimeSlots = [],
  selectedDay,
  errors,
  formLoad,
  handleTempInputChange,
  handleTimeSlotsChange,
  handleDayChange,
  resetTempForm,
  isEditMode = false,
}: Props) => {

  const filteredCourses = formLoad?.data?.courses?.filter((course: any) => {
    if (!tempSessionData.lecturer) return true;
    return Number(course.lecturer_id) === Number(tempSessionData.lecturer);
  });

  useEffect(() => {
    console.log(selectedTimeSlots, 'selectedTimeSlots');
  }, [selectedTimeSlots]);

  

  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <Modal
      onSubmit={onApply}
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Schedule Slot" : "Add to Schedule"}
      size="3xl"
      onSaveClose={onApply}
      resetForm={resetTempForm}
      closeForm={onClose}
      disabledBtn={isLoading}
    >
      <div className="space-y-4">


        <div className="space-y-4">
          {/* Day Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Day <span className="text-danger">*</span>
              {isEditMode && <span className="text-xs text-zinc-500 ml-2">(You can change the day)</span>}
            </label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayChange?.(day)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDay === day
                      ? "bg-primary text-white shadow-md"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            {errors.day && (
              <p className="text-danger text-sm mt-1">{errors.day}</p>
            )}
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Time Slot(s) <span className="text-danger">*</span>
              {isEditMode && <span className="text-xs text-zinc-500 ml-2">(You can change or add more time slots)</span>}
            </label>
            <CheckboxGroup
              value={selectedTimeSlots}
              onValueChange={(values) => handleTimeSlotsChange?.(values as string[])}
              classNames={{
                wrapper: "gap-2"
              }}
            >
              {TIME_SLOTS.map((slot) => (
                <>
                  {/* {selectedTimeSlots.includes(slot.value) && !isEditMode && ( */}
                    <Checkbox 
                      key={slot.value} 
                      value={slot.value}
                      classNames={{
                        base: "max-w-full w-full bg-zinc-100 dark:bg-zinc-800 m-0 p-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700",
                        label: "w-full"
                      }}
                      // isReadOnly={selectedTimeSlots.includes(slot.value) }
                    >
                      {slot.label}
                    </Checkbox>
                    {/* )} */}
                </>
              ))}
            </CheckboxGroup>
            {errors.timeSlots && (
              <p className="text-danger text-sm mt-1">{errors.timeSlots}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <AutocompleteUI
            name="lecturer"
            label={t("lecturer")}
            placeholder={t("chooselecturer")}
            options={formLoad?.data?.lecturers}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={tempSessionData.lecturer?.toString()}
            onSelectionChange={(key) =>
              handleTempInputChange({
                target: { name: "lecturer", value: key ?? "" },
              })
            }
            error={errors.lecturer}
            isRequired
          />
          <AutocompleteUI
            name="course"
            label={t("course")}
            placeholder={t("chooseCourse")}
            options={filteredCourses}
            optionLabel="label_1"
            secondaryOptionLabel="label_2"
            optionValue="id"
            selectedKey={tempSessionData.course?.toString()}
            onSelectionChange={(key) =>
              handleTempInputChange({
                target: { name: "course", value: key ?? "" },
              })
            }
            error={errors.course}
            isRequired
          />
          <AutocompleteUI
            name="credits"
            label={t("credits")}
            placeholder={t("chooseCredits")}
            options={credits}
            optionLabel="label"
            optionValue="key"
            selectedKey={tempSessionData.credits?.toString()}
            onSelectionChange={(key) =>
              handleTempInputChange({
                target: { name: "credits", value: key ?? "" },
              })
            }
            error={errors.credits}
            isRequired
          />
        </div>

        {/* {isEditMode && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Note:</span> The original slot will be removed and replaced with your new selection(s).
            </p>
          </div>
        )} */}

        {errors.general && (
          <p className="text-danger text-sm">{errors.general}</p>
        )}
      </div>
    </Modal>
  );
};

export default AddClass;