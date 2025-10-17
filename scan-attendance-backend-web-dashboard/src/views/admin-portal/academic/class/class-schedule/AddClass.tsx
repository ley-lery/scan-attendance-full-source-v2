/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteUI, Modal } from "@/components/hero-ui";
import { type Key } from "react";
import { useTranslation } from "react-i18next";

const credits = [
  {key: "1", label: "1"},
  {key: "2", label: "2"},
  {key: "3", label: "3"},
  {key: "4", label: "4"},
  {key: "5", label: "5"},
  {key: "6", label: "6"},
];

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

  if (!isOpen) return null;

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

        <div className="grid grid-cols-3 gap-4">
          <AutocompleteUI
            name="lecturer"
            label={t("lecturer")}
            placeholder={t("chooselecturer")}
            options={formLoad?.data?.lecturers}
            optionLabel="name_en"
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
            options={formLoad?.data?.courses}
            optionLabel="name_en"
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

        {errors.general && (
          <p className="text-danger text-sm">{errors.general}</p>
        )}
      </div>
    </Modal>
  );
};

export default AddClass;