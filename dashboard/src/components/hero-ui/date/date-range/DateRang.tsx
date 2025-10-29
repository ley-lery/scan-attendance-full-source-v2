import { DateRangePicker as DateRangePickerComponent, extendVariants } from "@heroui/react";

export const DateRangePickerUI = extendVariants(DateRangePickerComponent, {
  variants: {
    isDisabled: {
      true: { input: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed" },
    },
    size: {
      sm: { inputWrapper: "input-small-ui" },
      md: { inputWrapper: "input-medium-ui" },
      lg: { inputWrapper: "input-large-ui" },
    },
  },
  defaultVariants: {
    size: "md",
    showMonthAndYearPickers: 'true',
  },
});