"use client";

import { Button } from "@/components/ui/button";
import { usePlaySound } from "@/hooks/useSound";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Prevent hydration mismatch by mounting after initial render
  const [mounted, setMounted] = useState(false);

  const playSound = usePlaySound();

  const handleClick = () => {
    playSound("toggles", "Hard switch.wav");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
