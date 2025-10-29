import { Popover, PopoverTrigger, PopoverContent, PopoverCloseWrapper } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/hero-ui";
import { cn } from "@/lib/utils";
import { FaCircleCheck } from "react-icons/fa6";
import { TiFilter } from "react-icons/ti";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

interface FilterPopoverProps {
  onApplyFilter: () => void;
  field: string;
  handleClearFilter: (key: any, field: string) => void;
  filterLoading: boolean;
  children: React.ReactNode;
  header?: string;
  triggerText: string;
  isActive?: boolean; 
  classNames?: {
    content?: string;
    popoverContent?: string;
  };
  isDisableds?:{
    buttonClear?: boolean;
    buttonApply?: boolean;
  }
}

export const FilterPopover = ({
  onApplyFilter,
  handleClearFilter,
  filterLoading,
  field,
  triggerText,
  children,
  header,
  isActive = false,
  classNames,
  isDisableds
}: FilterPopoverProps) => {
  const { t } = useTranslation();

  // const onClear = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   handleClearFilter(null, field);
  // };
  return (
    <Popover >
      <PopoverTrigger>
        <button
          type="button"
          className={cn(
            "pl-2 pr-3 py-1.5 whitespace-nowrap cursor-pointer rounded-full text-sm flex items-center gap-1 font-medium transition-colors duration-150",
            filterLoading && "opacity-50 cursor-not-allowed",
            isActive
              ? "bg-primary/20 text-primary" 
              : "bg-zinc-300 dark:bg-zinc-700/80 hover:bg-zinc-300 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300"
          )}
        >
          {isActive ? 
            // <Tooltip content={t("clear")} placement="top" color="danger" classNames={{base: 'pointer-events-none'}} delay={0} closeDelay={0} size="sm" radius="full" >
            //   <span className="cursor-pointer" onClick={onClear}><IoCloseCircle size={18} /></span>
            // </Tooltip>
            <FaCircleCheck size={16} />
            : <TiFilter size={20} />}
          {triggerText}
        </button>
      </PopoverTrigger>

      <PopoverContent className={cn("min-w-60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm shadow-xl shadow-zinc-300/50 dark:shadow-transparent rounded-2xl p-2", classNames?.popoverContent)}>
        <PopoverCloseWrapper>
          {({ close }) => (
            <>
              {header && <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400  mb-2 pb-0.5">{header}</div>}
              <div className={cn(classNames?.content)}>
                {children}
              </div>
              <div className="mt-3 flex items-center gap-1">
                <Button
                  type="button"
                  onClick={() => handleClearFilter(null, field)}
                  className="w-full"
                  color="danger"
                  variant="flat"
                  size="sm"
                  isDisabled={isDisableds?.buttonClear || filterLoading}
                  startContent={<IoCloseCircleOutline size={20} />}
                >
                  {t("clear")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onApplyFilter();
                    close();
                  }}
                  className="w-full"
                  color="primary"
                  size="sm"
                  isDisabled={isDisableds?.buttonApply || filterLoading}
                  startContent={<IoCheckmarkCircleOutline size={20} />}
                >
                  {t("apply")}
                </Button>
              </div>
            </>
          )}
        </PopoverCloseWrapper>
      </PopoverContent>
    </Popover>
  );
};
