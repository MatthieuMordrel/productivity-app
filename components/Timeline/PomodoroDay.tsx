"use client";

import { usePomodoroCalendarContext } from "@/contexts/PomodoroCalendarContext";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import { eventPropGetter } from "@/lib/functions/calendar_functions";
import moment from "moment";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskList from "../task_list/TaskList";
import { ButtonPause } from "./ButtonPause";
import { CurrentSessionInfo } from "./CurrentSessionInfo";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";
import { WorkSessionSummary } from "./WorkSessionSummary";

// Create the localizer
const localizer = momentLocalizer(moment);

export function PomodoroDay() {
  console.log("PomodoroCalendar rerendering");

  // Merge usePomodoroCalendar hook logic directly into the component
  const { state } = usePomodoroContext();
  const [showPauses, setShowPauses] = useState(false);

  const { sessions, handleResetSessions, handleDragEnd } =
    usePomodoroCalendarContext();

  // Filter events based on showPauses state
  const events = showPauses
    ? sessions
    : sessions.filter((session) => session.type !== "Pause");

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="relative mx-auto w-full max-w-4xl rounded-xl bg-background p-6 text-foreground shadow-lg">
        <ButtonPause onToggle={setShowPauses} isActive={showPauses} />
        <button onClick={handleResetSessions} className="">
          Reset Sessions
        </button>
        <CurrentSessionInfo sessions={sessions} />
        <WorkSessionSummary sessions={sessions} />

        {sessions.length === 0 ? (
          <div className="mb-4 text-center text-red-500">
            No sessions available. Please check your time settings.
          </div>
        ) : (
          <div className="flex">
            <div className="h-[600px] flex-grow">
              <Calendar
                localizer={localizer}
                events={events}
                className="bg-background text-foreground"
                defaultView="day"
                views={["day", "agenda"]}
                toolbar={true}
                dayLayoutAlgorithm="no-overlap"
                step={5}
                timeslots={1}
                min={state.startTime}
                max={state.endTime}
                eventPropGetter={eventPropGetter as EventPropGetter<object>}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  event: ({ event }: any) =>
                    event.type === "Work" ? (
                      <EventComponent event={event} />
                    ) : null,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  toolbar: CustomToolbar as any,
                }}
              />
            </div>
            <div className="w-1/3">
              <TaskList />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}
