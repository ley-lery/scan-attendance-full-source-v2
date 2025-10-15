import { Autocomplete as AutocompleteComponent, AutocompleteItem as AutocompleteItemComponent, extendVariants } from "@heroui/react";

export const Autocomplete = extendVariants(AutocompleteComponent, {
  variants: {
    // size:{
    //   sm: { popoverContent: "border-white border shadow-lg shadow-zinc-200/50 dark:shadow-zinc-800/5 bg-white/50 backdrop-blur-sm dark:bg-zinc-800/80 dark:border-transparent"},
    //   md: { popoverContent: "border-white border shadow-lg shadow-zinc-200/50 dark:shadow-zinc-800/5 bg-white/50 backdrop-blur-sm dark:bg-zinc-800/80 dark:border-transparent "},
    //   lg: { popoverContent: "border-white border shadow-lg shadow-zinc-200/50 dark:shadow-zinc-800/5 bg-white/50 backdrop-blur-sm dark:bg-zinc-800/80 dark:border-transparent "},
    // }
  },
  defaultVariants: {
    size: "sm",
    radius: "md",
  },
});


export const AutocompleteItem = extendVariants(AutocompleteItemComponent, {
});


