"use client";

import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Create a localizer using moment
const localizer = momentLocalizer(moment);

export default function CalendarTest() {
  // Get today at 9 AM
  const start = moment().startOf("day").add(9, "hours").toDate();

  // Get tomorrow at 6 PM (18:00)
  const end = moment().add(1, "day").startOf("day").add(18, "hours").toDate();

  return (
    <div className="h-screen p-4">
      <div className="grid h-[90vh] grid-cols-2 gap-4">
        <Calendar
          localizer={localizer}
          events={[]}
          defaultView="day"
          views={["day", "agenda"]}
          min={start}
          max={moment().endOf("day").toDate()} // End at midnight
          className="rounded-lg bg-background p-4 text-foreground shadow-lg"
          toolbar={true}
          step={30}
          timeslots={2}
        />
        <Calendar
          localizer={localizer}
          events={[]}
          defaultView="day"
          views={["day"]}
          date={moment().add(1, "day").toDate()} // Set to tomorrow
          min={moment().add(1, "day").startOf("day").toDate()} // Start at midnight
          max={end}
          className="rounded-lg bg-background p-4 text-foreground shadow-lg"
          toolbar={true}
          step={30}
          timeslots={2}
        />
      </div>
    </div>
  );
}
