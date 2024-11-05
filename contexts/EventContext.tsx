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

  // Initialize showPauses state from localStorage, falling back to false if not set
  const [showPauses, setShowPauses] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedShowPauses = localStorage.getItem("showPauses");
      return savedShowPauses === "true" ? true : false;
    }
    return false;
  });

  // Initialize showBreaks state from localStorage, falling back to true if not set
  const [showBreaks, setShowBreaks] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedShowBreaks = localStorage.getItem("showBreaks");
      return savedShowBreaks === "false" ? false : true;
    }
    return true;
  });

  // Wrap the original setters to also update localStorage
  const handleSetShowPauses = () => {
    setShowPauses((prev) => !prev);
    localStorage.setItem("showPauses", String(!showPauses));
  };

  const handleSetShowBreaks = () => {
    setShowBreaks((prev) => !prev);
    localStorage.setItem("showBreaks", String(!showBreaks));
  };

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
        setShowPauses: handleSetShowPauses,
        showBreaks,
        setShowBreaks: handleSetShowBreaks,
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
