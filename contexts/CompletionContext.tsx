"use client";

import { useSessionTracker } from "@/lib/hooks/useSessionTracker";
import { usePlaySound } from "@/lib/hooks/useSound";
import { useCurrentSession } from "@/lib/stores/currentSessionStore";
import {
  useCompletionActions,
  useRemainingTime,
  useSessionCompletion,
  useSessionProgress,
} from "@/lib/stores/sessionCompletionStore";
import { useSessionSounds } from "@/lib/stores/soundStore";
import { ReactNode, useEffect } from "react";

// This provider now just initializes the sound logic and session tracker
export function CompletionProvider({ children }: { children: ReactNode }) {
  // Initialize the session tracker
  useSessionTracker();

  // Set up sound playing on completion
  const playSound = usePlaySound();
  const sounds = useSessionSounds();
  const currentSession = useCurrentSession();
  const isComplete = useSessionCompletion();

  // Handle sound playback when a session completes
  // This effect only runs when isComplete changes to true
  useEffect(() => {
    if (isComplete && currentSession) {
      playSound("session sounds", sounds[currentSession.type]);
    }
  }, [isComplete, currentSession, sounds, playSound]);

  return <>{children}</>;
}

// Export a hook for components to consume completion data
export function useCompletion() {
  const currentSession = useCurrentSession();
  const remainingTime = useRemainingTime();
  const progress = useSessionProgress();
  const isComplete = useSessionCompletion();
  const { handleCompletion } = useCompletionActions();

  return {
    currentSession,
    remainingTime,
    progress,
    isComplete,
    handleCompletion,
  };
}
