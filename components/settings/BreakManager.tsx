import { Break } from "@/lib/types";
import React from "react";
import { BreakSetting } from "./BreakSettings";

interface BreakManagerProps {
  breaks: Break[];
  onAddBreak: () => void;
  onUpdateBreak: (index: number, updatedBreak: Break) => void;
  onRemoveBreak: (index: number) => void;
}

const BreakManager: React.FC<BreakManagerProps> = ({
  breaks,
  onAddBreak,
  onUpdateBreak,
  onRemoveBreak,
}) => {
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
            <BreakSetting
              key={index}
              break={breakItem}
              index={index}
              onUpdate={onUpdateBreak}
              onRemove={onRemoveBreak}
            />
          ))}

          <button
            onClick={onAddBreak}
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
