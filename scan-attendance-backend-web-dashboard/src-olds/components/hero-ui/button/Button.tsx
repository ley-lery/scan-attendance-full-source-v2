import { Button as ButtonComponent, extendVariants } from "@heroui/react";

export const Button = extendVariants(ButtonComponent, {
  variants: {
    size: {
        sm: "btn-small-ui",
        md: "btn-medium-ui",
        lg: "btn-large-ui",
    },
    radius: {
        sm: "btn-radius-sm",
        md: "btn-radius-md",
        lg: "btn-radius-lg",
    },
  },
  defaultVariants: {
    size: "md",
    radius: "md",
  },
});

