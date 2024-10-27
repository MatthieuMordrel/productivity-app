import { useSettingsContext } from "@/contexts/SettingsContext";
import { Break } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { TimePicker } from "./TimePicker";

interface BreakSettingProps {
  break: Break;
  index: number;
}

export const BreakSetting: React.FC<BreakSettingProps> = ({
  break: breakItem,
  index,
}) => {
  const { dispatch, state } = useSettingsContext();

  // Check if start and end times are on the same day
  const isSameDay =
    state.startTime.toDateString() === state.endTime.toDateString();

  return (
    <div className="mb-4 rounded-lg bg-background p-4 shadow">
      <h3 className="mb-2 text-lg font-semibold">Break {index + 1}</h3>

      <div className="flex items-center gap-4">
        {/* Start Time Container */}
        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <TimePicker
            value={breakItem.start}
            onChange={(value) =>
              dispatch({
                type: "UPDATE_BREAK",
                payload: { index, break: { ...breakItem, start: value } },
              })
            }
            showDateToggle={!isSameDay}
          />
        </div>

        {/* End Time Container */}
        <div>
          <label className="block text-sm font-medium">End Time</label>
          <TimePicker
            value={breakItem.end}
            onChange={(value) =>
              dispatch({
                type: "UPDATE_BREAK",
                payload: { index, break: { ...breakItem, end: value } },
              })
            }
            showDateToggle={!isSameDay}
          />
        </div>

        {/* Delete Button - Aligned with inputs */}
        <button
          onClick={() => dispatch({ type: "REMOVE_BREAK", payload: index })}
          className="hover:bg-secondary/10 mt-[22px] rounded-md p-2 text-foreground transition-colors"
          aria-label="Remove break"
        >
          <Trash2 size={18} className="text-red-500 hover:text-red-700" />
        </button>
      </div>
    </div>
  );
};
