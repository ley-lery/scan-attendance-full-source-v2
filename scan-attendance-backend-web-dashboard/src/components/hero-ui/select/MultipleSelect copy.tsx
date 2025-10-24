import { Select, SelectItem, SelectSection } from "@heroui/react";
import { useState } from "react";

interface BaseOption {
  id: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SelectGroup<T extends BaseOption> {
  groupLabel: string;
  options: T[];
}

interface DynamicSelectProps<T extends BaseOption> {
  label: string;
  placeholder: string;
  options: T[] | SelectGroup<T>[];
  selectedKeys?: Set<string> | string;
  onSelectionChange?: (keys: any) => void;
  selectionMode?: "single" | "multiple";
  isDisabled?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  name?: string;
  className?: string;
  triggerClassName?: string;
  renderLabel?: (option: T) => React.ReactNode;
  errorMessage?: string;
  isInvalid?: boolean;
}

export function DynamicSelect<T extends BaseOption>({
  label,
  placeholder,
  options,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange: controlledOnSelectionChange,
  selectionMode = "multiple",
  isDisabled = false,
  isRequired = false,
  isLoading = false,
  name,
  className = "max-w-xs",
  triggerClassName = "select-md-ui",
  renderLabel,
  errorMessage,
  isInvalid = false,
}: DynamicSelectProps<T>) {
  const defaultValue = selectionMode === "multiple" ? new Set() : "";
  const [internalSelectedKeys, setInternalSelectedKeys] =
    useState<any>(defaultValue);

  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys;
  const onSelectionChange =
    controlledOnSelectionChange ?? setInternalSelectedKeys;

  const isGrouped = options.length > 0 && "groupLabel" in options[0];

  const renderOption = (option: T) => (
    <SelectItem
      key={option.id}
      description={option.description}
      isDisabled={option.disabled}
    >
      {renderLabel ? renderLabel(option) : option.label}
    </SelectItem>
  );

  return (
    <Select
      className={className}
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      selectedKeys={selectedKeys}
      selectionMode={selectionMode}
      onSelectionChange={onSelectionChange}
      classNames={{
        trigger: triggerClassName,
      }}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isLoading={isLoading}
      name={name}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
    >
      {isGrouped
        ? (options as SelectGroup<T>[]).map((group) => (
            <SelectSection key={group.groupLabel} title={group.groupLabel}>
              {group.options.map(renderOption)}
            </SelectSection>
          ))
        : (options as T[]).map(renderOption)}
    </Select>
  );
}