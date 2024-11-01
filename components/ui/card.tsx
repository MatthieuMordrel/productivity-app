import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";

const cardVariants = cva("", {
  variants: {
    variant: {
      default: "bg-card",
      outline:
        "border bg-gray-200/40 dark:border-gray-600/40 dark:bg-gray-800/40",
    },
  },
});

// Card component: A reusable, styled container for content
// It uses React.forwardRef to allow ref forwarding to the underlying div element
const Card = React.forwardRef<
  // TypeScript generic type for the ref, specifying it's for an HTMLDivElement
  HTMLDivElement,
  // TypeScript interface extending React's HTMLAttributes for a div element
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "outline" | "default";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    // Forward the ref to the div element
    ref={ref}
    // Use the cn utility to combine CSS classes
    className={cn(
      // Base styles for the card
      "text-card-foreground rounded-xl shadow",
      // Allow additional classes to be passed in and merged
      className,
      cardVariants({ variant }),
    )}
    // Spread any additional props onto the div
    {...props}
  />
));
// Set a display name for the component (useful for debugging)
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
