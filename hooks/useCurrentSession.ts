import { useSessionsContext } from "@/contexts/SessionsContext";
import { useTitle } from "@/hooks/useTitle";
import { Session } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export const useCurrentSession = () => {
  const { sessions } = useSessionsContext();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [progress, setProgress] = useState(0);
  const setTitle = useTitle();

  // Function to update the current session and time
  const updateSessionAndTime = useCallback(() => {
    const now = new Date();
    const current = sessions.find(
      (session) => now >= session.start && now < session.end,
    );
    setCurrentSession(current || null);

    if (current) {
      const remainingMs = current.end.getTime() - now.getTime();
      const totalDuration = current.end.getTime() - current.start.getTime();
      const elapsedDuration = now.getTime() - current.start.getTime();

      const remainingMinutes = Math.floor(remainingMs / 60000);
      const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
      setRemainingTime(
        `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`,
      );
      setProgress(Math.min(elapsedDuration / totalDuration, 1));
    } else {
      setRemainingTime("");
      setProgress(0);
    }
  }, [sessions]);

  useEffect(() => {
    // Initial update
    updateSessionAndTime();

    // Set up interval for updates
    const interval = setInterval(updateSessionAndTime, 1000);

    return () => clearInterval(interval);
  }, [updateSessionAndTime]);

  // Update title
  useEffect(() => {
    if (currentSession) {
      setTitle(`${remainingTime} - ${currentSession.taskTitle}`);
    } else {
      setTitle("No active session");
    }
  }, [currentSession, remainingTime, setTitle]);

  return { currentSession, remainingTime, progress };
};
