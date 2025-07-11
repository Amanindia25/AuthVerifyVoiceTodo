import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white shadow-md hover:bg-gray-800",
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-700 focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/80",
        outline:
          "border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-950 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-100",
        secondary: "bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800/50 dark:hover:text-gray-100",
        link: "text-gray-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-3.5",
        sm: "h-9 rounded-md gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-11 rounded-md px-7 has-[>svg]:px-4.5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
