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
            onChange={(value) =>
              dispatch({ type: "SET_START_TIME", payload: value })
            }
            showSetNowButton={true}
          />
        </div>

        <div>
          <label className="mb-2 block text-lg font-medium">End of Day</label>
          <TimePicker
            value={state.endTime}
            onChange={(value) =>
              dispatch({ type: "SET_END_TIME", payload: value })
            }
          />
        </div>
      </div>

      <button className="mt-6 w-full rounded-md bg-primary py-2 text-background transition-opacity hover:opacity-90">
        Save Settings
      </button>
    </div>
  );
};

export default PomodoroSettings;
