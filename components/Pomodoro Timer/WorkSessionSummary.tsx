import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="bg-secondary shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Work Session Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          Number of work sessions planned:{" "}
          <span className="font-bold">{workSessionCount}</span>
        </p>
        <p>
          Total time expected working:{" "}
          <span className="font-bold">
            {hours} hour{hours !== 1 ? "s" : ""} and {minutes} minute
            {minutes !== 1 ? "s" : ""}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
