import { cn } from "@/lib/utils";
import { Select, SelectItem } from "@heroui/react";
import { useState } from "react";

interface Option {
  [key: string]: any; // Allow dynamic property access
}

interface MultiSelectProps {
  label: string;
  placeholder: string;
  options: Option[];
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  name?: string;
  className?: string;
  triggerClassName?: string;
  optionLabel?: string;
  secondaryOptionLabel?: string;
  optionValue?: string;
}

export const MultiSelect = ({
  label,
  placeholder,
  options,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange: controlledOnSelectionChange,
  isDisabled = false,
  isRequired = false,
  name,
  className = "max-w-xs",
  triggerClassName = "select-md-ui",
  optionLabel = "label",
  secondaryOptionLabel = "",
  optionValue = "id",
}: MultiSelectProps) => {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string>>(
    new Set()
  );

  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys;
  const onSelectionChange =
    controlledOnSelectionChange ?? setInternalSelectedKeys;

  return (
    <Select
      className={className}
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      onSelectionChange={onSelectionChange}
      classNames={{ 
        trigger: cn(triggerClassName, 'bg-zinc-200/70 dark:bg-zinc-800'), 
        base: 'select-md-ui '
        
      }}
      
      listboxProps={{
        itemClasses: {
          base: [
            "rounded-xl px-3",
          ],
        },
      }}
      popoverProps={{
        classNames: {
          content: "rounded-[20px]  bg-zinc-50 dark:bg-zinc-800 border-white dark:border-transparent border-2 px-1",
        },
      }}
      isDisabled={isDisabled}
      isRequired={isRequired}
      name={name}

    >
      {options.map((option, index) => {
        const value = option[optionValue] ?? index;
        const primaryLabel = option[optionLabel] || "";
        const secondaryLabel = secondaryOptionLabel ? option[secondaryOptionLabel] : "";
        const displayText = secondaryLabel 
          ? `${primaryLabel} - ${secondaryLabel}` 
          : primaryLabel;

        return (
          <SelectItem 
            key={String(value)}
            textValue={primaryLabel}
          >          
            <p className="truncate w-[95%]">{displayText}</p>
          </SelectItem>
        );
      })}
    </Select>
  );
};