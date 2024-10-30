import { useSettingsContext } from "@/contexts/SettingsContext";
import { Break } from "@/lib/types";
import React from "react";
import CalendarButtons from "../Timeline/CalendarButtons";
import { Button } from "../ui/button";
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

        <div className="flex justify-between">
          <Button
            type="button"
            variant="default"
            onClick={() => {
              const newBreak: Break = {
                start: new Date(new Date().setHours(12, 30, 0, 0)), // Set to 12:30 PM
                end: new Date(new Date().setHours(14, 0, 0, 0)), // Set to 2:00 PM
              };
              dispatch({ type: "ADD_BREAK", payload: newBreak });
            }}
          >
            Add Break
          </Button>
          <CalendarButtons />
        </div>
      </div>
    </div>
  );
};

export default BreakManager;
