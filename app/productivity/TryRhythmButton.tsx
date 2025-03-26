"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { generateBreakPattern } from "@/lib/functions/breakPatternUtils";
import { PomodoroState } from "@/lib/types";
import { useRouter } from "next/navigation";

interface TryRhythmButtonProps {
  pomodoroDuration: number;
  pauseDuration: number;
  label: string;
  description?: string;
  breakDuration?: number;
  sessionsBeforeBreak?: number;
}

export function TryRhythmButton({
  pomodoroDuration,
  pauseDuration,
  label,
  description,
  breakDuration,
  sessionsBeforeBreak,
}: TryRhythmButtonProps) {
  const { state, dispatch } = useSettingsContext();
  const router = useRouter();

  const handleClick = () => {
    // Set start time to now
    const startTime = new Date();
    // Set end time to 8 hours from now
    const endTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000);

    // Create new settings state
    const newSettings: PomodoroState = {
      ...state,
      pomodoroDuration,
      pauseDuration,
      startTime,
      endTime,
      breaks: [], // Reset breaks
    };

    // Generate breaks if needed
    if (breakDuration && sessionsBeforeBreak) {
      const breaks = generateBreakPattern({
        startTime,
        endTime,
        workDuration: pomodoroDuration,
        breakDuration,
        pauseDuration,
        sessionsBeforeBreak,
      });
      newSettings.breaks = breaks;
    }

    // Update localStorage
    localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));

    // Update context state (keep these!)
    dispatch({ type: "RESET_SETTINGS" });
    dispatch({ type: "SET_POMODORO_DURATION", payload: pomodoroDuration });
    dispatch({ type: "SET_PAUSE_DURATION", payload: pauseDuration });
    dispatch({ type: "SET_START_TIME", payload: startTime });
    dispatch({ type: "SET_END_TIME", payload: endTime });

    if (newSettings.breaks.length > 0) {
      newSettings.breaks.forEach((breakItem) => {
        dispatch({ type: "ADD_BREAK", payload: breakItem });
      });
    }

    // Navigate to calendar page
    router.push("/calendar");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {label}
          </Button>
        </TooltipTrigger>
        {description && (
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
