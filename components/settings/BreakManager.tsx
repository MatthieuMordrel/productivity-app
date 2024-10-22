import { useSettingsContext } from "@/contexts/SettingsContext";
import { Break } from "@/lib/types";
import React from "react";
import { BreakSetting } from "./BreakSetting";

interface BreakManagerProps {
  breaks: Break[];
}

const BreakManager: React.FC<BreakManagerProps> = ({ breaks }) => {
  const { dispatch } = useSettingsContext();

  return (
    <div>
      <div>
        {breaks.map((breakItem, index) => (
          <BreakSetting key={index} break={breakItem} index={index} />
        ))}

        <button
          onClick={() => {
            const newBreak: Break = {
              start: new Date(new Date().setHours(12, 30, 0, 0)), // Set to 12:30 PM
              end: new Date(new Date().setHours(14, 0, 0, 0)), // Set to 2:00 PM
            };
            dispatch({ type: "ADD_BREAK", payload: newBreak });
          }}
          className="mt-2 rounded-md bg-primary px-4 py-2 text-background"
        >
          Add Break
        </button>
      </div>
    </div>
  );
};

export default BreakManager;
