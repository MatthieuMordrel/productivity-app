import {
  showSystemNotificationOnCompletion,
  showToastOnCompletion,
} from "@/lib/functions/completion";
import { calculateSessionProgress } from "@/lib/functions/sessionsUtils";
import { Session } from "@/lib/types";
import { create } from "zustand";

// Define the store's state and actions
interface SessionCompletionState {
  // State
  remainingTime: string;
  progress: number;
  isComplete: boolean;

  // Actions
  updateProgress: (session: Session | null) => void;
  handleCompletion: (session: Session | null) => void;
  resetCompletion: () => void;
}

export const useSessionCompletionStore = create<SessionCompletionState>(
  (set, get) => ({
    // Initial state
    remainingTime: "",
    progress: 0,
    isComplete: false,

    // Actions
    updateProgress: (session) => {
      if (!session) {
        set({ remainingTime: "", progress: 0, isComplete: false });
        return;
      }

      const now = new Date();
      const { remainingTime, progress, isComplete } = calculateSessionProgress(
        session,
        now,
      );

      // Only update if there are changes (prevents unnecessary rerenders)
      const currentState = get();

      // For timer display, we need to update remainingTime regularly
      // But we can be more conservative with progress updates (to avoid rerendering visual elements)
      // Only update progress if it changed by at least 0.5%
      const significantProgressChange =
        Math.abs(currentState.progress - progress) >= 0.5;

      if (
        currentState.remainingTime !== remainingTime ||
        significantProgressChange ||
        currentState.isComplete !== isComplete
      ) {
        // Using a function to update ensures we only set what has changed
        set((state) => ({
          ...state,
          remainingTime:
            remainingTime !== state.remainingTime
              ? remainingTime
              : state.remainingTime,
          progress: significantProgressChange ? progress : state.progress,
          isComplete:
            isComplete !== state.isComplete ? isComplete : state.isComplete,
        }));

        // If the session just completed, trigger the completion handler
        if (isComplete && !currentState.isComplete) {
          get().handleCompletion(session);
        }
      }
    },

    handleCompletion: (session) => {
      // We could import these from a hooks file or inject them if needed
      if (session) {
        showToastOnCompletion(session);
        showSystemNotificationOnCompletion(session);
        // Note: sound playback would need to be handled via a custom hook or callback
      }
    },

    resetCompletion: () => {
      set({ remainingTime: "", progress: 0, isComplete: false });
    },
  }),
);

// Custom hooks for components

/**
 * useSessionProgress
 *
 * A hook that returns the remaining time, progress, and isComplete state from the session completion store.
 */
export const useSessionProgress = () => {
  const { remainingTime, progress, isComplete } = useSessionCompletionStore();
  return { remainingTime, progress, isComplete };
};

/**
 * useHandleCompletion
 *
 * A hook that returns the handleCompletion function from the session completion store.
 */
export const useHandleCompletion = () =>
  useSessionCompletionStore((state) => state.handleCompletion);
