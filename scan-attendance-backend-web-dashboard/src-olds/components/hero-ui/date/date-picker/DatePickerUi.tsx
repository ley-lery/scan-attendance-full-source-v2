/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn, DatePicker } from "@heroui/react";
import type { ComponentProps } from "react";

type BaseProps = ComponentProps<typeof DatePicker>;

interface DatePickerUiProps extends Omit<BaseProps, "value" | "onChange"> {
  value?: any;
  onChange: (value: any) => void;
  variant?: "bordered" | "flat" | "faded" | "underlined";
  className?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
}

const DatePickerUi = ({
  label = "Date",
  name = "date",
  value,
  onChange,
  isInvalid,
  errorMessage,
  variant = "flat",
  className = "w-full",
  isRequired = false,
  labelPlacement = "outside",
  radius = "md",
  size = "md",
  ...rest
}: DatePickerUiProps) => {
  return (
    <DatePicker
      showMonthAndYearPickers
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      variant={variant}
      labelPlacement={labelPlacement}
      radius={radius}
      isRequired={isRequired}
      className={className}
      size={size}
      classNames={{
        inputWrapper: cn(
          variant === "flat" ? "bg-zinc-200 dark:bg-zinc-800" : "",
          size === "sm" ? "input-small-ui" : "",
          size === "md" ? "input-medium-ui" : "",
          size === "lg" ? "input-large-ui" : "",
        ),
      }}
      {...rest}
    />
  );
};

export default DatePickerUi;
