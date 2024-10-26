"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { useCalendarHelpers } from "@/hooks/useCalendarHelpers";
import { possibleStepSizes, timeslots } from "@/lib/constants";
import "@styles/calendar-agenda.css";
import "@styles/calendar-event.css";
import "@styles/calendar-header.css";
import "@styles/calendar-override.css";
import "@styles/calendar-scrollbar.css";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Calendar,
  EventPropGetter,
  momentLocalizer,
  View,
} from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SheetSettings } from "../settings/SheetSettings";
import { Card } from "../ui/card";
import CalendarButtons from "./CalendarButtons";
import CalendarZoom from "./CalendarZoom";
import { EventComponent } from "./EventComponent";
import NoSession from "./NoSession";
import { CustomToolbar } from "./Toolbar";
import ViewSwitch from "./ViewSwitch";

// Dynamic import for Time component to avoid hydration errors
const Time = dynamic(() => import("./Time").then((mod) => mod.Time), {
  ssr: false,
});

const localizer = momentLocalizer(moment);

export default function PomodoroDay() {
  console.log("PomodoroDay component rendered");
  const { state } = useSettingsContext();
  const { sessions } = useSessionsContext();
  const {
    filteredEvents,
    getCurrentScrollTime,
    showPauses,
    showBreaks,
    setShowPauses,
    setShowBreaks,
    eventPropGetter,
  } = useCalendarHelpers(sessions);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [view, setView] = useState<View>("day");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Zoom in function
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 1);
  };

  // Zoom out function
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => prevZoom - 1);
  };

  const calculatedStepSize = possibleStepSizes[zoomLevel - 1];

  console.log("state", state);

  return (
    <div className="container mx-auto">
      <Card className="overflow-hidden">
        <div className="p-6">
          {sessions.length === 0 ? (
            <NoSession />
          ) : (
            <div className="flex flex-col space-y-4">
              <Time />
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between space-x-4">
                  <ViewSwitch view={view} setView={setView} />
                  {/* Add CalendarZoom component */}

                  <SheetSettings
                    isSettingsOpen={isSettingsOpen}
                    setIsSettingsOpen={setIsSettingsOpen}
                  />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <CalendarZoom
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                  />
                  <CalendarButtons
                    showPauses={showPauses}
                    setShowPauses={setShowPauses}
                    showBreaks={showBreaks}
                    setShowBreaks={setShowBreaks}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="calendarHeight"
                >
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    view={view as "day" | "agenda"}
                    views={["day", "agenda"]}
                    toolbar={false}
                    dayLayoutAlgorithm="no-overlap"
                    step={calculatedStepSize}
                    timeslots={timeslots}
                    min={state.startTime}
                    max={state.endTime}
                    eventPropGetter={eventPropGetter as EventPropGetter<object>}
                    components={{
                      //react-big-calendar passes event and titles as props
                      event: (props) =>
                        view === "day" ? (
                          <EventComponent event={props.event} view={view} />
                        ) : (
                          <div>{props.event.taskTitle}</div>
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
