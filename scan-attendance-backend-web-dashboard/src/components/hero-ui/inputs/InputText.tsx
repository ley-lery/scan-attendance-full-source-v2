import { Input, extendVariants } from "@heroui/react";

const InputText = extendVariants(Input, {
  variants: {
    size: {
      sm: { inputWrapper: "input-small-ui", label: 'input-label' },
      md: { inputWrapper: "input-medium-ui", label: 'input-label' },
      lg: { inputWrapper: "input-large-ui", label: 'input-label' },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default InputText;
