import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem } from "@/components/hero-ui";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@/god-ui";
import { Button, Divider, Spinner } from "@heroui/react";
import { MdFilterTiltShift } from "react-icons/md";
import { GrClear } from "react-icons/gr";
import { useState } from "react";

type ApiType = {
  id: number;
  course_name_en: string;
  day_of_week: string;
  room_name: string;
  time_slots: string;
}

type Filter = {
  course: string;
};

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  formLoad: any;
  formLoadLoading: boolean;
  filterLoading: boolean;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  formLoad,
  formLoadLoading,
  filterLoading,
}: FilterProps) => {
  const { t } = useTranslation();

  const courses = formLoad?.data?.courses;

  const [details, setDetails] = useState({
    course: "",
    dayOfWeek: "",
    room: "",
    timeSlots: "",
  });

  const handleSelectChange = (key: string) => {
    setFilter((prev) => ({
      ...prev,
      course: key,
    }));
    const selected = courses?.find((u: ApiType) => u.id === Number(key));
    setDetails({
      course: selected?.course_name_en ?? "",
      dayOfWeek: selected?.day_of_week ?? "",
      room: selected?.room_name ?? "",
      timeSlots: selected?.time_slots ?? "",
    });
  };


  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xs" radius="none" backdrop="transparent" shadow="none">
      <DrawerHeader>
        <h2 className="text-lg font-semibold">{t("filter")}</h2>
      </DrawerHeader>
      <DrawerContent>
        <DrawerBody>
          <form className="space-y-4">
            {/* General */}
            <div>
              <div className="grid grid-cols-1 gap-2">

                {/* details  */}
                <div className="">
                  <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                    {t("details")}
                  </h3>
                  <Divider className="mb-4" />
                  <div className="grid grid-cols-1 gap-2 *:text-sm *:text-zinc-500 *:dark:text-zinc-300">
                    <div className="flex items-center justify-between">
                      <p className="text-start">{t("course")} : </p>
                      <span className="text-end text-zinc-500 dark:text-zinc-400">{details.course || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-start">{t("dayOfWeek")} : </p>
                      <span className="text-end text-zinc-500 dark:text-zinc-400">{details.dayOfWeek || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-start">{t("room")} : </p>
                      <span className="text-end text-zinc-500 dark:text-zinc-400">{details.room || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-start">{t("timeSlots")} : </p>
                      <span className="text-end text-zinc-500 dark:text-zinc-400">{details.timeSlots || '-'}</span>
                    </div>
                  </div>
                </div>
                <Divider className="mb-4" />
                <Autocomplete
                  label={t("course")}
                  placeholder={t("chooseCourse")}
                  selectedKey={filter.course ?? ""}
                  isClearable
                  onSelectionChange={(key: any) => handleSelectChange(key)}
                  labelPlacement="outside"
                  isLoading={formLoadLoading}
                >
                  {courses?.map((u: ApiType) => (
                    <AutocompleteItem key={u.id} description={`${u.day_of_week}, ${u.room_name}, ${u.time_slots}`}>{u.course_name_en}</AutocompleteItem>
                  ))}
                </Autocomplete>

              </div>
            </div>
          </form>
        </DrawerBody>
      </DrawerContent>
      <DrawerFooter>
        <Button
          onPress={onResetFilter}
          size="sm"
          variant="flat"
          color="danger"
          startContent={<GrClear size={16} />}
        >
          {t("reset")}
        </Button>
        <Button
          onPress={onApplyFilter}
          size="sm"
          variant="solid"
          color="primary"
          isLoading={filterLoading}
          startContent={!filterLoading && <MdFilterTiltShift size={16} /> }
          spinner={
            <Spinner size="sm" color="white" variant="spinner"/>
          }
        >
          {t("apply")}
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};

export default Filter;