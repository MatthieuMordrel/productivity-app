import { Break } from "@/lib/types";
import { TimePicker } from "./TimePicker";

interface BreakSettingProps {
  break: Break;
  index: number;
  onUpdate: (index: number, updatedBreak: Break) => void;
  onRemove: (index: number) => void;
}

export const BreakSetting: React.FC<BreakSettingProps> = ({
  break: breakItem,
  index,
  onUpdate,

  onRemove,
}) => {
  return (
    <div className="mb-4 rounded-lg bg-background p-4 shadow">
      <h3 className="mb-2 text-lg font-semibold">Break {index + 1}</h3>

      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium">Start Time</label>

          <TimePicker
            value={breakItem.start}
            onChange={(value) =>
              onUpdate(index, { ...breakItem, start: value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">End Time</label>

          <TimePicker
            value={breakItem.end}
            onChange={(value) => onUpdate(index, { ...breakItem, end: value })}
          />
        </div>

        <button
          onClick={() => onRemove(index)}
          className="mt-6 rounded-md bg-red-500 px-3 py-2 text-white"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
