import { type ComponentProps } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

type AutocompleteProps = ComponentProps<typeof Autocomplete>;

interface Option {
  [key: string]: any;
}

interface Props {
  options?: Option[];
  optionLabel?: string;
  optionValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  error?: string;
  isRequired?: boolean;
}


const AutocompleteUI = ({
  options = [],
  optionLabel = "label",
  optionValue = "value",
  value = "",
  onChange,
  placeholder = "Select option",
  name,
  error,
  isRequired = false,
  ...props
}: AutocompleteProps & Props) => {
  return (
    <Autocomplete
      labelPlacement="outside"
      placeholder={placeholder}
      selectedKey={value}
      name={name}
      isInvalid={!!error}
      errorMessage={error}
      className="w-full"
      isRequired={isRequired}
      onSelectionChange={(key) => onChange?.(key?.toString() ?? "")}
      {...props}
    >
      {options.map((item, index) => (
        <AutocompleteItem
          key={item[optionValue] ?? index}
          textValue={item[optionLabel]}
        >
          <p className="truncate w-[95%]">
            {item[optionLabel]}
          </p>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};


AutocompleteUI.displayName = 'Autocomplete';
export default AutocompleteUI;
