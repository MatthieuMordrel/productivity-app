import { Session } from "@lib/types";
import { EventPropGetter } from "react-big-calendar";
//Control the style of the events
export const eventPropGetter: EventPropGetter<Session> = (event) => ({
  style: {
    cursor: "default",
    outline: "none",
    backgroundColor:
      event.type === "Work"
        ? "var(--primary)"
        : event.type === "Break"
          ? "var(--secondary)"
          : "blue",
  },
});
