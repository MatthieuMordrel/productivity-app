"use client";

import { TimePicker } from "@/components/settings/TimePicker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { RotateCcw } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import BreakManager from "./BreakManager";
import { NumberSetting } from "./NumberSetting";

const PomodoroSettings: React.FC = () => {
  const { state, dispatch } = useSettingsContext();

  // Function to ensure end time is after start time
  const validateAndAdjustTimes = (start: Date, end: Date) => {
    if (end <= start) {
      // If end time is before or equal to start time, set it to 30 minutes after start time
      const newEnd = new Date(start.getTime() + 30 * 60000);
      dispatch({ type: "SET_END_TIME", payload: newEnd });
    }
  };

  const handleStartTimeChange = (value: Date) => {
    dispatch({ type: "SET_START_TIME", payload: value });
    validateAndAdjustTimes(value, state.endTime);
  };

  const handleEndTimeChange = (value: Date) => {
    if (value > state.startTime) {
      dispatch({ type: "SET_END_TIME", payload: value });
    } else {
      // If the new end time is before or equal to start time, set it to 30 minutes after start time
      const newEnd = new Date(state.startTime.getTime() + 30 * 60000);
      dispatch({ type: "SET_END_TIME", payload: newEnd });
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-secondary p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pomodoro Settings</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => dispatch({ type: "RESET_SETTINGS" })}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset to default settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-4">
        <NumberSetting
          label="Pomodoro Duration"
          value={state.pomodoroDuration}
          onChange={(value) =>
            dispatch({ type: "SET_POMODORO_DURATION", payload: value })
          }
          min={1}
          max={60}
          step={1}
          presetValues={[25, 45, 60]}
        />

        <NumberSetting
          label="Pause Duration"
          value={state.pauseDuration}
          onChange={(value) =>
            dispatch({ type: "SET_PAUSE_DURATION", payload: value })
          }
          min={1}
          max={30}
          step={1}
          presetValues={[5, 10, 15]}
        />

        <div>
          <label className="mb-2 block text-lg font-medium">Start of Day</label>

          <TimePicker
            value={state.startTime}
            onChange={handleStartTimeChange}
            showSetNowButton={true}
          />
        </div>

        <div>
          <label className="mb-2 block text-lg font-medium">End of Day</label>

          <TimePicker
            value={state.endTime}
            onChange={handleEndTimeChange}
            minTime={state.startTime}
          />
        </div>

        <BreakManager breaks={state.breaks} />
      </div>

      <button className="mt-6 w-full rounded-md bg-primary py-2 text-background transition-opacity hover:opacity-90">
        Save Settings
      </button>
    </div>
  );
};

export default PomodoroSettings;
