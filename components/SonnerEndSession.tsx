import { Button } from "@/components/ui/button";
import { Session } from "@/lib/types";
import { toast } from "sonner";

export function SonnerEndSession({
  currentSession,
}: {
  currentSession: Session | null;
}) {
  const handleToast = () => {
    toast(
      currentSession?.type === "Pause" ? "Break Time!" : "Session finished",
      {
        description:
          currentSession?.type === "Pause"
            ? "Break completed! Back to work!"
            : `${currentSession?.taskTitle} completed! Good Job!`,
      },
    );
  };

  return (
    <Button variant="outline" onClick={handleToast}>
      Show Toast
    </Button>
  );
}
