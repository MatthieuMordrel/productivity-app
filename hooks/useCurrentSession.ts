import { useSessionsContext } from "@/contexts/SessionsContext";
import { useTitle } from "@/hooks/useTitle";
import { Session } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export const useCurrentSession = () => {
  const { sessions } = useSessionsContext();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const setTitle = useTitle();

  // Function to update the current session
  const updateCurrentSession = useCallback(() => {
    const now = new Date();
    const current = sessions.find(
      (session) => now >= session.start && now < session.end,
    );
    setCurrentSession(current || null);
  }, [sessions]);

  // Function to update the remaining time
  const updateRemainingTime = useCallback(() => {
    if (currentSession) {
      const now = new Date();
      const remainingMs = currentSession.end.getTime() - now.getTime();
      const remainingMinutes = Math.floor(remainingMs / 60000);
      const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
      const newRemainingTime = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      setRemainingTime(newRemainingTime);

      // Update the document title with the remaining time
      setTitle(`${newRemainingTime} - ${currentSession.taskTitle}`);
    } else {
      setRemainingTime("");
      setTitle("No active session"); // Reset title when no active session
    }
  }, [currentSession, setTitle]);

  useEffect(() => {
    // Initial update
    updateCurrentSession();
    updateRemainingTime();

    // Set up intervals for updates
    const sessionInterval = setInterval(updateCurrentSession, 1000);
    const timeInterval = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(sessionInterval);
      clearInterval(timeInterval);
    };
  }, [updateCurrentSession, updateRemainingTime]);

  return { currentSession, remainingTime };
};
