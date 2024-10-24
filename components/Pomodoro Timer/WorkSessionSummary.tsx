import { useSessionsContext } from "@/contexts/SessionsContext";
import React from "react";

export const WorkSessionSummary: React.FC = () => {
  const { sessions } = useSessionsContext();
  // Calculate the number of work sessions
  const workSessionCount = sessions.filter(
    (session) => session.type === "Work",
  ).length;

  // Calculate the total expected working time in minutes
  const totalWorkingTimeMinutes =
    sessions
      .filter((session) => session.type === "Work")
      .reduce(
        (acc, workSession) =>
          acc + (workSession.end.getTime() - workSession.start.getTime()),
        0,
      ) /
    (1000 * 60);

  // Convert total working time to hours and minutes
  const hours = Math.floor(totalWorkingTimeMinutes / 60);
  const minutes = Math.round(totalWorkingTimeMinutes % 60);

  return (
    <div className="rounded-lg bg-secondary p-4 shadow-md">
      <h3 className="mb-2 text-lg font-semibold">Work Session Summary</h3>
      <p>
        Number of work sessions:{" "}
        <span className="font-bold">{workSessionCount}</span>
      </p>
      <p>
        Total time expected working:{" "}
        <span className="font-bold">
          {hours} hour{hours !== 1 ? "s" : ""} and {minutes} minute
          {minutes !== 1 ? "s" : ""}
        </span>
      </p>
    </div>
  );
};
