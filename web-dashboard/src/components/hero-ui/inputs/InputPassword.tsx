import { Input, extendVariants } from "@heroui/react";

export const InputPassword = extendVariants(Input, {
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

