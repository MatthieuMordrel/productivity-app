import { ToolbarProps, View } from "react-big-calendar";

export const CustomToolbar: React.FC<ToolbarProps> = (props) => {
  const { label, onView, view } = props;

  const buttonClass = (buttonView: View) =>
    `px-3 py-1 rounded-md transition-colors ${
      view === buttonView
        ? "bg-primary text-white"
        : "bg-secondary text-foreground hover:bg-primary/80"
    }`;

  return (
    <div className="flex items-center justify-between bg-background p-2">
      <span className="rbc-btn-group space-x-2">
        <button
          type="button"
          onClick={() => onView("day")}
          className={buttonClass("day")}
        >
          Day
        </button>
        <button
          type="button"
          onClick={() => onView("agenda")}
          className={buttonClass("agenda")}
        >
          Agenda
        </button>
      </span>
      <span className="rbc-toolbar-label text-lg font-semibold">{label}</span>
    </div>
  );
};
