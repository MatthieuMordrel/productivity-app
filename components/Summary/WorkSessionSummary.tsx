"use client";

import { SessionTypeSummary } from "@/components/Summary/SessionTypeSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionTypeStats } from "@/lib/functions/sessionsUtils";
import { Session, SessionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

// Helper function to determine grid class based on session count
const getGridClass = (count: number, grid: "row" | "column") => {
  switch (count) {
    case 1:
      return grid === "row" ? "grid-cols-1" : "grid-rows-1";
    case 2:
      return grid === "row" ? "sm:grid-cols-2" : "sm:grid-rows-2";
    default:
      return grid === "row"
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-rows-2 lg:grid-rows-3";
  }
};

export const WorkSessionSummary: React.FC<{
  className?: string;
  sessions: Session[];
}> = ({ className, sessions }) => {
  const [, setTriggerRerender] = useState(0);

  // Trigger a re-render every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTriggerRerender((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Find the existing session types and sort them in desired order
  const existingSessionTypes = Array.from(
    new Set(sessions.map((session) => session.type)),
  ).sort((a, b) => {
    // Define the order: work -> pause -> break
    const order: Record<SessionType, number> = {
      Work: 0,
      Pause: 1,
      Break: 2,
    };
    return order[a] - order[b];
  }) as SessionType[];

  // Calculate stats for each session type for every render
  const sessionStats = existingSessionTypes.reduce(
    (acc, type) => {
      acc[type] = getSessionTypeStats(sessions, type);
      return acc;
    },
    {} as Record<SessionType, ReturnType<typeof getSessionTypeStats>>,
  );

  // Determine the grid layout based on the number of session types
  const gridClass = getGridClass(Object.keys(sessionStats).length, "column");

  console.log(sessionStats);
  // If there are no sessions for today, display a message
  if (Object.keys(sessionStats).length === 0) {
    return (
      <Card className={cn("w-full overflow-hidden shadow-lg", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Daily Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            No sessions recorded for today.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full overflow-hidden shadow-lg", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Sessions Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-6 ${gridClass}`}>
          {existingSessionTypes.map((type) => (
            <SessionTypeSummary
              key={type}
              type={type}
              stats={{
                sessionCount: sessionStats[type].sessionCount,
                totalDuration: sessionStats[type].totalDuration,
                percentagePassed: sessionStats[type].percentagePassed,
                percentageOfAllSessionsType:
                  sessionStats[type].percentageOfAllSessionsType,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
