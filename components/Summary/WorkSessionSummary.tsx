"use client";

import { SessionTypeSummary } from "@/components/Summary/SessionTypeSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionsContext } from "@/contexts/SessionsContext";
import {
  findCurrentSession,
  getSessionTypeStats,
} from "@/lib/functions/sessions";
import { SessionType } from "@/lib/types";
import React, { useEffect, useState } from "react";

// Helper function to determine grid class based on session count
const getGridClass = (count: number) => {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "sm:grid-cols-2";
    default:
      return "sm:grid-cols-2 lg:grid-cols-3";
  }
};

export const WorkSessionSummary: React.FC = () => {
  const { sessions } = useSessionsContext();
  const currentSession = findCurrentSession(sessions);
  const [, setTriggerRerender] = useState(0);

  // Update every second to trigger rerender
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTriggerRerender((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate stats on each render
  const existingSessionTypes = Array.from(
    new Set(sessions.map((session) => session.type)),
  ) as SessionType[];

  const sessionStats = existingSessionTypes.reduce(
    (acc, type) => {
      acc[type] = getSessionTypeStats(sessions, type);
      return acc;
    },
    {} as Record<SessionType, ReturnType<typeof getSessionTypeStats>>,
  );

  const gridClass = getGridClass(Object.keys(sessionStats).length);

  // If there are no sessions for today, display a message
  if (Object.keys(sessionStats).length === 0) {
    return (
      <Card className="w-full overflow-hidden bg-white shadow-lg">
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
    <Card className="w-full overflow-hidden bg-white shadow-lg">
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
