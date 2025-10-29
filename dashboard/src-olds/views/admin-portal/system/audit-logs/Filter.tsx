import { useTranslation } from "react-i18next";
import { Autocomplete, AutocompleteItem, DatePicker } from "@/components/hero-ui";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@/god-ui";
import { Button, Divider } from "@heroui/react";
import { type DateValue } from "@internationalized/date";
import { MdFilterTiltShift } from "react-icons/md";
import { GrClear } from "react-icons/gr";

type AuditLog = {
  action: string;
  tableName: string;
  user: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
  startTime: string | null;
  endTime: string | null;
  clientIp: string;
};

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filter: AuditLog;
  setFilter: React.Dispatch<React.SetStateAction<AuditLog>>;
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

  const handleDateChange = (field: keyof AuditLog, value: DateValue | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xs" radius="none" backdrop="transparent" shadow="none">
      <DrawerHeader>
        <h2 className="text-lg font-semibold">{t("filter")}</h2>
      </DrawerHeader>
      <DrawerContent>
        <DrawerBody>
          <form className="space-y-4">
            {/* Date & Time */}
            <div>
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
                  size="sm"
                  classNames={{
                    selectorIcon: "text-sm",
                    selectorButton: "p-0",
                  }}
                />
              </div>
            </div>
            {/* General */}
            <div>
              <h3 className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                {t("general")}
              </h3>
              <Divider className="mb-4" />
              <div className="grid grid-cols-1 gap-2">
                <Autocomplete
                  label={t("table")}
                  placeholder={t("chooseTable")}
                  selectedKey={filter.tableName ?? ""}
                  isClearable
                  onSelectionChange={(key) =>
                    setFilter((prev) => ({
                      ...prev,
                      tableName: key?.toString() || "",
                    }))
                  }
                  labelPlacement="outside"
                  size="sm"
                  isLoading={formLoadLoading}
                >
                  {formLoad?.data?.tableList?.map((u: { value: string; label: string }) => (
                    <AutocompleteItem key={u.value}>{u.label}</AutocompleteItem>
                  ))}
                </Autocomplete>

                <Autocomplete
                  label={t("action")}
                  placeholder={t("chooseAction")}
                  selectedKey={filter.action ?? ""}
                  isClearable
                  onSelectionChange={(key) =>
                    setFilter((prev) => ({
                      ...prev,
                      action: key?.toString() || "",
                    }))
                  }
                  labelPlacement="outside"
                  size="sm"
                >
                  {formLoad?.data?.actionList?.map((a: { value: string; label: string }) => (
                    <AutocompleteItem key={a.value}>{a.label}</AutocompleteItem>
                  ))}
                </Autocomplete>

                <Autocomplete
                  label={t("user")}
                  placeholder={t("chooseUser")}
                  selectedKey={filter.user ?? ""}
                  isClearable
                  onSelectionChange={(key) =>
                    setFilter((prev) => ({
                      ...prev,
                      user: key?.toString() || null,
                    }))
                  }
                  labelPlacement="outside"
                  size="sm"
                  isLoading={formLoadLoading}
                >
                  {formLoad?.data?.users?.map((u: { id: string; username: string }) => (
                    <AutocompleteItem key={u.id}>{u.username}</AutocompleteItem>
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
          startContent={<MdFilterTiltShift size={16} />}
        >
          {t("apply")}
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};

export default Filter;