"use client";
import { TimePicker } from "@/components/settings/TimePicker";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import React from "react";
import { NumberSetting } from "./NumberSetting";

const PomodoroSettings: React.FC = () => {
  const { state, dispatch } = usePomodoroContext();

  return (
    <div className="mx-auto max-w-md rounded-lg bg-secondary p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">Pomodoro Settings</h2>

      <NumberSetting
        label="Pomodoro Duration"
        value={state.pomodoroDuration}
        onChange={(value) =>
          dispatch({ type: "SET_POMODORO_DURATION", payload: value })
        }
        min={1}
        max={60}
        step={1}
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
      />

      <div className="mb-4 flex items-center justify-between">
        <label className="text-lg font-medium">Start of Day</label>

        <TimePicker
          value={state.startTime}
          onChange={(value) =>
            dispatch({ type: "SET_START_TIME", payload: value })
          }
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <label className="text-lg font-medium">End of Day</label>

        <TimePicker
          value={state.endTime}
          onChange={(value) =>
            dispatch({ type: "SET_END_TIME", payload: value })
          }
        />
      </div>

      <button className="w-full rounded-md bg-primary py-2 text-background transition-opacity hover:opacity-90">
        Save Settings
      </button>
    </div>
  );
};

export default PomodoroSettings;
