import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutocompleteUI, Button, DatePicker, DateRangePickerUI } from "@/components/hero-ui";
import { useFetch } from "@/hooks/useFetch";
import { FilterPopover } from "@/components/ui";
import { type DateValue } from "@internationalized/date";
import type { RangeValue } from "@heroui/react";

// === Types ===

type FormLoad = {
  lecturers: any[];
  users: any[];
  statuses: any[];
};


interface DataFilter {
  lecturer?: number | null; // lecturer_id
  status?: string | null; 
  startDate?: DateValue | null;
  endDate?: DateValue | null; 
  requestDate?: DateValue | null; 
  approvedByUser?: number | null; // approved_by_user_id
  deleted?: boolean | number | null ;
  search?: string | null;
  page?: number;
  limit?: number;
}


interface FilterProps {
  filter: DataFilter;
  setFilter: React.Dispatch<React.SetStateAction<DataFilter>>;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
}
const initialDateRange: RangeValue<DateValue | null> = {
  start: null,
  end: null,
}

const FilterData = ({
  filter,
  setFilter,
  onApplyFilter,
  onResetFilter,
  filterLoading,
}: FilterProps) => {
  const { t } = useTranslation();
  const [appliedFilter, setAppliedFilter] = useState<DataFilter>(filter);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue | null>>(initialDateRange);
  
  const [list, setList] = useState<any>({
    lecturers: [],
    users: [],
    statuses: [],
  });


  // ==== Load form data ====
  const { data: formLoad } = useFetch<FormLoad>("/admin/lecturer/leavereq/formload");

  useEffect(() => {
    if (formLoad) {
      setList({
        lecturers: formLoad?.data?.lecturers,
        users: formLoad?.data?.users,
        statuses: formLoad?.data?.status,
      });
    }
  }, [formLoad]);

  // ==== Event Handler ==== 
  const handleSelectChange = (key: string, field: keyof DataFilter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };
  const handleDateChange = (field: keyof DataFilter, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };
  const handleDateRangeChange = (value: RangeValue<DateValue | null>) => {
    setDateRange(value);
    setFilter((prev) => ({
      ...prev,
      startDate: value.start,
      endDate: value.end,
    }));
  };
  const handleClearDateRange = () => {
    setDateRange(initialDateRange);
    setFilter((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };
  const handleClearFilter = (key: any, field: keyof DataFilter) => {
    setFilter((prev) => ({ ...prev, [field]: key }));
  };
  
  const handleApplyFilter = () => {
    setAppliedFilter(filter);
    onApplyFilter();
  };

  const handleResetFilter = () => {
    setAppliedFilter(filter);
    onResetFilter();
  };




  return (
    <form className="flex items-center gap-1">
      <>
        <FilterPopover
          triggerText={t("requestDate")}
          field="requestDate"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => handleClearFilter(key, "requestDate")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.requestDate}
          header={t("requestDate")}
        >
          <DatePicker
            value={filter.requestDate}
            onChange={(val) => handleDateChange("requestDate", val)}
            labelPlacement="outside"
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("dateRange")}
          field="dateRange"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => {
            handleClearFilter(key, "startDate");
            handleClearFilter(key, "endDate");
            handleClearDateRange();
          }}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.startDate || !!appliedFilter.endDate}
          header={t("dateRange")}
          classNames={{
            content: "grid grid-cols-1 gap-1",
            popoverContent: "min-w-62",
          }}
        >
          <DateRangePickerUI
            value={dateRange as RangeValue<DateValue>}
            onChange={(value: RangeValue<DateValue | null> | null) => handleDateRangeChange(value as RangeValue<DateValue>)} 
            visibleMonths={2}
          /> 
          {/* <DatePicker
            label={t("startDate")}
            value={filter.startDate}
            onChange={(val) => handleDateChange("startDate", val)}
            maxValue={filter.endDate}
            labelPlacement="outside"
            
          />
          <DatePicker
            label={t("endDate")}
            value={filter.endDate}
            onChange={(val) => handleDateChange("endDate", val)}
            minValue={filter.startDate}
            labelPlacement="outside"
          /> */}
        </FilterPopover>
        <FilterPopover
          triggerText={t("lecturer")}
          field="lecturer"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => handleClearFilter(key, "lecturer")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.lecturer}
          header={t("lecturer")}
        >
          <AutocompleteUI
            name="lecturer"
            label={t("lecturer")}
            placeholder={t("chooseLecturer")}
            options={list.lecturers}
            optionLabel="name_en"
            secondaryOptionLabel="name_kh"
            optionValue="id"
            selectedKey={filter.lecturer}
            onSelectionChange={(key: any) => handleSelectChange(key, "lecturer")}
          />
        </FilterPopover>
        <FilterPopover
          triggerText={t("approvedByUser")}
          field="approvedByUser"
          onApplyFilter={handleApplyFilter}
          handleClearFilter={(key: any) => handleClearFilter(key, "approvedByUser")}
          filterLoading={filterLoading}
          isActive={!!appliedFilter.approvedByUser}
          header={t("approvedByUser")}
        >
            <AutocompleteUI
              name="approvedByUser"
              placeholder={t("chooseApprovedByUser")}
              options={list.users}
              optionLabel="label"
              optionValue="id"
              selectedKey={filter.approvedByUser}
              onSelectionChange={(key: any) => handleSelectChange(key, "approvedByUser")}
            />
        </FilterPopover>
        <FilterPopover
            triggerText={t("status")}
            field="status"
            onApplyFilter={handleApplyFilter}
            handleClearFilter={(key: any) => handleClearFilter(key, "status")}
            filterLoading={filterLoading}
            isActive={!!appliedFilter.status}
            header={t("status")}
        >
            <AutocompleteUI
              name="status"
              label={t("status")}
              placeholder={t("chooseStatus")}
              options={list.statuses}
              optionLabel="label"
              optionValue="value"
              selectedKey={filter.status}
              onSelectionChange={(key: any) => handleSelectChange(key, "status")}
            />
           
        </FilterPopover>
       
        {/* <FilterPopover
            triggerText={t("deleted")}
            field="deleted"
            onApplyFilter={handleApplyFilter}
            handleClearFilter={(key: any) => handleClearFilter(key, "deleted")}
            filterLoading={filterLoading}
            isActive={!!appliedFilter.deleted}
            header={t("deleted")}
            classNames={{
              content: "pl-4",
            }}
        >
            <Checkbox
              isSelected={filter.deleted as boolean}
              onValueChange={(val: any) => handleCheckboxChange("deleted", val)}
            >
              {t("deleted")}
            </Checkbox>
        </FilterPopover> */}
      </>

      {/* Action Buttons */}
      <div className="flex gap-1 ml-auto border-l border-black/10 dark:border-white/10 pl-2">
        <Button type="button" onClick={handleResetFilter} variant="flat" color="danger" radius="full" size="sm">
          {t("reset")}
        </Button>
      </div>
    </form>
  );
};

export default FilterData;