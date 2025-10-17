import { Autocomplete as AutocompleteComponent, AutocompleteItem as AutocompleteItemComponent, extendVariants } from "@heroui/react";

export const Autocomplete = extendVariants(AutocompleteComponent, {
  variants:{
   
  },
  defaultVariants: {
    size: "md",
    radius: "md",
  },
  compoundVariants: [
    
  ]
});


export const AutocompleteItem = extendVariants(AutocompleteItemComponent, {
});


