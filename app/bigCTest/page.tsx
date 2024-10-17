"use client";

import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Create the localizer outside the component
const localizer = momentLocalizer(moment);

// Sample events
const events = [
  {
    title: "Meeting",
    start: new Date(2024, 9, 17, 10, 0), // Note: month is 0-indexed
    end: new Date(2024, 9, 17, 11, 30),
  },
  {
    title: "Lunch",
    start: new Date(2024, 9, 17, 12, 0),
    end: new Date(2024, 9, 17, 13, 0),
  },
];

export default function BigCalendarExample() {
  // Use events directly, no need for useState if they don't change
  return (
    <div className="h-screen p-4">
      <h1 className="mb-4 text-2xl font-bold">Big Calendar Example</h1>
      <div className="h-[calc(100vh-100px)]">
        <Calendar
          // Provides the localization for dates and times
          localizer={localizer}
          events={events}
          // Specifies which property of the event object to use as the start time
          startAccessor="start"
          // Specifies which property of the event object to use as the end time
          endAccessor="end"
          // Applies custom Tailwind CSS classes for styling
          className="bg-background text-foreground"
          // Sets the initial view of the calendar to 'day'
          defaultView="day"
          // Limits the available views to only 'day' view
          views={["day"]}
          // Enables the toolbar for navigation and view selection
          toolbar={true}
        />
      </div>
    </div>
  );
}
