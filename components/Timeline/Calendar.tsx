"use client";

import { useCurrentSession } from "@/contexts/currentSessionStore";
import { useCalendarHelpers } from "@/hooks/useCalendarHelpers";
import { timeslots } from "@/lib/constants";
import { CalendarViews, Session } from "@/lib/types";
import { timeFormat } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";

const localizer = momentLocalizer(moment);

interface CalendarProps {
  view: CalendarViews;
  filteredEvents: Session[]; // Replace 'any' with your event type
  calculatedStepSize: number;
  isAmericanFormat: boolean;
}

export function CalendarComponent({
  view,
  filteredEvents,
  calculatedStepSize,
  isAmericanFormat,
}: CalendarProps) {
  const {
    getCurrentScrollTime,
    eventPropGetter,
    timeRange,
    currentDate,
    handleDateChange,
    shouldShowToolbar,
  } = useCalendarHelpers();

  const currentSession = useCurrentSession();

  console.log("Calendar re-rendered");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          view={view}
          formats={{
            timeGutterFormat: (date) => timeFormat(date, isAmericanFormat),
          }}
          views={["day", "agenda", "week"]}
          toolbar={true}
          dayLayoutAlgorithm="no-overlap"
          step={calculatedStepSize}
          timeslots={timeslots}
          min={timeRange.calendarStartTime}
          max={timeRange.calendarEndTime}
          eventPropGetter={eventPropGetter as EventPropGetter<object>}
          className="rounded-lg"
          scrollToTime={getCurrentScrollTime()}
          showMultiDayTimes={true}
          date={currentDate}
          components={{
            event: (props) =>
              view === "day" ? (
                <EventComponent
                  event={props.event}
                  view={view}
                  currentSession={
                    props.event.id === currentSession?.id ? true : false
                  }
                />
              ) : (
                <div>{props.event.taskTitle}</div>
              ),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toolbar: (toolbarProps: any) => {
              return shouldShowToolbar ? (
                <CustomToolbar
                  {...toolbarProps}
                  onDateChange={handleDateChange}
                />
              ) : null;
            },
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
