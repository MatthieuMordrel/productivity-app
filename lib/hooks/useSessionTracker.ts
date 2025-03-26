"use client";

import { useCurrentSession } from "@/lib/stores/currentSessionStore";
import { useSessionCompletionStore } from "@/lib/stores/sessionCompletionStore";
import { useEffect, useRef } from "react";

/**
 * A smart hook that tracks session progress and schedules precise updates
 * instead of polling every second
 */
export function useSessionTracker() {
  const currentSession = useCurrentSession();
  const updateProgress = useSessionCompletionStore(
    (state) => state.actions.updateProgress,
  );
  const resetCompletion = useSessionCompletionStore(
    (state) => state.actions.resetCompletion,
  );

  // References to avoid unnecessary effect triggers
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up timers when the session changes
  useEffect(() => {
    // Clear any existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Initial update of progress
    updateProgress(currentSession);

    if (!currentSession) {
      resetCompletion();
      return;
    }

    // Calculate when the session will end
    const now = Date.now();
    const endTime = currentSession.end.getTime();
    const timeUntilEnd = endTime - now;

    if (timeUntilEnd <= 0) {
      // Session already ended
      updateProgress(currentSession);
      return;
    }

    // Set a timeout for the exact completion time
    timeoutRef.current = setTimeout(() => {
      updateProgress(currentSession);
    }, timeUntilEnd);

    // Always update every second to ensure smooth countdown display
    // This is important for the visual timer
    intervalRef.current = setInterval(() => {
      updateProgress(currentSession);
    }, 1000);

    return () => {
      // Cleanup timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSession, updateProgress, resetCompletion]);
}
