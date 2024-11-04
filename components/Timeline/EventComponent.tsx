import { sessionIcons } from "@/lib/logos";
import { cn, timeFormat } from "@/lib/utils";
import { Session } from "@lib/types";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { View } from "react-big-calendar";

export const EventComponent = ({
  event,
  view,
  currentSession,
}: {
  event: Session;
  view: View;
  currentSession: boolean;
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

  // Determine the appropriate icon based on event type
  const IconComponent = sessionIcons[event.type];

  return (
    <Droppable droppableId={`event_${event.id}`}>
      {(provided, snapshot) => (
        <div
          ref={(element) => {
            provided.innerRef(element);
            parentRef.current = element;
          }}
          {...provided.droppableProps}
          className={cn(
            "relative h-full cursor-default rounded-md shadow-sm",
            snapshot.isDraggingOver && "bg-foreground text-background",
            currentSession && "brightness-110",
          )}
        >
          {componentHeight > 55 && view === "day" ? (
            <div className="flex h-full flex-col justify-between p-2">
              <div className="mb-1 flex items-start justify-between">
                <div className="flex flex-1 items-center space-x-2">
                  <span className="flex-shrink-0" aria-hidden="true">
                    <IconComponent className="h-4 w-4" />
                  </span>
                  <div className="w-3/4 overflow-hidden text-ellipsis text-sm font-medium">
                    {event.taskTitle || "No title"}
                  </div>
                </div>
                <div className="text-xs opacity-75">{durationMinutes}m</div>
              </div>
              <div className="text-right text-xs opacity-75">
                {timeFormat(event.start)} - {timeFormat(event.end)}
              </div>
            </div>
          ) : componentHeight > 25 &&
            view === "day" &&
            event.type === "Work" ? (
            <div className="flex h-full flex-col justify-between p-2">
              <div className="mb-1 flex h-full items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                  <span className="flex-shrink-0" aria-hidden="true">
                    <IconComponent className="h-4 w-4" />
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
                <IconComponent className="h-4 w-4" />
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
