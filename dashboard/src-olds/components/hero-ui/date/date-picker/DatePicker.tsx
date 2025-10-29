import { DatePicker as DatePickerComponent, extendVariants } from "@heroui/react";

export const DatePicker = extendVariants(DatePickerComponent, {
  variants: {
    size: {
      sm: { inputWrapper: "input-small-ui" },
      md: { inputWrapper: "input-medium-ui" },
      lg: { inputWrapper: "input-large-ui" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});