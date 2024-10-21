import { Session } from "@lib/types";
import { EventPropGetter } from "react-big-calendar";
export const eventPropGetter: EventPropGetter<Session> = (event) => ({
  style: {
    cursor: "grab",
    backgroundColor:
      event.type === "Work"
        ? "var(--primary)"
        : event.type === "Break"
          ? "var(--secondary)"
          : "blue",
  },
});
