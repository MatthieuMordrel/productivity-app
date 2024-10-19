import { EventPropGetter } from "react-big-calendar";

import { Session } from "./types";

// Update the handleEventDrop function

export const handleEventDrop = ({
  event,
  start,
  end,
  sessions,
}: {
  event: Session;
  start: Date;
  end: Date;
  sessions: Session[];
}): Session[] => {
  // console.log("handleEventDrop called with:", { event, start, end, sessions });
  const updatedSessions = sessions.map((session) =>
    session.id === event.id ? { ...session, start: start, end: end } : session,
  );

  return [...updatedSessions]; // Explicitly return a new array
};

export const eventPropGetter: EventPropGetter<Session> = (event) => ({
  style: {
    cursor: "grab",
    backgroundColor:
      event.type === "Work"
        ? "var(--primary)"
        : event.type === "Break"
          ? "var(--secondary)"
          : "blue",
  },
});
