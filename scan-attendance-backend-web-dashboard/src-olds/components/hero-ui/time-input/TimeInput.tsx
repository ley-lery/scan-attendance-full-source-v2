import { TimeInput as TimeInputComponent, extendVariants } from "@heroui/react";

const TimeInput = extendVariants(TimeInputComponent, {
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

export default TimeInput;
