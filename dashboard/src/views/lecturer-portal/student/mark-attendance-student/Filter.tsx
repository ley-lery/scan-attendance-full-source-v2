import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI } from "@/components/hero-ui";
import { Divider } from "@heroui/react";
import { DrawerFilter } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";

// === Types ===

type ApiType = {
  id: number;
  course_name_en: string;
  day_of_week: string;
  room_name: string;
  time_slots: string;
};

type DataFilter = {
  course: number
  session: number
  classStudentStatus: string | null
  transferred: number | null
  page: number
  limit: number
}

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
  filter: DataFilter;
  setFilter: React.Dispatch<React.SetStateAction<DataFilter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
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
  filterLoading,
  errors,
  setErrors,
}: FilterProps) => {

  const { t } = useTranslation();
  const [list, setList] = useState<any>({
    courses: [],
    sessions: [],
    classStudentStatus: [],
    transferred: [],
  });
  const [details, setDetails] = useState<Details>({
    course: "",
    dayOfWeek: "",
    room: "",
    timeSlots: "",
    session: "",
    totalStudents: 0,
  });

  // ==== Form Load ====
  const { data: formLoad } = useFetch<{ courses: any[] }>(
    "/lecturer/markattstudent/formload"
  );
  
  // ==== Get list from form load ====
  useEffect(() => {
    if (formLoad) {
      setList({
        courses: formLoad?.data?.courses,
        sessions: formLoad?.data?.sessions,
        classStudentStatus: formLoad?.data?.classStudentStatus,
        transferred: formLoad?.data?.transferred,
      });
    }
  }, [formLoad]);
  
  const handleSelectChange = (key: string, field: keyof DataFilter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
    setErrors({});

    if (field === "course") {
      const selected = list.courses?.find((c: ApiType) => c.id === Number(key));
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



  // if (!isOpen) return null;

  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading} loadingType="regular" hideIconLoading={false} isAutoFilter={true}>
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
        <AutocompleteUI
          name="course"
          label={t("course")}
          placeholder={t("chooseCourse")}
          options={list.courses}
          optionLabel="course_name_en"
          optionValue="id"
          selectedKey={filter.course}
          onSelectionChange={(key: any) => handleSelectChange(key, "course")}
        />

        <AutocompleteUI
          name="session"
          label={t("session")}
          placeholder={t("chooseSession")}
          options={list.sessions}
          optionLabel="label"
          optionValue="value"
          selectedKey={filter.session}
          onSelectionChange={(key: any) => handleSelectChange(key, "session")}
        />
        <AutocompleteUI
            name="classStudentStatus"
            label={t("classStudentStatus")}
            placeholder={t("chooseClassStudentStatus")}
            options={list.classStudentStatus}
            optionLabel="label"
            optionValue="value"
            selectedKey={filter.classStudentStatus}
            onSelectionChange={(key: any) => handleSelectChange(key, "classStudentStatus")}
          />
          <AutocompleteUI
            name="transferred"
            label={t("transferred")}
            placeholder={t("chooseTransferred")}
            options={list.transferred}
            optionLabel="label"
            optionValue="value"
            selectedKey={String(filter.transferred)}
            onSelectionChange={(key: any) => handleSelectChange(key, "transferred")}
          />
      </form>
    </DrawerFilter>
  );
};

export default Filter;
