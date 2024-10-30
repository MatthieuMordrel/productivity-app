import { toast } from "sonner";
import { Session } from "../types";
import { showNotification } from "../utils";

// Function to play the completion sound at lower volume
export const playCompletionSound = () => {
  const audio = new Audio("/sounds/complete.wav");
  audio.volume = 0.3;
  audio.play().catch((error) => {
    console.error("Error playing completion sound:", error);
  });
};

// Show toast notification
export const showToastOnCompletion = (currentSession: Session | null) => {
  toast("Session finished", {
    description:
      currentSession?.type === "Pause"
        ? "Break completed! Back to work!"
        : `${currentSession?.taskTitle} completed! Good Job!`,
  });
};

// Show system notification
export const showSystemNotificationOnCompletion = (
  currentSession: Session | null,
) => {
  showNotification("Session Complete!", {
    body:
      currentSession?.type === "Pause"
        ? "Break completed! Back to work!"
        : `${currentSession?.taskTitle} completed! Good Job!`,
  });
};
