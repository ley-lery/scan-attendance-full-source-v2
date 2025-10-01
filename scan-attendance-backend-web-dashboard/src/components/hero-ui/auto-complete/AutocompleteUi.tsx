/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/react";
import { Key } from "react";

interface Option {
  [key: string]: any;
}

interface AutocompleteUiProps {
  label?: string;
  placeholder?: string;
  name: string;
  selectedKey: string | null | undefined;
  onSelectionChange: (e: { target: { name: string; value: Key | null } }) => void;
  options: Option[];
  optionLabel: string;
  optionSubLabel?: string;
  optionValue: string;
  error?: string;
  isRequired?: boolean;
  variant?: "flat" | "faded" | "bordered" | "underlined";
  labelPlacement?: "outside" | "inside";
  multiple?: boolean;
  defaultSelectedKey?: string ;
  classNames?: {
    base?: string;
    listbox?: string;
    listboxWrapper?: string;
    popoverContent?: string;
    endContentWrapper?: string;
    clearButton?: string;
    selectorButton?: string;
  };
  className?: string;
}

const AutocompleteUi = ({
  label,
  placeholder,
  name,
  selectedKey,
  onSelectionChange,
  options,
  optionLabel,
  optionSubLabel,
  optionValue,
  error,
  isRequired = false,
  variant = "flat",
  labelPlacement = "outside",
  multiple = false,
  defaultSelectedKey,
  classNames,
  className,
}: AutocompleteUiProps) => {
  return (
    <Autocomplete
      radius="md"
      label={label}
      labelPlacement={labelPlacement}
      name={name}
      placeholder={placeholder}
      selectedKey={selectedKey}
      isInvalid={!!error}
      errorMessage={error}
      className={`w-full ${className}`}
      variant={variant}
      multiple={multiple}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={(key) =>
        onSelectionChange({ target: { name, value: key } })
      }
      isRequired={isRequired}
      classNames={classNames}
    >
      <AutocompleteSection>
        {options.map((item) => (
          <AutocompleteItem key={item[optionValue]}>
            {optionSubLabel
              ? `${item[optionSubLabel]} - ${item[optionLabel]}`
              : item[optionLabel]}
          </AutocompleteItem>
        ))}
      </AutocompleteSection>
    </Autocomplete>
  );
};

export default AutocompleteUi;
