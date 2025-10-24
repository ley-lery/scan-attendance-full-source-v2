import { useTranslation } from "react-i18next";
import { AutocompleteUI } from "@/components/hero-ui";
import { DrawerFilter } from "@/components/ui";
import { Divider, Radio, RadioGroup } from "@heroui/react";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useMemo, useState } from "react";

interface FilterData {
  classId: number | null,
  course: number | null,
  status: string | null,
  page: number,
  limit: number
}

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
}: FilterProps) => {


  const { t } = useTranslation();
  const [list, setList] = useState<any>({
    classes: [],
    courses: [],
  });

  // ==== Fetch Data with useFetch ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<any>(
    "/student/classattendance/formload"
  );

  // ==== Get list from form load ====
  useEffect(() => {
    console.log(formLoad, "formLoad");
    if (formLoad) {
      setList({
        classes: formLoad.data.classes,
        courses: formLoad.data.courses,
      });
    }
  }, [formLoad]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
      const { name, value } = e.target;
      setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // ==== Event Handlers ====
  const handleSelectChange = (key: any, field: keyof FilterData) => {
    setFilter((prev) => {
      const updated = { ...prev, [field]: key };

      if (field === "classId") {
        updated.course = null;
      }
      return updated;
    });
  };

  
  const filteredCourses = useMemo(() => list.courses?.filter((co: any) =>  co.class_id === Number(filter.classId)),
    [list.courses, filter.classId]
  );



  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading || formLoadLoading} loadingType="regular" hideIconLoading={false} isAutoFilter={true}>
      <form className="space-y-4">
        {/* General */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("general")}
          </h3>
          <Divider className="mb-4" />
          <div className="grid grid-cols-1 gap-2">
            <AutocompleteUI
              name="classId"
              label={t("class")}
              placeholder={t("chooseClass")}
              options={list.classes}
              optionLabel="label_1"
              secondaryOptionLabel="label_2"
              optionValue="id"
              selectedKey={filter.classId}
              onSelectionChange={(key: any) => handleSelectChange(key, "classId")}
            />
            <AutocompleteUI
              name="course"
              label={t("course")}
              placeholder={t("chooseCourse")}
              options={filteredCourses}
              optionLabel="label_1"
              secondaryOptionLabel="label_2"
              optionValue="id"
              selectedKey={filter.course}
              onSelectionChange={(key: any) => handleSelectChange(key, "course")}
            />
            <RadioGroup 
              className="flex" 
              classNames={{ label: "text-sm translate-y-2" }} 
              orientation="horizontal" 
              label={t("classStatus")}
              name="status"
              value={filter.status}
              onChange={handleInputChange}

            >
            {["Active", "Inactive"].map((status) => (
              <div key={status} className="flex items-center gap-2">
                <Radio value={status} color={status === "Active" ? "primary" : "danger"}>{status}</Radio>
              </div>
            ))}
          </RadioGroup>
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;