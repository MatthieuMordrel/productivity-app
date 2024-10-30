"use client";

import { SessionTypeSummary } from "@/components/Summary/SessionTypeSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionTypeStats } from "@/lib/functions/sessionsUtils";
import { Session, SessionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

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

interface StaticSessionStats {
  sessionCount: number;
  totalDuration: number;
  percentageOfAllSessionsType: number;
}

export const WorkSessionSummary: React.FC<{
  className?: string;
  sessions: Session[];
}> = ({ className, sessions }) => {
  // Memoize the static stats calculation
  const staticSessionStats = useMemo(() => {
    // Find the existing session types and sort them in desired order
    const existingTypes = Array.from(
      new Set(sessions.map((session) => session.type)),
    ).sort((a, b) => {
      const order: Record<SessionType, number> = {
        Work: 0,
        Pause: 1,
        Break: 2,
      };
      return order[a] - order[b];
    }) as SessionType[];

    // Only calculate static stats when the sessions array changes
    return existingTypes.reduce(
      (acc, type) => {
        const stats = getSessionTypeStats(sessions, type);
        acc[type] = {
          sessionCount: stats.sessionCount,
          totalDuration: stats.totalDuration,
          percentageOfAllSessionsType: stats.percentageOfAllSessionsType,
        };
        return acc;
      },
      {} as Record<SessionType, StaticSessionStats>,
    );
  }, [sessions]);

  // Determine the grid layout based on the number of session types
  const gridClass = getGridClass(
    Object.keys(staticSessionStats).length,
    "column",
  );

  console.log(staticSessionStats);
  // If there are no sessions for today, display a message
  if (Object.keys(staticSessionStats).length === 0) {
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
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="p-0 pb-4">
        {/* <CardTitle className="text-2xl font-bold text-gray-800">
          Sessions Summary
        </CardTitle> */}
      </CardHeader>
      <CardContent>
        <div className={`grid gap-6 ${gridClass}`}>
          {Object.entries(staticSessionStats).map(([type, stats]) => (
            <SessionTypeSummary
              key={type}
              type={type as SessionType}
              staticStats={stats}
              sessions={sessions} // Pass the sessions array to calculate dynamic stats
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
