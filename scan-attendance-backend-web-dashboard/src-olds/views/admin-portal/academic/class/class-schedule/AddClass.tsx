/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, AutocompleteItem, Modal } from "@/components/hero-ui";
import { useMemo, type Key } from "react";
import { useTranslation } from "react-i18next";

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
  resetTempForm: () => void;
}

const AddClass = ({
  onApply,
  isOpen,
  onClose,
  isLoading,
  selectedSlot,
  tempSessionData,
  errors,
  formLoad,
  handleTempInputChange,
  resetTempForm,
}: Props) => {
  const { t } = useTranslation();

  const filteredCourses = useMemo(() => {
    const lecturers = formLoad?.data?.lecturers || [];
    const courses = formLoad?.data?.courses || [];
  
    // if not lecturer selected, return all courses
    if (!tempSessionData.lecturer) return courses;
  
    // convert lecturer to number
    const selectedLecturerId = Number(tempSessionData.lecturer);
  
    // find course_id that matches lecturer
    const lecturerCourseIds = lecturers
      .filter((lec: any) => lec.id === selectedLecturerId && lec.course_id !== null)
      .map((lec: any) => lec.course_id);
  
    // if lecturer has no course_id, return empty array
    if (lecturerCourseIds.length === 0) return [];
  
    // otherwise filter by course_id
    return courses.filter((course: any) => lecturerCourseIds.includes(course.id));
  }, [tempSessionData.lecturer, formLoad?.data]);

  const handleChangeLecturer = (key: Key) => {
    handleTempInputChange({
      target: { name: "lecturer", value: key },
    });
    if (tempSessionData.course) {
      handleTempInputChange({
        target: { name: "course", value: "" },
      });
    }
  };

  

  return (
    <Modal
      onSubmit={onApply}
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Schedule"
      size="3xl"
      onSaveClose={onApply}
      resetForm={resetTempForm}
      closeForm={onClose}
      disabledBtn={isLoading}
    >
      <div className="space-y-4">

        {/* Show selected slot info */}
        {selectedSlot && (
          <div className="flex justify-center">
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl mb-4 w-fit">
              <p className="text-blue-900 dark:text-zinc-400">
                {selectedSlot.day} - {selectedSlot.time}
              </p>
            </div>
          </div>
        )}

        {/* Course, Lecturer, and Credits Selection */}
        <div className="grid grid-cols-3 gap-4">
          {/* Lecturer Selection - Now First */}
          <Autocomplete
            radius="md"
            size="md"
            label={t("lecturer")}
            labelPlacement="outside"
            name="lecturer"
            placeholder={t("chooselecturer")}
            selectedKey={tempSessionData.lecturer?.toString()}
            isInvalid={!!errors.lecturer}
            errorMessage={errors.lecturer}
            className="w-full"
            onSelectionChange={(key: any) => handleChangeLecturer(key)}
            isRequired
          >
            {/* Group lecturers by unique lecturer_id to avoid duplicates */}
            {Array.from(
              new Map(
                formLoad?.data?.lecturers?.map((item: any) => [
                  item.id,
                  item,
                ])
              ).values()
            ).map((item: any) => (
              <AutocompleteItem
                key={item.id}
                textValue={item.name_en + " - " + item.name_kh}
              >
                <p className="truncate w-[95%]">
                  {item.name_en} - {item.name_kh}
                </p>
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* Course Selection - Filtered by Lecturer */}
          <Autocomplete
            radius="md"
            size="md"
            label={t("course")}
            labelPlacement="outside"
            name="course"
            placeholder={t("chooseCourse")}
            selectedKey={tempSessionData.course?.toString()}
            isInvalid={!!errors.course}
            errorMessage={errors.course}
            className="w-full"
            isDisabled={!tempSessionData.lecturer}
            onSelectionChange={(key) =>
              handleTempInputChange({
                target: { name: "course", value: key ?? "" },
              })
            }
            isRequired
          >
            {filteredCourses.map((item: any) => (
              <AutocompleteItem
                key={item.id}
                textValue={item.name_en + " - " + item.name_kh}
              >
                <p className="truncate w-[95%]">
                  {item.name_en} - {item.name_kh}
                </p>
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Autocomplete
            radius="md"
            size="md"
            label={t("credits")}
            labelPlacement="outside"
            name="credits"
            placeholder={t("chooseCredits")}
            selectedKey={tempSessionData.credits?.toString()}
            isInvalid={!!errors.credits}
            errorMessage={errors.credits}
            className="w-full"
            onSelectionChange={(key) =>
              handleTempInputChange({
                target: { name: "credits", value: key ?? "" },
              })
            }
            isRequired
          >
            {[1, 2, 3, 4, 5, 6].map((credit) => (
              <AutocompleteItem key={credit} textValue={credit.toString()}>
                {credit} Credits
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        {errors.general && (
          <p className="text-danger text-sm">{errors.general}</p>
        )}
      </div>
    </Modal>
  );
};

export default AddClass;