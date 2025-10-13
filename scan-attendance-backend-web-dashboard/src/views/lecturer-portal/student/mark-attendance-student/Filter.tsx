import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem } from "@/components/hero-ui";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@/god-ui";
import { Button, Checkbox, Divider, Spinner } from "@heroui/react";
import { MdFilterTiltShift } from "react-icons/md";
import { GrClear } from "react-icons/gr";
import { useDebounce } from "@/hooks/useDebounce"; 
import { GoClock } from "react-icons/go";


// === Types ===

type ApiType = {
  id: number;
  course_name_en: string;
  day_of_week: string;
  room_name: string;
  time_slots: string;
};

type Filter = {
  course: string;
  session: string;
};

type Details = {
  course: string;
  dayOfWeek: string;
  room: string;
  timeSlots: string;
  session: string;
  totalStudents: number;
};

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  formLoad: any;
  filterLoading: boolean;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  formLoad,
  filterLoading,
  errors,
  setErrors,
}: FilterProps) => {
  const { t } = useTranslation();
  const [autoFilterValue, setAutoFilterValue] = useState<boolean>(false);
  const [details, setDetails] = useState<Details>({
    course: "",
    dayOfWeek: "",
    room: "",
    timeSlots: "",
    session: "",
    totalStudents: 0,
  });

  const courses = formLoad?.data?.courses;
  const sessions = formLoad?.data?.sessions;

  // 1. Debounce the filter state
  const debouncedFilter = useDebounce(filter, 300);

  // 2. Apply filter automatically when debouncedFilter changes
  useEffect(() => {
    if (autoFilterValue) {
      onApplyFilter();
    }
  }, [debouncedFilter, autoFilterValue]);

  const handleSelectChange = (key: string, field: keyof Filter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
    setErrors({});

    if (field === "course") {
      const selected = courses?.find((c: ApiType) => c.id === Number(key));
      setDetails({
        course: selected?.course_name_en ?? "",
        dayOfWeek: selected?.day_of_week ?? "",
        room: selected?.room_name ?? "",
        timeSlots: selected?.time_slots ?? "",
        session: selected?.session ?? "",
        totalStudents: selected?.total_student ?? 0,
      });
    }
  };

 
  

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xs" radius="none" backdrop="transparent" shadow="none">
      <DrawerHeader>
        <h2 className="text-lg font-semibold">{t("filter")}</h2>
      </DrawerHeader>
      <DrawerContent>
        <DrawerBody>
          <form className="space-y-4">
            
            {/* Details */}
            <div className="space-y-2">
              <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">{t("details")}</h3>
              <Divider />
              <div className="grid grid-cols-1 gap-2 text-sm text-zinc-500 dark:text-zinc-300">
                <div className="flex justify-between"><span>{t("course")}:</span> <span>{details.course || '-'}</span></div>
                <div className="flex justify-between"><span>{t("dayOfWeek")}:</span> <span>{details.dayOfWeek || '-'}</span></div>
                <div className="flex justify-between"><span>{t("room")}:</span> <span>{details.room || '-'}</span></div>
                <div className="flex justify-between"><span>{t("timeSlots")}:</span> <span>{details.timeSlots || '-'}</span></div>
                <div className="flex justify-between"><span>{t("session")}:</span> <span>{details.session || '-'}</span></div>
                <div className="flex justify-between"><span>{t("totalStudents")}:</span> <span>{details.totalStudents || '-'} {t("student")}</span></div>
              </div>
            </div>

            <Divider />

            {/* Autocomplete Filters */}
            <Autocomplete
              label={t("course")}
              placeholder={t("chooseCourse")}
              selectedKey={filter.course ?? ""}
              isClearable
              onSelectionChange={(key: any) => handleSelectChange(key, "course")}
              labelPlacement="outside"
              isLoading={filterLoading}
              isDisabled={filterLoading}
            >
              {courses?.map((c: ApiType) => (
                <AutocompleteItem key={c.id} description={`${c.day_of_week}, ${c.room_name}, ${c.time_slots}`}>
                  {c.course_name_en}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Autocomplete
              label={t("session")}
              placeholder={t("chooseSession")}
              selectedKey={filter.session ?? ""}
              isClearable
              onSelectionChange={(key: any) => handleSelectChange(key, "session")}
              labelPlacement="outside"
              isLoading={filterLoading}
              isDisabled={filterLoading}
              defaultSelectedKey={filter.session}
              isInvalid={!!errors.session}
              errorMessage={errors.session}
              isRequired

            >
              {sessions?.map((s: { value: string; label: string }) => (
                <AutocompleteItem key={s.value} startContent={<GoClock />}>{s.label}</AutocompleteItem>
              ))}
            </Autocomplete>
          </form>
        </DrawerBody>
      </DrawerContent>
      <DrawerFooter>
        <div className="flex items-center justify-between w-full">
          <Checkbox isSelected={autoFilterValue} onValueChange={setAutoFilterValue}>
            {t("auto")}
          </Checkbox>
          <div className="flex items-center gap-2">
            <Button onPress={onResetFilter} size="sm" variant="flat" color="danger" startContent={<GrClear size={16} />}>
              {t("reset")}
            </Button>
            <Button
              onPress={onApplyFilter}
              size="sm"
              variant="solid"
              color="primary"
              isLoading={filterLoading}
              startContent={!filterLoading && <MdFilterTiltShift size={16} />}
              spinner={<Spinner size="sm" color="white" variant="spinner" />}
            >
              {t("apply")}
            </Button>
          </div>
        </div>
      </DrawerFooter>
    </Drawer>
  );
};

export default Filter;
