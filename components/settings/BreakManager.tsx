import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { Break } from "@/lib/types";
import React from "react";
import { BreakSetting } from "./BreakSetting";

interface BreakManagerProps {
  breaks: Break[];
}

const BreakManager: React.FC<BreakManagerProps> = ({ breaks }) => {
  const { dispatch } = usePomodoroContext();
  const [showBreakSettings, setShowBreakSettings] = React.useState(false);

  const toggleBreakSettings = () => {
    setShowBreakSettings(!showBreakSettings);
  };

  return (
    <div>
      <button
        onClick={toggleBreakSettings}
        className="mb-2 rounded-md bg-primary px-4 py-2 text-background"
      >
        {showBreakSettings ? "Hide Break Settings" : "Show Break Settings"}
      </button>

      {showBreakSettings && (
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
            Add Another Break
          </button>
        </div>
      )}
    </div>
  );
};

export default BreakManager;
