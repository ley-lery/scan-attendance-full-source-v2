import { NumberInput, extendVariants } from "@heroui/react";

export const InputNumber = extendVariants(NumberInput, {
  variants: {
    
    // isDisabled: {
    //   true: { input: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed" },
    // },
    size: {
      sm: { inputWrapper: "input-small-ui" },
      md: { inputWrapper: "input-medium-ui" },
      lg: { inputWrapper: "input-large-ui" },
    },
  },
  defaultVariants: {
    size: "md",
  },
  // compoundVariants: [
  //   {
  //     isDisabled: true,
  //     class: "bg-[#84cc16]/80 opacity-100",
  //   },
  // ],
});

