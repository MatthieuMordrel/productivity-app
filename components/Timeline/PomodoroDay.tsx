"use client";

import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { useTaskContext } from "@/contexts/TaskContext";
import { eventPropGetter, handleEventDrop } from "@/lib/calendar_functions";
import {
  createPomodoroDaySessions,
  onDragEnd,
  updateSession,
} from "@/lib/functions";
import { Session } from "@/lib/types";
import moment from "moment";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskList from "../task_list/TaskList";
import { ButtonPause } from "./ButtonPause";
import { EventComponent } from "./EventComponent";

// Create the localizer outside the component
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function PomodoroCalendar() {
  console.log("PomodoroCalendar rendered");
  const { state } = usePomodoroContext();
  const [sessions, setSessions] = useState<Session[]>(() =>
    createPomodoroDaySessions(state),
  );
  const [showPauses, setShowPauses] = useState(false);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);

  // This triggers when the pomodoro settings change and updates the sessions to reflect the new settings
  useEffect(() => {
    setSessions((prevSessions) => {
      return createPomodoroDaySessions(state, prevSessions);
    });
  }, [state]);

  // Convert filtered sessions to events
  const events = showPauses
    ? sessions
    : sessions.filter((session) => session.type !== "Pause");

  const { tasks } = useTaskContext();

  return (
    <DragDropContext
      onDragEnd={(dropResult) =>
        onDragEnd(dropResult, sessions, setSessions, tasks)
      }
    >
      <div className="relative mx-auto w-full max-w-4xl rounded-xl bg-background p-6 text-foreground shadow-lg">
        <ButtonPause onToggle={setShowPauses} isActive={showPauses} />
        <div>
          Number of work sessions:&nbsp;
          {sessions.filter((session) => session.type === "Work").length}
          <br />
          Total time expected working:&nbsp;
          {sessions
            .filter((session) => session.type === "Work")
            .reduce(
              (acc, workSession) =>
                acc + (workSession.end.getTime() - workSession.start.getTime()),
              0,
            ) /
            (1000 * 60)}{" "}
          {/* Convert milliseconds to minutes */}
          minutes
        </div>
        <div className="flex">
          <div className="h-[600px] flex-grow">
            <DnDCalendar
              localizer={localizer}
              events={events}
              className="bg-background text-foreground"
              defaultView="day"
              views={["day", "agenda"]}
              toolbar={true}
              dayLayoutAlgorithm="no-overlap"
              resizable={false}
              onEventDrop={(dropEvent) => {
                const { event, start, end } = dropEvent;
                const updatedSessions = handleEventDrop({
                  event,
                  start,
                  end,
                  sessions,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any);
                setSessions(updatedSessions);
              }}
              // Create a step of 5 minutes
              step={5}
              // timselots prop is used to display the time slots in the calendar, 1 corresponds to 1 slot per step
              timeslots={1}
              // Limit the calendar view to the first and last events
              min={state.startTime}
              max={state.endTime}
              // Event prop getter is used to style the events in the calendar, it change the cursor to grab and the background color of the event
              eventPropGetter={eventPropGetter as EventPropGetter<object>}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                event: ({ event }: any) =>
                  event.type === "Work" ? (
                    <EventComponent
                      event={event}
                      onUpdateSession={(updatedSession) =>
                        updateSession(
                          updatedSession,
                          setSessions,
                          setFocusedEventId,
                        )
                      }
                      isFocused={event.id === focusedEventId}
                      onBlur={() => setFocusedEventId(null)}
                    />
                  ) : null,
              }}
            />
          </div>
          <div className="w-1/3">
            <TaskList />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
