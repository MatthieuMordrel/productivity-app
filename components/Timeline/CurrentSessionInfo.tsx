import { Session } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface CurrentSessionInfoProps {
  sessions: Session[];
}

export const CurrentSessionInfo: React.FC<CurrentSessionInfoProps> = ({
  sessions,
}) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
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
        setRemainingTime(
          `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`,
        );
      } else {
        setRemainingTime("");
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
  }, [sessions, currentSession]);

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
