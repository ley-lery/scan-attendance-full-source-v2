import { Input, extendVariants } from "@heroui/react";

const InputText = extendVariants(Input, {
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

export default InputText;
