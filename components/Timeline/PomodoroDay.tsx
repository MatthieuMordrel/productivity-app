"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { eventPropGetter } from "@/lib/functions/calendar_functions";
import "@/styles/calendar-override.css"; // Add this line
import moment from "moment";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskList from "../task_list/TaskList";
import { ButtonToggleSessionVisibility } from "./ButtonPause";
import { CurrentSessionInfo } from "./CurrentSessionInfo";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";
import { WorkSessionSummary } from "./WorkSessionSummary";

// Create the localizer
const localizer = momentLocalizer(moment);

export function PomodoroDay() {
  console.log("PomodoroCalendar rerendering");

  // Merge usePomodoroCalendar hook logic directly into the component
  const { state } = useSettingsContext();
  const { sessions, handleResetSessions, handleDragEnd } = useSessionsContext();
  const [showPauses, setShowPauses] = useState(false);
  const [showBreaks, setShowBreaks] = useState(false);

  // Filter events based on showPauses and showBreaks state
  const events = sessions.filter((session) => {
    if (showPauses && showBreaks) {
      return true; // Show all sessions
    } else if (!showPauses && !showBreaks) {
      return session.type !== "Pause" && session.type !== "Break";
    } else if (showPauses) {
      return session.type !== "Break";
    } else if (showBreaks) {
      return session.type !== "Pause";
    }
    return true; // Default case, should not be reached
  });

  // Function to determine the appropriate step size based on pomodoro duration
  const getStepSize = () => {
    const pomodoroDuration = state.pomodoroDuration;

    // If pomodoro duration is less than or equal to 15 minutes, use 5-minute steps
    if (pomodoroDuration <= 15) {
      return 5;
    }
    // If pomodoro duration is between 16 and 30 minutes, use 10-minute steps
    else if (pomodoroDuration <= 30) {
      return 10;
    } else if (pomodoroDuration <= 45) {
      return 20;
    }
    // For longer durations, use 15-minute steps
    else {
      return 30;
    }
  };

  // Calculate the step size
  const stepSize = getStepSize();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 className="text-2xl font-semibold">Pomodoro Day Timeline</h2>

      <div className="relative mx-auto w-full max-w-4xl rounded-xl bg-background p-6 text-foreground shadow-lg">
        <ButtonToggleSessionVisibility
          onToggle={setShowPauses}
          isActive={showPauses}
          label="Pauses"
        />
        <ButtonToggleSessionVisibility
          onToggle={setShowBreaks}
          isActive={showBreaks}
          label="Breaks"
        />
        <button onClick={handleResetSessions} className="">
          Reset Sessions
        </button>
        <CurrentSessionInfo />
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
                step={stepSize}
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
