import { DropdownItem as DropdownItemComponent, Dropdown as DropdownComponent, DropdownTrigger as DropdownTriggerComponent, DropdownMenu as DropdownMenuComponent, extendVariants } from "@heroui/react";

export const Dropdown = extendVariants(DropdownComponent, {
  variants: {
    size: {
      sm: {                 
        content: 'border-white border-2 shadow-none bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80 dark:border-transparent rounded-xl'
      },
      md: {                 
        content: 'border-white border-2 shadow-none bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80 dark:border-transparent rounded-2xl'
      },
      lg: {                 
        content: 'border-white border-2 shadow-none bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80 dark:border-transparent rounded-3xl'
      },
    },
    
  },
  defaultVariants: {
    size: "md",
  },
})

export const DropdownItem = extendVariants(DropdownItemComponent, {
  variants: {
    size: {
      sm: { selectedIcon: 'text-zinc-500 dark:text-zinc-400', base: 'rounded-lg'},
      md: { selectedIcon: 'text-zinc-500 dark:text-zinc-400', base: 'rounded-xl'},
      lg: { selectedIcon: 'text-zinc-500 dark:text-zinc-400', base: 'rounded-2xl'},
    },
    
  },
  defaultVariants: {
    size: "md",
  },
});

export const DropdownTrigger = extendVariants(DropdownTriggerComponent, {})
  

export const DropdownMenu = extendVariants(DropdownMenuComponent, {});


