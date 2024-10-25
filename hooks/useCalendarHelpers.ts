import { useSettingsContext } from "@/contexts/SettingsContext";
import { Session } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import { EventPropGetter } from "react-big-calendar";

export const useCalendarHelpers = (sessions: Session[]) => {
  const { state } = useSettingsContext();
  const [showPauses, setShowPauses] = useState(false);
  const [showBreaks, setShowBreaks] = useState(true);

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
  const getStepSize = useCallback(() => {
    const pomodoroDuration = state.pomodoroDuration;

    if (pomodoroDuration <= 15) {
      return 10;
    } else if (pomodoroDuration <= 30) {
      return 15;
    } else if (pomodoroDuration <= 45) {
      return 20;
    } else {
      return 30;
    }
  }, [state.pomodoroDuration]);

  // Calculate the step size
  const stepSize = useMemo(() => getStepSize(), [getStepSize]);

  // Function to get the current scroll time
  const getCurrentScrollTime = useCallback(() => {
    const now = new Date();
    return now;
  }, []);

  //Control the style of the events
  const eventPropGetter: EventPropGetter<Session> = (event) => ({
    style: {
      cursor: "default",
      outline: "none",
      color: "white",
      backgroundColor:
        event?.type === "Work"
          ? "var(--work)"
          : event?.type === "Break"
            ? "var(--break)"
            : "var(--pause)",
    },
  });

  return {
    showPauses,
    setShowPauses,
    showBreaks,
    setShowBreaks,
    filteredEvents,
    stepSize,
    getCurrentScrollTime,
    eventPropGetter,
  };
};
