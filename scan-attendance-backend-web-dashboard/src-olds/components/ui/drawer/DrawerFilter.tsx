import { Drawer, DrawerHeader, DrawerContent, DrawerBody, DrawerFooter } from '@/god-ui'
import { Button, Checkbox, Divider, Spinner } from "@heroui/react";
import { GrClear } from 'react-icons/gr';
import { MdFilterTiltShift } from 'react-icons/md';
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface DrawerFilterProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  filterLoading: boolean;
  isLoading?: boolean;
  loadingType?: "blur" | "regular";
  hideIconLoading?: boolean;
  filter?: any;
  isAutoFilter?: boolean;
  offAutoClose?: boolean;
  setOffAutoClose?: (value: boolean) => void;
}

const DrawerFilter = ({
  isOpen,
  onClose,
  children,
  title = "filter",
  onApplyFilter,
  onResetFilter,
  filterLoading,
  isLoading,
  loadingType,
  hideIconLoading = false,
  filter,
  isAutoFilter = false,
  offAutoClose = false,
  setOffAutoClose = () => {},
}: DrawerFilterProps) => {
  const { t } = useTranslation();
  const [autoFilterValue, setAutoFilterValue] = useState<boolean>(false);
  const debouncedFilter = useDebounce(filter, 300);

  useEffect(() => {
    if (autoFilterValue && debouncedFilter) {
      onApplyFilter();
    }
  }, [debouncedFilter]);

  useEffect(() => {
    if (autoFilterValue) {
      onApplyFilter();
    }
  }, [autoFilterValue]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      radius="none"
      backdrop="transparent"
      shadow="none"
    >
      {isLoading && (
        <div
          className={cn(
            "flex items-center justify-center min-h-36 inset-0 absolute bg-white/20 dark:bg-black/20 z-50",
            loadingType === "blur" ? "backdrop-blur-sm" : ""
          )}
        >
          {!hideIconLoading && (
            <Spinner variant="spinner" size="sm" label={t("filtering")} />
          )}
        </div>
      )}

      <DrawerHeader>
        <h2 className="text-lg font-semibold">{t(title)}</h2>
        
      </DrawerHeader>

      <DrawerContent>
        <DrawerBody>
          {children}
          <Divider className='my-4'/>
          <div className="grid gap-2">
            <Checkbox
              isSelected={offAutoClose}
              onValueChange={setOffAutoClose}
            >
              {t("offAutoClose")}
            </Checkbox>
            {isAutoFilter ? (
              <Checkbox
                isSelected={autoFilterValue}
                onValueChange={setAutoFilterValue}
              >
                {t("autoFilter")}
              </Checkbox>
            ) : <div />}
          </div>
        </DrawerBody>
      </DrawerContent>

      <DrawerFooter>
          <div className="flex items-center gap-2">
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
              startContent={!filterLoading && <MdFilterTiltShift size={16} />}
            >
              {t("apply")}
            </Button>
          </div>
      </DrawerFooter>
    </Drawer>
  );
};

export default DrawerFilter;
