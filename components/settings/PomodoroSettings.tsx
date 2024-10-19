"use client";

import { TimePicker } from "@/components/settings/TimePicker";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { Break } from "@/lib/types";
import React, { useEffect } from "react";
import BreakManager from "./BreakManager";
import { NumberSetting } from "./NumberSetting";

const PomodoroSettings: React.FC = () => {
  const { state, dispatch } = usePomodoroContext();

  // Function to ensure end time is after start time
  const validateAndAdjustTimes = (start: Date, end: Date) => {
    if (end <= start) {
      // If end time is before or equal to start time, set it to 30 minutes after start time
      const newEnd = new Date(start.getTime() + 30 * 60000);
      dispatch({ type: "SET_END_TIME", payload: newEnd });
    }
  };

  // Effect to watch for changes in start time
  useEffect(() => {
    // Inline the function to avoid the unnecessary dependency
    const validateAndAdjustTimes = (start: Date, end: Date) => {
      if (end <= start) {
        const newEnd = new Date(start.getTime() + 30 * 60000);
        dispatch({ type: "SET_END_TIME", payload: newEnd });
      }
    };

    validateAndAdjustTimes(state.startTime, state.endTime);
  }, [state.startTime, state.endTime, dispatch]);

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

  const handleAddBreak = () => {
    const newBreak: Break = {
      start: new Date(new Date().setHours(12, 30, 0, 0)), // Set to 12:30 PM

      end: new Date(new Date().setHours(14, 0, 0, 0)), // Set to 2:00 PM
    };

    dispatch({ type: "ADD_BREAK", payload: newBreak });
  };

  const handleUpdateBreak = (index: number, updatedBreak: Break) => {
    dispatch({ type: "UPDATE_BREAK", payload: { index, break: updatedBreak } });
  };

  const handleRemoveBreak = (index: number) => {
    dispatch({ type: "REMOVE_BREAK", payload: index });
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-secondary p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">Pomodoro Settings</h2>

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

        <BreakManager
          breaks={state.breaks}
          onAddBreak={handleAddBreak}
          onUpdateBreak={handleUpdateBreak}
          onRemoveBreak={handleRemoveBreak}
        />
      </div>

      <button className="mt-6 w-full rounded-md bg-primary py-2 text-background transition-opacity hover:opacity-90">
        Save Settings
      </button>
    </div>
  );
};

export default PomodoroSettings;
