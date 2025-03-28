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
  actions: {
    updateProgress: (session: Session | null) => void;
    handleCompletion: (session: Session | null) => void;
    resetCompletion: () => void;
  };
}

const useSessionCompletionStore = create<SessionCompletionState>(
  (set, get) => ({
    // Initial state
    remainingTime: "",
    progress: 0,
    isComplete: false,

    // Actions
    actions: {
      updateProgress: (session) => {
        if (!session) {
          set({ remainingTime: "", progress: 0, isComplete: false });
          return;
        }

        const now = new Date();
        const { remainingTime, progress, isComplete } =
          calculateSessionProgress(session, now);

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
            get().actions.handleCompletion(session);
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
    },
  }),
);

// Custom hooks for components

/**
 * useRemainingTime
 *
 * A hook that returns only the remaining time from the session completion store.
 */
export const useRemainingTime = () =>
  useSessionCompletionStore((state) => state.remainingTime);

/**
 * useSessionProgress
 *
 * A hook that returns only the progress percentage from the session completion store.
 */
export const useSessionProgress = () =>
  useSessionCompletionStore((state) => state.progress);

/**
 * useSessionCompletion
 *
 * A hook that returns whether the current session is complete.
 */
export const useSessionCompletion = () =>
  useSessionCompletionStore((state) => state.isComplete);

/**
 * useCompletionActions
 *
 * A hook that returns the actions from the session completion store.
 */
export const useCompletionActions = () =>
  useSessionCompletionStore((state) => state.actions);
