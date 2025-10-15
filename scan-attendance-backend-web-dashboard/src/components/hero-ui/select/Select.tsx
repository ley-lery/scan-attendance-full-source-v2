import { Select, SelectItem } from "@heroui/react";
import { type ComponentProps } from "react";

type SelectProps = ComponentProps<typeof Select>;

interface Option {
  [key: string]: any;
}

interface Props {
  options?: Option[];
  optionLabel?: string;
  optionValue?: string;
}

const SelectUI = ({
  variant = "flat",
  labelPlacement = "outside",
  size = "md",
  value,
  onChange,
  options = [],
  optionLabel = "label",
  optionValue = "value",
  ...props
}: SelectProps & Props) => {
  return (
    <Select
      variant={variant}
      labelPlacement={labelPlacement}
      size={size}
      value={value}
      onChange={onChange}
      {...props}
    >
      {options.map((item, index) => (
        <SelectItem
          key={item[optionValue] ?? index}
          value={item[optionValue]}
        >
          {item[optionLabel]}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SelectUI;
