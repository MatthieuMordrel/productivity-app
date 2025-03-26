"use client";

import { useSetCurrentSession } from "@/contexts/currentSessionStore";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { findCurrentSession } from "@/lib/functions/sessionsUtils";
import { useEffect } from "react";

/**
 * Hook to manage the current session based on timing
 * This hook should be called at the root of your application
 * or in a component that is always mounted.
 */
export function useSessionManager() {
  const { sessions } = useSessionsContext();
  const setCurrentSession = useSetCurrentSession();

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
  }, [sessions, setCurrentSession]);
}
