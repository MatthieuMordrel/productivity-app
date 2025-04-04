// Function to update a specific session
import { Session, SessionType } from "../types";

// This funciton is used to update the title of a session when the user is renaming a task
export const updateSingleSession = (
  updatedSession: Session,
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>,
  setFocusedEventId: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  setSessions((prevSessions) => {
    const newSessions = prevSessions.map((session) =>
      session.id === updatedSession.id ? updatedSession : session,
    );
    // Set the focused event ID after updating
    setFocusedEventId(updatedSession.id);
    return newSessions;
  });
};

/**
 * Finds the currently active session based on the current time
 * @param sessions - Array of all sessions to search through
 * @returns The currently active session if one exists, null otherwise
 * @example
 * const currentSession = findCurrentSession(sessions);
 * if (currentSession) {
 *   // Handle active session
 * } else {
 *   // No active session
 * }
 */
export const findCurrentSession = (sessions: Session[]): Session | null => {
  const now = new Date();
  return (
    sessions.find((session) => now >= session.start && now < session.end) ||
    null
  );
};

/**
 * Calculates the total duration, count of sessions, passed duration, remaining duration,
 * percentages for a specific type, and percentage of total duration.
 * @param sessions - Array of all sessions
 * @param type - Type of session to calculate for (SessionType)
 * @returns Object containing total duration, count of sessions, passed duration, remaining duration,
 * percentage passed, percentage remaining, and percentage of total duration in minutes
 */
export const getSessionTypeStats = (
  sessions: Session[],
  type: SessionType,
): {
  totalDuration: number;
  sessionCount: number;
  passedDuration: number;
  remainingDuration: number;
  percentagePassed: number;
  percentageRemaining: number;
  percentageOfAllSessionsType: number;
} => {
  // Filter sessions by type
  const filteredSessions = sessions.filter((session) => session.type === type);
  const now = new Date();

  let totalDuration = 0;
  let passedDuration = 0;
  let remainingDuration = 0;
  let allSessionsDuration = 0;

  // Calculate total duration for all sessions
  sessions.forEach((session) => {
    allSessionsDuration +=
      (session.end.getTime() - session.start.getTime()) / (1000 * 60);
  });

  // Calculate durations for the specific session type
  filteredSessions.forEach((session) => {
    const sessionDuration =
      (session.end.getTime() - session.start.getTime()) / (1000 * 60); // Convert to minutes
    totalDuration += sessionDuration;

    // Calculate passed duration if the current time is after the session end
    if (now >= session.end) {
      passedDuration += sessionDuration;
    } else if (now <= session.start) {
      remainingDuration += sessionDuration;
    } else {
      // Calculate passed and remaining duration in the current session
      const passedInSession =
        (now.getTime() - session.start.getTime()) / (1000 * 60);
      const remainingInSession =
        (session.end.getTime() - now.getTime()) / (1000 * 60);
      passedDuration += passedInSession;
      remainingDuration += remainingInSession;
    }
  });

  // Calculate percentages
  const percentagePassed =
    totalDuration > 0 ? (passedDuration / totalDuration) * 100 : 0;
  const percentageRemaining =
    totalDuration > 0 ? (remainingDuration / totalDuration) * 100 : 0;
  const percentageOfAllSessionsType =
    allSessionsDuration > 0 ? (totalDuration / allSessionsDuration) * 100 : 0;

  return {
    totalDuration,
    sessionCount: filteredSessions.length,
    passedDuration,
    remainingDuration,
    percentagePassed,
    percentageRemaining,
    percentageOfAllSessionsType,
  };
};

/**
 * Calculates the progress and remaining time for a session
 *
 * @param current - The current active session
 * @param now - The current timestamp
 * @returns Object containing:
 *   - remainingTime: Formatted string of remaining minutes:seconds
 *   - progress: Number between 0-1 representing completion percentage
 *   - isComplete: Boolean indicating if session is complete
 */
export const calculateSessionProgress = (current: Session, now: Date) => {
  const remainingMs = current.end.getTime() - now.getTime();
  const totalDuration = current.end.getTime() - current.start.getTime();
  const elapsedDuration = now.getTime() - current.start.getTime();
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
  const remainingTime = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  const progress = Math.min(elapsedDuration / totalDuration, 1);
  const isComplete = remainingMs <= 1000;

  return { remainingTime, progress, isComplete };
};
