import { Session } from "@/lib/types";
import moment from "moment";
import { Droppable } from "react-beautiful-dnd";

export const EventComponent = ({ event }: { event: Session }) => {
  // Calculate the duration in minutes
  const durationMinutes = moment(event.end).diff(
    moment(event.start),
    "minutes",
  );

  return (
    <Droppable droppableId={`event_${event.id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="@container relative h-full rounded-md bg-inherit bg-opacity-10 text-white shadow-sm transition-colors duration-200 hover:bg-opacity-20"
        >
          <div className="flex h-full flex-col justify-between">
            {/* Top section: Title and Duration */}
            <div className="mb-1 flex items-start justify-between">
              {/* Task title */}
              <div className="w-3/4 overflow-hidden text-ellipsis font-semibold">
                {event.taskTitle || "No title"}
              </div>
              {/* Duration */}
              <div className="text-sm opacity-75">{durationMinutes}m</div>
            </div>

            {/* Bottom section: Time */}
            <div className="text-right text-sm opacity-75">
              {moment(event.start).format("HH:mm")} -{" "}
              {moment(event.end).format("HH:mm")}
            </div>
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
