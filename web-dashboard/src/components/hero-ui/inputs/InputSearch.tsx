import { Input, extendVariants } from "@heroui/react";

const InputSearch = extendVariants(Input, {
  variants: {
    // <- modify/add variants
    color: {
      olive: { input: "text-[#000] bg-[#84cc16]" },
      orange: { input: "bg-[#ff8c00] text-[#fff]" },
      violet: { input: "bg-[#8b5cf6] text-[#000]" },
    },
    isDisabled: {
      true: { input: "bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed" },
    },
    size: {
      xs: { input: "px-2 min-w-12 h-6 text-tiny gap-1 rounded-small" },
      md: { input: "px-4 min-w-20 h-10 text-small gap-2 rounded-small" },
      xl: { input: "px-8 min-w-28 h-14 text-large gap-4 rounded-medium" },
    },
  },
  defaultVariants: {
    // <- modify/add default variants
    color: "violet",
    size: "md",
  },
  compoundVariants: [
    // <- modify/add compound variants
    {
      isDisabled: true,
      color: "violet",
      class: "bg-[#84cc16]/80 opacity-100",
    },
  ],
});

export default InputSearch;
