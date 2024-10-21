"use client";

import { usePomodoroCalendar } from "@/hooks/usePomodoroCalendar";
import { eventPropGetter } from "@/lib/functions/calendar_functions";
import { DragDropContext } from "react-beautiful-dnd";
import { Calendar, EventPropGetter } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskList from "../task_list/TaskList";
import { ButtonPause } from "./ButtonPause";
import { CurrentSessionInfo } from "./CurrentSessionInfo";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";
import { WorkSessionSummary } from "./WorkSessionSummary";

const DnDCalendar = withDragAndDrop(Calendar);

// Add this custom toolbar component

export default function PomodoroCalendar() {
  console.log("PomodoroCalendar rerendering");
  const {
    localizer,
    events,
    sessions,
    showPauses,
    focusedEventId,
    state,
    handleDeleteSession,
    handleResetSessions,
    handleDragEnd,
    handleEventDrop,
    handleUpdateSession,
    setShowPauses,
    setFocusedEventId,
  } = usePomodoroCalendar();

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
              <DnDCalendar
                localizer={localizer}
                events={events}
                className="bg-background text-foreground"
                defaultView="day"
                views={["day", "agenda"]}
                toolbar={true}
                dayLayoutAlgorithm="no-overlap"
                resizable={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onEventDrop={handleEventDrop as any}
                step={5}
                timeslots={1}
                min={state.startTime}
                max={state.endTime}
                eventPropGetter={eventPropGetter as EventPropGetter<object>}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  event: ({ event }: any) =>
                    event.type === "Work" ? (
                      <EventComponent
                        event={event}
                        onUpdateSession={handleUpdateSession}
                        onDeleteSession={handleDeleteSession}
                        isFocused={event.id === focusedEventId}
                        onBlur={() => setFocusedEventId(null)}
                      />
                    ) : null,
                  toolbar: CustomToolbar,
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
