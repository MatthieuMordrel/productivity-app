"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

// Root component for the Sheet
const Sheet = SheetPrimitive.Root;

// Trigger component to open the Sheet
const SheetTrigger = SheetPrimitive.Trigger;

// Close component for the Sheet
const SheetClose = SheetPrimitive.Close;

// Portal component for rendering the Sheet outside the DOM hierarchy
const SheetPortal = SheetPrimitive.Portal;

// Overlay component for the Sheet
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50", // Position and z-index
      "data-[state=open]:animate-in data-[state=closed]:animate-out", // Animation states
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", // Fade animations
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// Define variants for the Sheet using class-variance-authority
const sheetVariants = cva(
  cn(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out", // Base styles
    "data-[state=closed]:duration-300 data-[state=open]:duration-500", // Transition durations
    "data-[state=open]:animate-in data-[state=closed]:animate-out", // Animation states
  ),
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

// Define props for SheetContent component
interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

// SheetContent component
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitive.Close
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70", // Positioning and initial opacity
          "ring-offset-white transition-opacity", // Ring offset and transition
          "hover:opacity-100", // Hover effect
          "focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2", // Focus styles
          "disabled:pointer-events-none", // Disabled state
          "data-[state=open]:bg-slate-100", // Open state background
          "dark:ring-offset-slate-950 dark:focus:ring-slate-300", // Dark mode styles
          "dark:data-[state=open]:bg-slate-800", // Dark mode open state background
        )}
      >
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

// SheetHeader component
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2", // Flex column layout with vertical spacing
      "text-center sm:text-left", // Center text on mobile, left-aligned on larger screens
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

// SheetFooter component
const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", // Responsive layout
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

// SheetTitle component
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold", // Text size and weight
      "text-slate-950 dark:text-slate-50", // Text color (light and dark mode)
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

// SheetDescription component
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm", // Text size
      "text-slate-500 dark:text-slate-400", // Text color (light and dark mode)
      className,
    )}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

// Export all components
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
