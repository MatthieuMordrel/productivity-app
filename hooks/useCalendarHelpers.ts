import { useSettingsContext } from "@/contexts/SettingsContext";
import { Session } from "@/lib/types";
import { useMemo, useState } from "react";

export const useCalendarHelpers = (sessions: Session[]) => {
  const { state } = useSettingsContext();
  const [showPauses, setShowPauses] = useState(false);
  const [showBreaks, setShowBreaks] = useState(false);

  // Filter events based on showPauses and showBreaks state
  const filteredEvents = useMemo(() => {
    return sessions.filter((session) => {
      if (showPauses && showBreaks) {
        return true; // Show all sessions
      } else if (!showPauses && !showBreaks) {
        return session.type !== "Pause" && session.type !== "Break";
      } else if (showPauses) {
        return session.type !== "Break";
      } else if (showBreaks) {
        return session.type !== "Pause";
      }
      return true; // Default case, should not be reached
    });
  }, [sessions, showPauses, showBreaks]);

  // Function to determine the appropriate step size based on pomodoro duration
  const getStepSize = () => {
    const pomodoroDuration = state.pomodoroDuration;

    if (pomodoroDuration <= 15) {
      return 5;
    } else if (pomodoroDuration <= 30) {
      return 10;
    } else if (pomodoroDuration <= 45) {
      return 20;
    } else {
      return 30;
    }
  };

  // Calculate the step size
  const stepSize = getStepSize();

  return {
    showPauses,
    setShowPauses,
    showBreaks,
    setShowBreaks,
    filteredEvents,
    stepSize,
  };
};
