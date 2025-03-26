"use client";

import { Button } from "@/components/ui/button";
import { usePlaySound } from "@/lib/hooks/useSound";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  // Prevent hydration mismatch by mounting after initial render
  // This is because the theme on the server might be different from the theme on the client (stored in localStorage)
  const [mounted, setMounted] = useState(false);
  // Using resolvedTheme to prevent hydration mismatch
  const { setTheme, resolvedTheme } = useTheme();
  const playSound = usePlaySound();

  // Need to keep this useEffect to handle hydration properly
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null instead of a placeholder during SSR
  // This isuseEffect never runs on the server
  if (!mounted) {
    return null;
  }

  const handleClick = () => {
    playSound("toggles", "Hard switch.wav");
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
