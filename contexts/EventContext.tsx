"use client";

import { Session } from "@/lib/types";
import { createContext, useContext, useMemo, useState } from "react";
import { useSessionsContext } from "./SessionsContext";

interface EventContextType {
  showPauses: boolean;
  setShowPauses: (value: boolean) => void;
  showBreaks: boolean;
  setShowBreaks: (value: boolean) => void;
  filteredEvents: Session[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const { sessions } = useSessionsContext();
  const [showPauses, setShowPauses] = useState(false);
  const [showBreaks, setShowBreaks] = useState(true);

  // Filter sessions based on the selected filters
  const filteredEvents = useMemo(() => {
    return sessions.filter((session) => {
      if (showPauses && showBreaks) return true;
      if (!showPauses && !showBreaks)
        return session.type !== "Pause" && session.type !== "Break";
      if (showPauses) return session.type !== "Break";
      if (showBreaks) return session.type !== "Pause";
      return true;
    });
  }, [sessions, showPauses, showBreaks]);

  return (
    <EventContext.Provider
      value={{
        showPauses,
        setShowPauses,
        showBreaks,
        setShowBreaks,
        filteredEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
}
