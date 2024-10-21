"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { useCalendarHelpers } from "@/hooks/useCalendarHelpers";
import { eventPropGetter } from "@/lib/functions/calendar_functions";
import "@styles/calendar-override.css";
import moment from "moment";
import { DragDropContext } from "react-beautiful-dnd";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarButtons from "./CalendarButtons";
import CalendarInfo from "./CalendarInfo";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";

const localizer = momentLocalizer(moment);

export default function PomodoroDay() {
  const { state } = useSettingsContext();
  const { sessions, handleDragEnd } = useSessionsContext();
  const {
    showPauses,
    setShowPauses,
    showBreaks,
    setShowBreaks,
    filteredEvents,
    stepSize,
    getCurrentScrollTime,
  } = useCalendarHelpers(sessions);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-xl bg-background p-6 shadow-lg">
            {sessions.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-red-500">
                <p>No sessions available. Please check your time settings.</p>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="h-[calc(100vh-9rem)] flex-grow">
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
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
                      event: ({ event }: { event: any }) => (
                        <EventComponent event={event} />
                      ),
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      toolbar: CustomToolbar as any,
                    }}
                    className="bg-card text-card-foreground h-full rounded-lg border shadow-sm"
                    scrollToTime={getCurrentScrollTime()}
                  />
                </div>
                <CalendarButtons
                  showPauses={showPauses}
                  setShowPauses={setShowPauses}
                  showBreaks={showBreaks}
                  setShowBreaks={setShowBreaks}
                />
              </div>
            )}
          </div>
          <CalendarInfo />
        </div>
      </div>
    </DragDropContext>
  );
}
