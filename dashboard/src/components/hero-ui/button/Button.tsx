import { Button as ButtonComponent, extendVariants } from "@heroui/react";

export const Button = extendVariants(ButtonComponent, {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "sm",
    radius: "md",
  },
});