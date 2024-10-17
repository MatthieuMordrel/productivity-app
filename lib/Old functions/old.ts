import { useMemo } from "react";
import { Session } from "../types";
export interface TimeSegment {
  start: Date;
  end: Date;
  type: "Work" | "Pause" | "Empty";
  percentage: number;
}

export interface HourBlock {
  hour: Date;
  segments: TimeSegment[];
}

// This hook is used to get the hours to display on the timeline
export function useHoursToDisplay(startTime: string, endTime: string): Date[] {
  return useMemo(() => {
    const hours = [];
    const currentHour = new Date(`2023-01-01T${startTime.split(":")[0]}:00:00`);
    const endHour = new Date(`2023-01-01T${endTime.split(":")[0]}:00:00`);
    endHour.setHours(endHour.getHours() + 1); // Include the last hour
    while (currentHour < endHour) {
      hours.push(new Date(currentHour));
      currentHour.setHours(currentHour.getHours() + 1);
    }
    // console.log(hours);
    return hours;
  }, [startTime, endTime]);
}

// This hook tailor the sessions to the hours to display and add empty sessions when needed
export function useHourBlocks(
  hoursToDisplay: Date[],
  sessions: Session[],
): HourBlock[] {
  return useMemo(() => {
    return hoursToDisplay.map((hour): HourBlock => {
      const hourEnd = new Date(hour);
      hourEnd.setHours(hourEnd.getHours() + 1); // Calculate the end of the current hour

      // Filter sessions that fall within the current hour
      const hourSessions = sessions.filter(
        (session) => session.start < hourEnd && session.end > hour,
      );

      const segments: TimeSegment[] = [];
      let startHour = new Date(hour); // Initialize startHour to the current hour

      // Iterate through each session within the current hour
      hourSessions.forEach((session) => {
        const segmentStart = new Date(
          Math.max(session.start.getTime(), hour.getTime()),
        );
        const segmentEnd = new Date(
          Math.min(session.end.getTime(), hourEnd.getTime()),
        );

        // If there's a gap before the session starts, add an empty segment
        if (segmentStart > startHour) {
          segments.push({
            start: startHour,
            end: segmentStart,
            type: "Empty",
            percentage:
              ((segmentStart.getTime() - startHour.getTime()) / 3600000) * 100,
          });
        }

        // Add the current session segment
        segments.push({
          start: segmentStart,
          end: segmentEnd,
          type: session.type,
          percentage:
            ((segmentEnd.getTime() - segmentStart.getTime()) / 60000 / 60) *
            100,
        });

        startHour = segmentEnd; // Update startHour to the end of the last segment
      });

      // Add an empty session to fill the remaining time in the last hour
      if (startHour < hourEnd) {
        segments.push({
          start: startHour,
          end: hourEnd,
          type: "Empty",
          percentage:
            ((hourEnd.getTime() - startHour.getTime()) / 3600000) * 100,
        });
      }

      // Return the hour block with its segments
      return { hour, segments };
    });
  }, [hoursToDisplay, sessions]);
}
