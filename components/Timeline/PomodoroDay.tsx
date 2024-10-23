"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { useCalendarHelpers } from "@/hooks/useCalendarHelpers";
import { eventPropGetter } from "@/lib/functions/calendar_functions";
import "@styles/calendar-agenda.css";
import "@styles/calendar-event.css";
import "@styles/calendar-override.css";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import * as React from "react";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card } from "../ui/card";
import CalendarButtons from "./CalendarButtons";
import { EventComponent } from "./EventComponent";
import NoSession from "./NoSession";
import { CustomToolbar } from "./Toolbar";
import ViewSwitch from "./ViewSwitch";

const localizer = momentLocalizer(moment);

export default function PomodoroDay() {
  const { state } = useSettingsContext();
  const { sessions } = useSessionsContext();
  const {
    filteredEvents,
    stepSize,
    getCurrentScrollTime,
    showPauses,
    showBreaks,
    setShowPauses,
    setShowBreaks,
  } = useCalendarHelpers(sessions);

  const [view, setView] = React.useState("day");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="p-6">
          {sessions.length === 0 ? (
            <NoSession />
          ) : (
            <div className="flex h-full flex-col space-y-4">
              <div className="flex items-center justify-between">
                <ViewSwitch view={view} setView={setView} />
                <CalendarButtons
                  showPauses={showPauses}
                  setShowPauses={setShowPauses}
                  showBreaks={showBreaks}
                  setShowBreaks={setShowBreaks}
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-[calc(100vh-12rem)]"
                >
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    view={view as "day" | "agenda"}
                    views={["day", "agenda"]}
                    toolbar={false}
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
                    className="h-full rounded-lg border shadow-sm"
                    scrollToTime={getCurrentScrollTime()}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
