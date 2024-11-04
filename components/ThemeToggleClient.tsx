import { Button } from "@/components/ui/button";
import { usePlaySound } from "@/hooks/useSound";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

function ThemeToggleClient() {
  const { setTheme, resolvedTheme } = useTheme();
  const playSound = usePlaySound();

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
      className="duration-300 animate-in fade-in"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export default ThemeToggleClient;

export const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggleClient"),
  { ssr: false },
);
