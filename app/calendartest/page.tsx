"use client";

import { DateTime } from "luxon";
import { useMemo } from "react";
import { Calendar, luxonLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Make sure to specify the timezone explicitly
const localizer = luxonLocalizer(DateTime, {
  firstDayOfWeek: 1,
});

export default function CalendarTest() {
  // Memoize the views and any other calendar configurations
  const { views, formats, components } = useMemo(
    () => ({
      views: ["day", "agenda"],
      formats: {
        timeGutterFormat: (date: Date) => {
          // Create DateTime with explicit timezone
          const dt = DateTime.fromJSDate(date, { zone: "Europe/Paris" });
          // Add indication for the time standard
          const timeStandard = dt.isInDST ? "(Summer)" : "(Standard)";
          // Only show the standard indication during the transition hour
          const shouldShowStandard = dt.hour === 1 || dt.hour === 2;
          return (
            dt.toFormat("HH:mm") +
            (shouldShowStandard ? ` ${timeStandard}` : "")
          );
        },
        eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
          const startDt = DateTime.fromJSDate(start, { zone: "Europe/Paris" });
          const endDt = DateTime.fromJSDate(end, { zone: "Europe/Paris" });
          return `${startDt.toFormat("HH:mm")} - ${endDt.toFormat("HH:mm")}`;
        },
      },
      components: {
        event: () => <div></div>,
      },
    }),
    [],
  );

  // Set dates for DST transition day
  const startSecondDay = DateTime.fromObject(
    {
      year: 2024,
      month: 10,
      day: 27,
    },
    {
      zone: "Europe/Paris", // Explicitly set timezone
    },
  )
    .startOf("day")
    .toJSDate();

  const endSecondDay = DateTime.fromObject(
    {
      year: 2024,
      month: 10,
      day: 27,
    },
    {
      zone: "Europe/Paris",
    },
  )
    .endOf("day")
    .toJSDate();

  // Create 8 events starting at 2 AM on October 27th
  const events = Array.from({ length: 8 }).map((_, index) => {
    const baseTime = DateTime.fromObject({
      year: 2024,
      month: 10,
      day: 27,
    })
      .startOf("day")
      .plus({ hours: 2 });

    const eventStart = baseTime.plus({ minutes: index * 15 }).toJSDate();
    const eventEnd = DateTime.fromJSDate(eventStart)
      .plus({ minutes: 15 })
      .toJSDate();

    return {
      title: `Event ${index + 1}`,
      start: eventStart,
      end: eventEnd,
    };
  });

  console.log(startSecondDay);
  console.log(endSecondDay);

  return (
    <div className="h-screen p-4">
      <Calendar
        formats={formats}
        localizer={localizer}
        events={events}
        defaultView="day"
        views={views as View[]}
        //limit the view to the second day
        date={startSecondDay}
        min={startSecondDay}
        max={endSecondDay}
        className="rounded-lg bg-background p-4 text-foreground shadow-lg"
        toolbar={true}
        step={30}
        dayLayoutAlgorithm="no-overlap"
        timeslots={1}
        components={components}
        getNow={() => startSecondDay}
        slotPropGetter={(date: Date) => {
          const dt = DateTime.fromJSDate(date, { zone: "Europe/Paris" });
          return {
            className:
              dt.hour === 1 || dt.hour === 2 ? "dst-transition-slot" : "",
          };
        }}
      />
    </div>
  );
}
