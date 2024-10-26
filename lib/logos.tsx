import { Clock, Coffee, PauseCircle } from "lucide-react";
import { Session, SessionType } from "./types";

export const sessionIcons: Record<SessionType, React.ElementType> = {
  Work: Clock,
  Pause: PauseCircle,
  Break: Coffee,
};

export const getSessionIcon = (type: Session["type"]) => {
  switch (type) {
    case "Work":
      return sessionIcons.Work;
    case "Pause":
      return sessionIcons.Pause;
    case "Break":
      return sessionIcons.Break;
    default:
      return sessionIcons.Work;
  }
};
