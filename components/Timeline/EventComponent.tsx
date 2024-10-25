import { Session } from "@lib/types";
import { Clock, Coffee, PauseCircle } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { View } from "react-big-calendar";

export const EventComponent = ({
  event,
  view,
}: {
  event: Session;
  view: View;
}) => {
  const [componentHeight, setComponentHeight] = useState<number>(0);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = parentRef.current;
    if (element) {
      // Measure and set the height after each render
      const newHeight = element.offsetHeight;
      setComponentHeight(newHeight); // This will trigger a rerender if the height changes
    }
    // console.log(componentHeight);
  }, [componentHeight]);

  const durationMinutes = moment(event.end).diff(
    moment(event.start),
    "minutes",
  );

  // Define color schemes for different event types
  const colorSchemes = {
    Work: "bg-work ",
    Pause: "bg-pause ",
    Break: "bg-break ",
  };

  // Determine the appropriate icon based on event type
  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "Work":
        return <Clock className="h-4 w-4" />;
      case "Pause":
        return <PauseCircle className="h-4 w-4" />;
      case "Break":
        return <Coffee className="h-4 w-4" />;
    }
  };
  // console.log(colorSchemes[event.type]);

  return (
    <Droppable droppableId={`event_${event.id}`}>
      {(provided) => (
        <div
          ref={(element) => {
            provided.innerRef(element);
            parentRef.current = element;
          }}
          {...provided.droppableProps}
          className={`relative h-full rounded-md shadow-sm ${colorSchemes[event.type]}`}
        >
          {componentHeight > 45 && view === "day" ? (
            <div className="flex h-full flex-col justify-between p-2">
              <div className="mb-1 flex items-start justify-between">
                <div className="flex flex-1 items-center space-x-2">
                  <span className="flex-shrink-0" aria-hidden="true">
                    {getEventIcon(event.type)}
                  </span>
                  <div className="w-3/4 overflow-hidden text-ellipsis text-sm font-medium">
                    {event.taskTitle || "No title"}
                  </div>
                </div>
                <div className="text-xs opacity-75">{durationMinutes}m</div>
              </div>
              <div className="text-right text-xs opacity-75">
                {moment(event.start).format("HH:mm")} -{" "}
                {moment(event.end).format("HH:mm")}
              </div>
            </div>
          ) : componentHeight > 25 &&
            view === "day" &&
            event.type === "Work" ? (
            <div className="flex h-full flex-col justify-between p-2">
              <div className="mb-1 flex h-full items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                  <span className="flex-shrink-0" aria-hidden="true">
                    {getEventIcon(event.type)}
                  </span>
                  <div className="w-3/4 overflow-hidden text-ellipsis text-sm font-medium">
                    {event.taskTitle || "No title"}
                  </div>
                </div>
                {/* <div className="text-xs opacity-75">{durationMinutes}m</div> */}
              </div>
            </div>
          ) : componentHeight > 16 &&
            view === "day" &&
            event.type !== "Work" ? (
            <div className="flex h-full w-full items-center justify-center">
              <span className="flex-shrink-0" aria-hidden="true">
                {getEventIcon(event.type)}
              </span>
              <span className="sr-only">
                {event.type} event: {event.taskTitle}
              </span>
            </div>
          ) : null}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
