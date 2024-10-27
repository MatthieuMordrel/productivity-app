import { ToolbarProps } from "react-big-calendar";

export const CustomToolbar: React.FC<ToolbarProps> = (props) => {
  const { onNavigate, date } = props;

  // Navigation button styling - more subtle design
  const navButtonClass =
    "px-3 py-1.5 text-sm font-medium rounded-md transition-all text-foreground/70 hover:bg-secondary/50 hover:text-foreground";

  return (
    <div className="bg-background/50 border-secondary/20 flex items-center justify-between border-b p-3">
      {/* Navigation buttons and date display */}
      <div className="flex items-center space-x-4">
        <span className="rbc-btn-group flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onNavigate("TODAY")}
            className={navButtonClass}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onNavigate("PREV")}
            className={navButtonClass}
          >
            <span className="sr-only">Previous</span>←
          </button>
          <button
            type="button"
            onClick={() => onNavigate("NEXT")}
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
