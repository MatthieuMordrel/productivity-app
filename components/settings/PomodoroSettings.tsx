"use client";

import { useSettingsContext } from "@/contexts/SettingsContext";
import React from "react";
import BreakManager from "./BreakManager";
import { NumberSetting } from "./NumberSetting";
import { SettingsTooltipReset } from "./SettingsTooltipReset";
import { TimePicker } from "./TimePicker";

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
    <div className="mx-auto max-w-md rounded-lg bg-card p-6 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
          <SettingsTooltipReset className="self-start" />
        </div>

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
            showDateToggle={false}
          />
        </div>

        <div>
          <label className="mb-2 block text-lg font-medium">End of Day</label>

          <TimePicker
            value={state.endTime}
            onChange={handleEndTimeChange}
            minTime={state.startTime}
            // showDateToggle={true}
          />
        </div>

        <BreakManager breaks={state.breaks} />
      </div>
    </div>
  );
};

export default PomodoroSettings;
