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

// Add this helper function at the top of the file
const getTimeRangeForDate = (
  date: Date,
  startTime: Date,
  endTime: Date,
): { calendarStartTime: Date; calendarEndTime: Date } => {
  const selectedDate = moment(date).startOf("day");
  const startDate = moment(startTime).startOf("day");
  const endDate = moment(endTime).startOf("day");

  // If start and end are on the same day, use exact times
  if (startDate.isSame(endDate, "day")) {
    return {
      calendarStartTime: startTime,
      calendarEndTime: endTime,
    };
  }

  // Multi-day handling
  if (selectedDate.isSame(startDate, "day")) {
    // If it's the first day, use the actual start time and end at 23:59
    return {
      calendarStartTime: startTime,
      calendarEndTime: moment(date).endOf("day").toDate(),
    };
  } else if (selectedDate.isSame(endDate, "day")) {
    // If it's the last day, start at 00:00 and use the actual end time
    return {
      calendarStartTime: moment(date).startOf("day").toDate(),
      calendarEndTime: endTime,
    };
  } else {
    // For any day in between, show full day
    return {
      calendarStartTime: moment(date).startOf("day").toDate(),
      calendarEndTime: moment(date).endOf("day").toDate(),
    };
  }
};

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

  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate time range based on current date
  const { calendarStartTime, calendarEndTime } = getTimeRangeForDate(
    currentDate,
    state.startTime,
    state.endTime,
  );

  // Add this function to handle date changes
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

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
                    //Disbale view toolbar
                    toolbar={true}
                    dayLayoutAlgorithm="no-overlap"
                    step={calculatedStepSize}
                    timeslots={timeslots}
                    min={calendarStartTime}
                    max={calendarEndTime}
                    eventPropGetter={eventPropGetter as EventPropGetter<object>}
                    className="h-full rounded-lg border shadow-sm"
                    scrollToTime={getCurrentScrollTime()}
                    showMultiDayTimes={true}
                    date={currentDate}
                    components={{
                      event: (props) =>
                        view === "day" ? (
                          <EventComponent event={props.event} view={view} />
                        ) : (
                          <div>{props.event.taskTitle}</div>
                        ),
                      toolbar: (toolbarProps) => {
                        // Only show toolbar if start and end times are on different days
                        if (
                          state.startTime.getDate() !== state.endTime.getDate()
                        ) {
                          return (
                            <CustomToolbar
                              {...toolbarProps}
                              onDateChange={handleDateChange}
                            />
                          );
                        }
                        // Return null to hide toolbar when on same day
                        return null;
                      },
                    }}
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
