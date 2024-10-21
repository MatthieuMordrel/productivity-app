import { useSettingsContext } from "@/contexts/SettingsContext";
import { Break } from "@/lib/types";
import { TimePicker } from "./TimePicker";

interface BreakSettingProps {
  break: Break;
  index: number;
}

export const BreakSetting: React.FC<BreakSettingProps> = ({
  break: breakItem,
  index,
}) => {
  const { dispatch } = useSettingsContext();

  return (
    <div className="mb-4 rounded-lg bg-background p-4 shadow">
      <h3 className="mb-2 text-lg font-semibold">Break {index + 1}</h3>

      <div className="flex items-center space-x-4">
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
          />
        </div>

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
          />
        </div>

        <button
          onClick={() => dispatch({ type: "REMOVE_BREAK", payload: index })}
          className="mt-6 rounded-md bg-red-500 px-3 py-2 text-white"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
