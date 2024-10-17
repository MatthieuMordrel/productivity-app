"use client";

import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { usePomodoroDaySessions } from "@/lib/hooks";
import { Session } from "@/lib/types";
import moment from "moment";
import { useState } from "react";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ButtonPause } from "./ButtonPause";

// Create the localizer outside the component
const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(Calendar);

export default function PomodoroCalendar() {
  const { state } = usePomodoroContext();
  const sessions: Session[] = usePomodoroDaySessions(state);
  const [showPauses, setShowPauses] = useState(true);

  // Convert filtered sessions to events
  const events = showPauses
    ? sessions
    : sessions.filter((session) => session.type !== "Pause");

  const eventPropGetter: EventPropGetter<Session> = (event) => ({
    style: {
      backgroundColor:
        event.type === "Work" ? "var(--primary)" : "var(--secondary)",
    },
  });

  // Update the handleEventDrop function
  const handleEventDrop = ({
    event,
    start,
    end,
  }: {
    event: Session;
    start: Date;
    end: Date;
  }) => {
    console.log("Event dropped:", { event, start, end });
    // find function returns a reference to the object in the array that matches the condition
    const sessionToUpdate = sessions.find((session) => session.id === event.id);
    // This directly updates the correct session in the sessions array
    if (sessionToUpdate) {
      sessionToUpdate.start = start;
      sessionToUpdate.end = end;
    }
  };

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEventDrop={handleEventDrop as any}
          // Create a step of 5 minutes
          step={5}
          // timselots prop is used to display the time slots in the calendar, 1 corresponds to 1 slot per step
          timeslots={1}
          // Limit the calendar view to the first and last events
          min={state.startTime}
          max={state.endTime}
          dayLayoutAlgorithm="no-overlap"
          eventPropGetter={eventPropGetter as EventPropGetter<object>}
        />
      </div>
    </div>
  );
}
