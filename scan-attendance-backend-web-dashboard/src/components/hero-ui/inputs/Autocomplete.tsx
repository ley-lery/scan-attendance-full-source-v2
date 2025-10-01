import { Autocomplete as AutocompleteComponent, AutocompleteItem as AutocompleteItemComponent, extendVariants } from "@heroui/react";

export const Autocomplete = extendVariants(AutocompleteComponent, {
  // variants: {
  //   size: {
  //     sm: { base: "input-small-ui" },
  //     md: { base: "input-medium-ui" },
  //     lg: { base: "input-large-ui" },
  //   },
  // },
  // defaultVariants: {
  //   size: "md",
  // },
});


export const AutocompleteItem = extendVariants(AutocompleteItemComponent, {
});


