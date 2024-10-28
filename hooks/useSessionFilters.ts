import { Session } from "@/lib/types";
import { useMemo, useState } from "react";

export const useSessionFilters = (sessions: Session[]) => {
  const [showPauses, setShowPauses] = useState(false);
  const [showBreaks, setShowBreaks] = useState(true);

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

  return {
    showPauses,
    setShowPauses,
    showBreaks,
    setShowBreaks,
    filteredEvents,
  };
};
