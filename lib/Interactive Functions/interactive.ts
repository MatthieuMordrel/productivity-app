import { Session } from "@/lib/types";

//To use in usePomodorCalendar and then pass it to the DnDCalendar in onEventDrop
export const handleEventDrop = (dropEvent: {
  event: Session;
  start: Date;
  end: Date;
}) => {
  const { event, start, end } = dropEvent;
  setSessions((prevSessions: Session[]) =>
    prevSessions.map((session: Session) =>
      session.id === event.id ? { ...session, start, end } : session,
    ),
  );
};
