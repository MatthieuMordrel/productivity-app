import { useCompletion } from "@/contexts/CompletionContext";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { findCurrentSession } from "@/lib/functions/sessionsUtils";
import { Session } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

// Custom type for the hook's return value
type CurrentSessionInfo = {
  currentSession: Session | null;
  remainingTime: string;
  progress: number;
  isComplete: boolean;
};

export const useCurrentSession = (): CurrentSessionInfo => {
  const { sessions } = useSessionsContext();
  const { handleCompletion } = useCompletion();
  const [sessionInfo, setSessionInfo] = useState<CurrentSessionInfo>({
    currentSession: null,
    remainingTime: "",
    progress: 0,
    isComplete: false,
  });

  // Function to calculate remaining time and progress
  const calculateTimeAndProgress = useCallback(
    (current: Session | null, now: Date) => {
      if (!current)
        return { remainingTime: "", progress: 0, isComplete: false };

      const remainingMs = current.end.getTime() - now.getTime();
      const totalDuration = current.end.getTime() - current.start.getTime();
      const elapsedDuration = now.getTime() - current.start.getTime();

      const remainingMinutes = Math.floor(remainingMs / 60000);
      const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
      const remainingTime = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      const progress = Math.min(elapsedDuration / totalDuration, 1);
      const isComplete = remainingMs <= 1000;

      return { remainingTime, progress, isComplete };
    },
    [],
  );

  // Function to update the current session and time
  const updateSessionAndTime = useCallback(() => {
    const now = new Date();
    const current = findCurrentSession(sessions);
    const { remainingTime, progress, isComplete } = calculateTimeAndProgress(
      current,
      now,
    );

    // Check if the session is newly completed
    if (isComplete && !sessionInfo.isComplete && current) {
      handleCompletion();
    }

    setSessionInfo({
      currentSession: current,
      remainingTime,
      progress,
      isComplete,
    });
  }, [
    sessions,
    calculateTimeAndProgress,
    handleCompletion,
    sessionInfo.isComplete,
  ]);

  // Update the current session and time
  useEffect(() => {
    updateSessionAndTime();
    const interval = setInterval(updateSessionAndTime, 1000);
    return () => clearInterval(interval);
  }, [updateSessionAndTime]);

  return sessionInfo;
};
