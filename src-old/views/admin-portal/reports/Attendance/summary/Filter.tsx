import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem, Input, InputNumber } from "@/components/hero-ui";
import { Checkbox, CheckboxGroup, Divider } from "@heroui/react";
// import { type DateValue } from "@internationalized/date";
import { DrawerFilter } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { useEffect } from "react";

const termList = [
  {
    id: "1",
    name: "Term 1",
  },
  {
    id: "2",
    name: "Term 2",
  },
]

type FilterData = {
  classId?: number | null,
  course?: number | null,
  student?: number | null,
  faculty?: number | null,
  field?: number | null,
  promotionNo?: number | null,
  termNo?: number | null,
  minAttendancePercentage?: number | null,
  maxAttendancePercentage?: number | null,
  showAtRiskOnly?: any,
  page?: number,
  limit?: number,
}


interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
  offAutoClose?: boolean;
  setOffAutoClose?: (value: boolean) => void;
}

const Filter = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
  offAutoClose = false,
  setOffAutoClose = () => {},
}: FilterProps) => {
  const { t } = useTranslation();

  // ==== Fetch Data with useFetch ====
  const { data: formLoad, loading: formLoadLoading } = useFetch<any>(
    "/reports/attendance-report/summary/formload"
  );

  useEffect(() => {
    console.log(formLoad, 'formLoad')
  }, [formLoad]);

  

  // const handleDateChange = (field: keyof FilterData, value: DateValue | null) => {
  //   setFilter((prev: FilterData) => ({ ...prev, [field]: value }));
  // };

  return (
    <DrawerFilter isOpen={isOpen} onClose={onClose} title="filter" onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} filterLoading={filterLoading} isLoading={filterLoading || formLoadLoading} loadingType="regular" hideIconLoading={false} isAutoFilter={true} offAutoClose={offAutoClose} setOffAutoClose={setOffAutoClose}>
      <form className="space-y-4">
        {/* Date & Time */}
        {/* <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("dateTimeRange")}
          </h3>
          <Divider className="mb-2" />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label={t("startDate")}
              value={filter.startDate}
              onChange={(val) => handleDateChange("startDate", val)}
              maxValue={filter.endDate}
              labelPlacement="outside"
              showMonthAndYearPickers
              size="sm"
              classNames={{
                selectorIcon: "text-sm",
                selectorButton: "p-0",
              }}
            />
            <DatePicker
              label={t("endDate")}
              value={filter.endDate}
              onChange={(val) => handleDateChange("endDate", val)}
              minValue={filter.startDate}
              labelPlacement="outside"  
              showMonthAndYearPickers
              size="sm"
              classNames={{
                selectorIcon: "text-sm",
                selectorButton: "p-0",
              }}
            />
          </div>
        </div> */}
        {/* General */}
        <div>
          <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {t("general")}
          </h3>
          <Divider className="mb-4" />
          <div className="grid grid-cols-1 gap-2">
            <Autocomplete
              label={t("faculty")}
              placeholder={t("chooseFaculty")}
              selectedKey={filter.faculty ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  faculty: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
            >
              {formLoad?.data?.faculties?.map((u: { id: string; name_kh: string, name_en: string }) => (
                <AutocompleteItem key={u.id} classNames={{base: "truncate"}}>{u.name_kh}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label={t("field")}
              placeholder={t("chooseField")}
              selectedKey={filter.field ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  field: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
            >
              {formLoad?.data?.fields?.map((u: { id: string; field_name_kh: string, faculty_name_en: string }) => (
                <AutocompleteItem key={u.id} classNames={{base: "truncate"}}>{u.field_name_kh}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label={t("class")}
              placeholder={t("chooseClass")}
              selectedKey={filter.classId ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  classId: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
            >
              {formLoad?.data?.classes?.map((u: { id: string; class_name: string }) => (
                <AutocompleteItem key={u.id}>{u.class_name}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label={t("course")}
              placeholder={t("chooseCourse")}
              selectedKey={filter.course ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  course: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
            >
              {formLoad?.data?.courses?.map((u: { id: string; name_kh: string, name_en: string }) => (
                <AutocompleteItem key={u.id}>{u.name_kh}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label={t("student")}
              placeholder={t("chooseStudent")}
              selectedKey={filter.student ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  student: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
            >
              {formLoad?.data?.students?.map((u: { id: string; name_kh: string, name_en: string }) => (
                <AutocompleteItem key={u.id}>{u.name_kh}</AutocompleteItem>
              ))}
            </Autocomplete>
            <Autocomplete
              label={t("term")}
              placeholder={t("chooseTerm")}
              selectedKey={filter.termNo ?? ""}
              isClearable
              onSelectionChange={(key) =>
                setFilter((prev: any) => ({
                  ...prev,
                  termNo: key?.toString() || null,
                }))
              }
              labelPlacement="outside"
              size="sm"
            >
              {termList?.map((u: { id: string; name: string }) => (
                <AutocompleteItem key={u.id}>{u.name}</AutocompleteItem>
              ))}
            </Autocomplete>
            {/* <InputNumber
              label={t("promotionNo")}
              placeholder={t("enterPromotionNo")}
              value={filter.promotionNo}
              onChange={(e) =>
                setFilter((prev: any) => ({
                  ...prev,
                  promotionNo: e.target.value,
                }))
              }
              labelPlacement="outside"
              size="sm"
            /> */}
            <Checkbox 
              isSelected={filter.showAtRiskOnly}
              onValueChange={() =>
                setFilter((prev: any) => ({
                  ...prev,
                  showAtRiskOnly: !filter.showAtRiskOnly,
                }))
              }
            >
              {t("showAtRiskOnly")}
            </Checkbox>
          </div>
        </div>
      </form>
    </DrawerFilter>
  );
};

export default Filter;