import { Select, SelectItem } from "@heroui/react";
import type { ChangeEventHandler } from "react";

interface Option {
  [key: string | number]: any;
}

interface Props {
  options?: Option[];
  optionLabel?: string;
  secondaryOptionLabel?: string;
  optionValue?: string;
  selectedKeys?: "all" | Iterable<string | any> | undefined;
  onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  placeholder?: string;
  name?: string;
  label?: string;
  error?: string;
  isRequired?: boolean;
  size?: "sm" | "md" | "lg";
  textValue?: any;
}

export const SelectUI = ({
  options = [],
  optionLabel = "label",
  secondaryOptionLabel = "",
  optionValue = "value",
  selectedKeys,
  onChange,
  placeholder = "Select option",
  name,
  label,
  error,
  isRequired = false,
  size = "md",
  textValue,
}: Props) => {
  return (
    <Select
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      selectedKeys={selectedKeys}
      name={name}
      isInvalid={!!error}
      errorMessage={error}
      className="w-full"
      isRequired={isRequired}
      onChange={onChange}
      classNames={{
        trigger: `select-${size}-ui`,
      }}
    >
      {options.map((item, index) => (
        <SelectItem
          key={item[optionValue] ?? index}
          textValue={ textValue ? textValue : item[optionLabel]}
        >
          <p className="truncate w-[95%]">{item[optionLabel] + (secondaryOptionLabel && " - " +  item[secondaryOptionLabel])}</p>
        </SelectItem>
      ))}
    </Select>
  );
};

SelectUI.displayName = "SelectUI";
