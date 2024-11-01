import { toast } from "sonner";
import { Session } from "../types";
import { showNotification } from "../utils";
// Function to check if the page is visible
const isPageVisible = () => document.visibilityState === "visible";

// Show toast notification
export const showToastOnCompletion = (currentSession: Session | null) => {
  toast("Session finished", {
    description:
      currentSession?.type === "Pause"
        ? "Break completed! Back to work!"
        : `${currentSession?.taskTitle} completed! Good Job!`,
  });
};

// Show system notification with sound only when page is not visible
export const showSystemNotificationOnCompletion = (
  currentSession: Session | null,
) => {
  showNotification("Session Complete!", {
    body:
      currentSession?.type === "Pause"
        ? "End of Pause! Back to work!"
        : currentSession?.type === "Break"
          ? "Hope you enjoyed your break! Back to work!"
          : `Work session completed! Good Job! Time for a break!`,
    // Only play notification sound when page is not visible
    silent: isPageVisible(),
  });
};
