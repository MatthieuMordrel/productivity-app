"use client";

import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { eventPropGetter, handleEventDrop } from "@/lib/calendar_functions";
import { createPomodoroDaySessions } from "@/lib/functions";
import { Session } from "@/lib/types";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
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
  const [showPauses, setShowPauses] = useState(true);

  // Effect for updating sessions based on pomodoro state changes
  useEffect(() => {
    setSessions((prevSessions) => {
      return createPomodoroDaySessions(state, prevSessions);
    });
  }, [state]);

  // Convert filtered sessions to events
  const events = showPauses
    ? sessions
    : sessions.filter((session) => session.type !== "Pause");

  return (
    <div className="relative mx-auto w-full max-w-4xl rounded-xl bg-background p-6 text-foreground shadow-lg">
      <ButtonPause onToggle={setShowPauses} isActive={showPauses} />
      <div className="h-[600px]">
        {/* Adjust height as needed */}
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
          eventPropGetter={eventPropGetter as EventPropGetter<object>}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            event: ({ event }: any) =>
              event.type === "Work" ? (
                <EventComponent event={event} onUpdate={setSessions} />
              ) : null,
          }}
        />
      </div>
    </div>
  );
}
