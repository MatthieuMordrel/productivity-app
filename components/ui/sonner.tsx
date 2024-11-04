"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  console.log(theme);

  // 1. group is a Tailwind utility class that creates a context for child elements to style themselves based on the parent's state.
  // 2. group-[.toaster] is a custom group name variant that allows you to have multiple different group contexts in the same component.
  // group-[.toaster] means "apply this style when the parent element has both the group AND toaster classes"
  return (
    <Sonner
      visibleToasts={1}
      position="bottom-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg ",
          description: "group-[.toast]:text-foreground",
          actionButton:
            "group-[.toast]:bg-background group-[.toast]:text-foreground",
          cancelButton:
            "group-[.toast]:bg-background group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
