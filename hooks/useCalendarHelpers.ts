import { useSettingsContext } from "@/contexts/SettingsContext";
import { possibleStepSizes } from "@/lib/constants";
import { getTimeRangeForDate } from "@/lib/functions/calendar";
import { Session } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import { EventPropGetter, View } from "react-big-calendar";

export const useCalendarHelpers = (sessions: Session[]) => {
  const { state } = useSettingsContext();
  const [showPauses, setShowPauses] = useState(false);
  const [showBreaks, setShowBreaks] = useState(true);
  const [view, setView] = useState<View>("day");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter events based on showPauses and showBreaks state
  const filteredEvents = useMemo(() => {
    return sessions.filter((session) => {
      if (showPauses && showBreaks) {
        return true;
      } else if (!showPauses && !showBreaks) {
        return session.type !== "Pause" && session.type !== "Break";
      } else if (showPauses) {
        return session.type !== "Break";
      } else if (showBreaks) {
        return session.type !== "Pause";
      }

      return true;
    });
  }, [sessions, showPauses, showBreaks]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prevZoom) => prevZoom + 1);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prevZoom) => prevZoom - 1);
  }, []);

  // Calculate step size based on zoom level
  const calculatedStepSize = useMemo(
    () => possibleStepSizes[zoomLevel - 1],

    [zoomLevel],
  );

  // Calculate time range based on current date
  const timeRange = useMemo(
    () => getTimeRangeForDate(currentDate, state.startTime, state.endTime),

    [currentDate, state.startTime, state.endTime],
  );

  // Function to get the current scroll time
  const getCurrentScrollTime = useCallback(() => {
    return new Date();
  }, []);

  // Handle date changes
  const handleDateChange = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  // Control the style of the events
  const eventPropGetter: EventPropGetter<Session> = useCallback(
    (event) => ({
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
    }),
    [],
  );

  // Check if toolbar should be shown
  const shouldShowToolbar = useMemo(
    () => state.startTime.getDate() !== state.endTime.getDate(),
    [state.startTime, state.endTime],
  );

  return {
    showPauses,
    setShowPauses,
    showBreaks,
    setShowBreaks,
    filteredEvents,
    getCurrentScrollTime,
    eventPropGetter,
    view,
    setView,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    calculatedStepSize,
    timeRange,
    currentDate,
    handleDateChange,
    shouldShowToolbar,
  };
};
