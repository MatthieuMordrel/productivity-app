"use client";

import { useCalendarHelpers } from "@/hooks/useCalendarHelpers";
import { timeslots } from "@/lib/constants";
import { Session } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";

const localizer = momentLocalizer(moment);

interface CalendarProps {
  view: "day" | "agenda";
  filteredEvents: Session[]; // Replace 'any' with your event type
  calculatedStepSize: number;
}

export function CalendarComponent({
  view,
  filteredEvents,
  calculatedStepSize,
}: CalendarProps) {
  const {
    getCurrentScrollTime,
    eventPropGetter,
    timeRange,
    currentDate,
    handleDateChange,
    shouldShowToolbar,
  } = useCalendarHelpers();

  console.log("Calendar re-rendered");

  return (
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
          view={view}
          formats={{
            timeGutterFormat: (date: Date) => moment(date).format("h:mm a"),
          }}
          views={["day", "agenda"]}
          toolbar={true}
          dayLayoutAlgorithm="no-overlap"
          step={calculatedStepSize}
          timeslots={timeslots}
          min={timeRange.calendarStartTime}
          max={timeRange.calendarEndTime}
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
