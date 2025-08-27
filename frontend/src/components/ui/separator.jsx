import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const separatorVariants = cva(
  "bg-border shrink-0",
  {
    variants: {
      orientation: {
        horizontal: "h-[1px] w-full",
        vertical: "h-full w-[1px]",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      className={cn(separatorVariants({ orientation }), className)}
      decorative={decorative}
      orientation={orientation}
      {...props} />
  );
}

export { Separator, separatorVariants }