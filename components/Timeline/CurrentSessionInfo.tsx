import { useSessionsContext } from "@/contexts/SessionsContext";
import { useTitle } from "@/hooks/useTitle"; // Assume we create this custom hook
import { Session } from "@/lib/types";
import React, { useEffect, useState } from "react";

export const CurrentSessionInfo: React.FC = () => {
  const { sessions } = useSessionsContext();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const setTitle = useTitle(); // Custom hook to update document title

  useEffect(() => {
    console.log("useEffect");
    const updateCurrentSession = () => {
      const now = new Date();
      const current = sessions.find(
        (session) => now >= session.start && now < session.end,
      );
      setCurrentSession(current || null);
    };

    const updateRemainingTime = () => {
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
    };

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
  }, [sessions, currentSession, setTitle]);

  if (!currentSession) {
    return <div className="text-foreground">No active session</div>;
  }

  return (
    <div className="rounded-lg bg-primary p-4 text-foreground shadow-md">
      <h2 className="mb-2 text-xl font-bold">Current Session</h2>
      <p className="mb-1">
        <span className="font-semibold">Task:</span> {currentSession.taskTitle}
      </p>
      <p>
        <span className="font-semibold">Remaining Time:</span> {remainingTime}
      </p>
    </div>
  );
};
