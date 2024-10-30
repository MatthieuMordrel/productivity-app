import { cn } from "@/lib/utils";
import moment from "moment";
import { ToolbarProps, View } from "react-big-calendar";
import { Button } from "../ui/button";

interface CustomToolbarProps extends ToolbarProps {
  onDateChange?: (date: Date) => void;
  view: View;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = (props) => {
  const { onNavigate, date, onDateChange } = props;

  // Check if the current date matches today or tomorrow
  const isToday = moment(date).isSame(moment(), "day");
  const isTomorrow = moment(date).isSame(moment().add(1, "day"), "day");

  // Simplified navigation handler for just Today and Tomorrow
  const handleNavigate = (target: "TODAY" | "TOMORROW") => {
    const newDate =
      target === "TODAY" ? new Date() : moment().add(1, "day").toDate();
    onNavigate(target === "TODAY" ? "TODAY" : "NEXT");
    onDateChange?.(newDate);
  };

  return (
    <div className="flex items-center justify-end pb-3">
      {/* Navigation buttons on the left, wrapped in a container that doesn't affect the date positioning */}
      <div className="flex-1">
        {props.view === "day" && (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant={isToday ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigate("TODAY")}
              className={cn(
                "w-24 border border-transparent",
                isToday
                  ? ""
                  : "border-accent hover:bg-foreground hover:opacity-80",
              )}
            >
              Today
            </Button>
            <Button
              type="button"
              variant={isTomorrow ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigate("TOMORROW")}
              className={cn(
                "w-24 border border-transparent",
                isTomorrow
                  ? ""
                  : "border-accent hover:bg-foreground hover:opacity-80",
              )}
            >
              Tomorrow
            </Button>
          </div>
        )}
      </div>

      {/* Date display always aligned to the right */}
      <span className="ml-auto text-sm font-medium">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    </div>
  );
};
