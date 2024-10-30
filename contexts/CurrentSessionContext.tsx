"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import { findCurrentSession } from "@/lib/functions/sessionsUtils";
import { Session } from "@/lib/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface CurrentSessionContextType {
  currentSession: Session | null;
}

const CurrentSessionContext = createContext<
  CurrentSessionContextType | undefined
>(undefined);

export function CurrentSessionProvider({ children }: { children: ReactNode }) {
  const { sessions } = useSessionsContext();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Set up a timer to update the current session
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateCurrentSession = () => {
      // Find and update the current session state
      const newCurrentSession = findCurrentSession(sessions);
      setCurrentSession(newCurrentSession);

      // Schedule next update
      const now = Date.now();
      if (newCurrentSession) {
        // If we have a current session, schedule update for when it ends
        const timeUntilEnd = newCurrentSession.end.getTime() - now;
        timeoutId = setTimeout(updateCurrentSession, timeUntilEnd);
      } else {
        // If no current session, find the next upcoming session
        const nextSession = sessions.find((s) => s.start.getTime() > now);
        if (nextSession) {
          const timeUntilNext = nextSession.start.getTime() - now;
          timeoutId = setTimeout(updateCurrentSession, timeUntilNext);
        }
      }
    };

    // Initial update
    updateCurrentSession();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [sessions]); // Only re-run when sessions array changes

  return (
    <CurrentSessionContext.Provider value={{ currentSession }}>
      {children}
    </CurrentSessionContext.Provider>
  );
}

export function useCurrentSession() {
  const context = useContext(CurrentSessionContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentSession must be used within a CurrentSessionProvider",
    );
  }
  return context;
}
