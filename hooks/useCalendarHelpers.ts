import { useSettingsContext } from "@/contexts/SettingsContext";
import { getTimeRangeForDate } from "@/lib/functions/calendar";
import { getTypeColors } from "@/lib/logos";
import { useCurrentSession } from "@/lib/stores/currentSessionStore";
import { Session } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import { EventPropGetter } from "react-big-calendar";

export const useCalendarHelpers = () => {
  const { state } = useSettingsContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentSession = useCurrentSession();
  // console.log(currentSession);

  // Calculate time range based on current date
  const timeRange = useMemo(
    () => getTimeRangeForDate(currentDate, state.startTime, state.endTime),
    [currentDate, state.startTime, state.endTime],
  );

  // Function to get the current scroll time
  const getCurrentScrollTime = useCallback(() => new Date(), []);

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
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        opacity: event.id === currentSession?.id ? 1 : 0.7,
        backgroundColor: getTypeColors(event.type).stroke,
      },
    }),
    [currentSession],
  );

  // Check if toolbar should be shown
  const shouldShowToolbar = useMemo(
    () => state.startTime.getDate() !== state.endTime.getDate(),
    [state.startTime, state.endTime],
  );

  return {
    getCurrentScrollTime,
    eventPropGetter,
    timeRange,
    currentDate,
    handleDateChange,
    shouldShowToolbar,
  };
};
