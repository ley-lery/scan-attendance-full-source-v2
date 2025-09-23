import { Textarea as TextareaComponent, extendVariants } from "@heroui/react";

export const Textarea = extendVariants(TextareaComponent, {
  variants: {
    size: {
      sm: { inputWrapper: "textarea" },
      md: { inputWrapper: "textarea" },
      lg: { inputWrapper: "textarea" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

