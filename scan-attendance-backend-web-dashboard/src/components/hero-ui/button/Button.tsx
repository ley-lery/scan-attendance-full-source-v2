import { Button as ButtonComponent, extendVariants } from "@heroui/react";

export const Button = extendVariants(ButtonComponent, {
  variants: {
    size: {
      // sm: "btn-small-ui",
      // md: "btn-medium-ui",
      // lg: "btn-large-ui",
    },
    // radius: {
    //   sm: "btn-radius-sm",
    //   md: "btn-radius-md",
    //   lg: "btn-radius-lg",
    // },
  },
  defaultVariants: {
    size: "sm",
    radius: "md",
  },

  compoundVariants: [
    {
      isIconOnly: "true", 
      size: "sm",
      class: "w-6 h-6 p-0", 
    },
    {
      isIconOnly: "true",
      size: "md",
      class: "w-8 h-8 p-0",
    },
    {
      isIconOnly: "true",
      size: "lg",
      class: "w-10 h-10 p-0",
    },
  ],
});