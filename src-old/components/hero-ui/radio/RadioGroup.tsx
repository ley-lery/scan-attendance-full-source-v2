/* eslint-disable @typescript-eslint/no-explicit-any */
import { RadioGroup, Radio } from "@heroui/react";
import type { ComponentProps } from "react";

type RadioGroupProps = ComponentProps<typeof RadioGroup> & {
  options: { label: string; value: string; color?: string }[];
};

const RadioGroupUI = ({
  label,
  value,
  onValueChange,
  options,
  orientation = "horizontal",
  size = "sm",
  className,
  classNames,
  ...props
}: RadioGroupProps) => {
  return (
    <RadioGroup
      label={label}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      size={size}
      className={className}
      classNames={{
        label: "text-sm text-gray-700 dark:text-gray-300",
        ...classNames,
      }}
      {...props}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          className="mt-0"
          value={option.value}
          color={option.color as any}
        >
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default RadioGroupUI;
