import { useSessionsContext } from "@/contexts/SessionsContext";
import { useTitle } from "@/hooks/useTitle";
import { findCurrentSession } from "@/lib/functions/sessionsUtils";
import { Session } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

// Custom type for the hook's return value
type CurrentSessionInfo = {
  currentSession: Session | null;
  remainingTime: string;
  progress: number;
};

export const useCurrentSession = (): CurrentSessionInfo => {
  const { sessions } = useSessionsContext();
  const [sessionInfo, setSessionInfo] = useState<CurrentSessionInfo>({
    currentSession: null,
    remainingTime: "",
    progress: 0,
  });
  const setTitle = useTitle();

  // Function to calculate remaining time and progress
  const calculateTimeAndProgress = useCallback(
    (
      current: Session | null,
      now: Date,
    ): Pick<CurrentSessionInfo, "remainingTime" | "progress"> => {
      if (!current) return { remainingTime: "", progress: 0 };

      const remainingMs = current.end.getTime() - now.getTime();
      const totalDuration = current.end.getTime() - current.start.getTime();
      const elapsedDuration = now.getTime() - current.start.getTime();

      const remainingMinutes = Math.floor(remainingMs / 60000);
      const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
      const remainingTime = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      const progress = Math.min(elapsedDuration / totalDuration, 1);

      return { remainingTime, progress };
    },
    [],
  );

  // Function to update the current session and time to display in the timer
  const updateSessionAndTime = useCallback(() => {
    const now = new Date();
    const current = findCurrentSession(sessions);
    const { remainingTime, progress } = calculateTimeAndProgress(current, now);

    setSessionInfo({ currentSession: current, remainingTime, progress });
  }, [sessions, calculateTimeAndProgress]);

  // Update the current session and time to display in the timer
  useEffect(() => {
    updateSessionAndTime();
    const interval = setInterval(updateSessionAndTime, 1000);
    return () => clearInterval(interval);
  }, [updateSessionAndTime]);

  // Update title when the current session changes
  useEffect(() => {
    const { currentSession, remainingTime } = sessionInfo;
    setTitle(
      currentSession
        ? `${remainingTime} - ${currentSession.taskTitle}`
        : "No active session",
    );
  }, [sessionInfo, setTitle]);

  return sessionInfo;
};
