import { Clock, Coffee, PauseCircle } from "lucide-react";
import { SessionType } from "./types";

export const sessionIcons: Record<SessionType, React.ElementType> = {
  Work: Clock,
  Pause: PauseCircle,
  Break: Coffee,
};

// Get stroke and icon colors based on the session type provided
export const getTypeColors = (type: SessionType) => {
  switch (type) {
    case "Work":
      return {
        stroke: "hsl(var(--work))",
        textColor: "text-[hsl(var(--work))]",
        backgroundColor: "bg-[hsl(var(--work))]",
      };
    case "Pause":
      return {
        stroke: "hsl(var(--pause))",
        textColor: "text-[hsl(var(--pause))]",
        backgroundColor: "bg-[hsl(var(--pause))]",
      };
    case "Break":
      return {
        stroke: "hsl(var(--break))",
        textColor: "text-[hsl(var(--break))]",
        backgroundColor: "bg-[hsl(var(--break))]",
      };
  }
};
