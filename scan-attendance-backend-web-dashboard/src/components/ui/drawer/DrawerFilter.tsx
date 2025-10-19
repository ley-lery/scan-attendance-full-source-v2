import { Drawer, DrawerHeader, DrawerContent, DrawerBody, DrawerFooter } from '@/god-ui'
import {  Checkbox, Divider, Spinner } from "@heroui/react";
import { GrClear } from 'react-icons/gr';
import { MdFilterTiltShift } from 'react-icons/md';
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from '@/components/hero-ui';

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
  backdrop?: "transparent" | "blur" | "regular"
}

const DrawerFilter = memo(({
  isOpen,
  onClose,
  children,
  title = "filter",
  onApplyFilter,
  onResetFilter,
  filterLoading,
  isLoading,
  loadingType = "regular",
  hideIconLoading = false,
  filter,
  isAutoFilter = false,
  offAutoClose = false,
  setOffAutoClose = () => {},
  backdrop = "transparent",
}: DrawerFilterProps) => {
  const { t } = useTranslation();
  const [autoFilterValue, setAutoFilterValue] = useState<boolean>(false);
  
  // Debounce filter with proper dependency
  const debouncedFilter = useDebounce(filter, 300);

  // Memoize loading overlay className
  const loadingOverlayClass = useMemo(() => 
    cn(
      "flex items-center justify-center min-h-36 inset-0 absolute bg-black/20 dark:bg-black/40 z-50",
      loadingType === "blur" ? "backdrop-blur-sm" : ""
    ),
    [loadingType]
  );

  // Use refs to track previous values and prevent unnecessary calls
  const prevFilterRef = useRef<any>(null);
  const isFirstRenderRef = useRef(true);

  // Memoize handlers to prevent recreating functions
  const handleAutoFilter = useCallback(() => {
    if (autoFilterValue) {
      onApplyFilter();
    }
  }, [autoFilterValue, onApplyFilter]);

  const handleOffAutoCloseChange = useCallback((value: boolean) => {
    setOffAutoClose(value);
  }, [setOffAutoClose]);

  const handleAutoFilterChange = useCallback((value: boolean) => {
    setAutoFilterValue(value);
  }, []);

  // Improved useEffect with proper dependencies and guards
  useEffect(() => {
    // Skip first render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevFilterRef.current = debouncedFilter;
      return;
    }

    // Only trigger if auto filter is enabled and filter actually changed
    if (autoFilterValue && debouncedFilter !== prevFilterRef.current) {
      onApplyFilter();
      prevFilterRef.current = debouncedFilter;
    }
  }, [debouncedFilter, autoFilterValue, onApplyFilter]);

  // Handle auto filter toggle separately (when user enables it)
  useEffect(() => {
    if (autoFilterValue && !isFirstRenderRef.current) {
      onApplyFilter();
    }
  }, [autoFilterValue, onApplyFilter]);

  // Reset first render flag when drawer closes
  useEffect(() => {
    if (!isOpen) {
      isFirstRenderRef.current = true;
    }
  }, [isOpen]);

  // Memoize footer buttons to prevent re-renders
  const footerButtons = useMemo(() => (
    <div className="flex items-center gap-1">
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
  ), [onResetFilter, onApplyFilter, filterLoading, t]);

  // if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      radius="none"
      backdrop={backdrop}
      shadow="none"
    >
      {isLoading && (
        <div className={loadingOverlayClass}>
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
          {/* <Divider className='my-4'/>
          <div className="grid gap-2">
            <Checkbox
              isSelected={offAutoClose}
              onValueChange={handleOffAutoCloseChange}
            >
              {t("offAutoClose")}
            </Checkbox>
            {isAutoFilter && (
              <Checkbox
                isSelected={autoFilterValue}
                onValueChange={handleAutoFilterChange}
              >
                {t("autoFilter")}
              </Checkbox>
            )}
          </div> */}
        </DrawerBody>
      </DrawerContent>

      <DrawerFooter>
        {footerButtons}
      </DrawerFooter>
    </Drawer>
  );
});

// Add display name for better debugging
DrawerFilter.displayName = 'DrawerFilter';

export default DrawerFilter;