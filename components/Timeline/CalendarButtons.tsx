import { Switch } from "@/components/ui/switch";

export default function CalendarButtons({
  showPauses,
  setShowPauses,
  showBreaks,
  setShowBreaks,
}: {
  showPauses: boolean;
  setShowPauses: (value: boolean) => void;
  showBreaks: boolean;
  setShowBreaks: (value: boolean) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-pauses"
            checked={showPauses}
            onCheckedChange={setShowPauses}
          />
          <label htmlFor="show-pauses" className="text-sm font-medium">
            Show Pauses
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-breaks"
            checked={showBreaks}
            onCheckedChange={setShowBreaks}
          />
          <label htmlFor="show-breaks" className="text-sm font-medium">
            Show Breaks
          </label>
        </div>
      </div>
    </div>
  );
}
