import moment from "moment";
import { ToolbarProps } from "react-big-calendar";

interface CustomToolbarProps extends ToolbarProps {
  onDateChange?: (date: Date) => void;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = (props) => {
  const { onNavigate, date, onDateChange } = props;

  // Navigation button styling - more subtle design
  const navButtonClass =
    "px-3 py-1.5 text-sm font-medium rounded-md transition-all text-foreground/70 hover:bg-secondary/50 hover:text-foreground";

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    onNavigate(action);

    // Calculate the new date based on the navigation action
    let newDate = new Date(date);
    if (action === "PREV") {
      newDate = moment(date).subtract(1, "day").toDate();
    } else if (action === "NEXT") {
      newDate = moment(date).add(1, "day").toDate();
    } else if (action === "TODAY") {
      newDate = new Date();
    }

    // Notify parent component about the date change
    onDateChange?.(newDate);
  };

  return (
    <div className="bg-background/50 border-secondary/20 flex items-center justify-between border-b p-3">
      {/* Navigation buttons and date display */}
      <div className="flex items-center space-x-4">
        <span className="rbc-btn-group flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleNavigate("TODAY")}
            className={navButtonClass}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("PREV")}
            className={navButtonClass}
          >
            <span className="sr-only">Previous</span>←
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("NEXT")}
            className={navButtonClass}
          >
            <span className="sr-only">Next</span>→
          </button>
        </span>

        {/* Current date display */}
        <span className="text-foreground/70 text-sm font-medium">
          {date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};
