import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface Option {
  [key: string | number]: any;
}

interface Props {
  options?: Option[];
  optionLabel?: string;
  secondaryOptionLabel?: string;
  optionValue?: string;
  selectedKey?: string | number | null;
  onSelectionChange?: (value: string | number | null) => void;
  placeholder?: string;
  name?: string;
  label?: string;
  error?: string;
  isRequired?: boolean;
  size?: "sm" | "md" | "lg";
  textValue?: any;
  itemStartContent?: React.ReactNode;
  itemEndContent?: React.ReactNode;
  isDisabled?: boolean;
}

export const AutocompleteUI = ({
  options = [],
  optionLabel = "label",
  secondaryOptionLabel = "",
  optionValue = "value",
  selectedKey = "",
  onSelectionChange,
  placeholder = "Select option",
  name,
  label,
  error,
  isRequired = false,
  size = "md",
  textValue,
  itemStartContent,
  itemEndContent,
  isDisabled = false,
  ...props
}: Props ) => {
  return (
    <Autocomplete
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      selectedKey={selectedKey}
      name={name}
      isInvalid={!!error}
      errorMessage={error}
      className="w-full"
      defaultItems={options}
      isRequired={isRequired}
      onSelectionChange={onSelectionChange}
      isDisabled={isDisabled}
      inputProps={{
        classNames: {
          inputWrapper: `autocomplete-${size}-ui`,
          label: "translate-y-7"

        }
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
          content: "rounded-[20px]  bg-zinc-50 dark:bg-zinc-800 border-white dark:border-transparent border-2",
        },
      }}
      {...props}
    >
      {(item) => (
        <AutocompleteItem
          key={item[optionValue]}
          textValue={ textValue ? textValue : item[optionLabel]}
        >
          {itemStartContent}
          <p className="truncate w-[95%]">{item[optionLabel] + (secondaryOptionLabel && " - " + item[secondaryOptionLabel])}</p>
          {itemEndContent}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

AutocompleteUI.displayName = "AutocompleteUI";
