"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CollapsibleRoot = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between px-6 py-4 text-base font-semibold text-foreground transition-all hover:bg-muted/50",
      className
    )}
    {...props}
  >
    <span>{children}</span>
    <ChevronDown
      className={cn(
        "h-5 w-5 text-muted-foreground transition-transform duration-200 data-open:rotate-180"
      )}
    />
  </CollapsiblePrimitive.Trigger>
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    className={cn(
      "overflow-hidden transition-all duration-200 data-closed:max-h-0 data-open:max-h-2500",
      className
    )}
    {...props}
  >
    <div className={cn("px-6 py-4")}>
      {children}
    </div>
  </CollapsiblePrimitive.Panel>
))
CollapsibleContent.displayName = "CollapsibleContent"

export { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent }
