import { usePomodoroCalendarContext } from "@/contexts/PomodoroCalendarContext";
import { Session } from "@/lib/types";
import { Droppable } from "react-beautiful-dnd";

export const EventComponent = ({ event }: { event: Session }) => {
  const { handleDeleteSession } = usePomodoroCalendarContext();

  return (
    <Droppable droppableId={`event_${event.id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="relative h-full rounded-md p-2 shadow-sm"
        >
          {/* Delete button */}
          <button
            type="button"
            onClick={() => handleDeleteSession(event.id)}
            className="absolute right-2 top-2 text-foreground opacity-50 hover:opacity-100 focus:outline-none"
            aria-label="Delete session"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="red"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>

          {/* Non-editable task title */}
          <div className="flex h-1/4 space-x-2">
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-primary bg-inherit px-2 py-1 text-xl text-foreground">
              {event.taskTitle || "No title"}
            </div>
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
