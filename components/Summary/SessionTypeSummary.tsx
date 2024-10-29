import { Progress } from "@/components/ui/progress";
import {
  findCurrentSession,
  getSessionTypeStats,
  getTypeColors,
} from "@/lib/functions/sessionsUtils";
import { sessionIcons } from "@/lib/logos";
import { Session, SessionType } from "@/lib/types";
import { formatMinutesToHoursAndMinutes } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface SessionTypeSummaryProps {
  type: SessionType;
  staticStats: {
    sessionCount: number;
    totalDuration: number;
    percentageOfAllSessionsType: number;
  };
  sessions: Session[];
}

export const SessionTypeSummary: React.FC<SessionTypeSummaryProps> = React.memo(
  ({ type, staticStats, sessions }) => {
    const { sessionTextColor, stroke, backgroundColor } = getTypeColors(type);
    const currentSession = findCurrentSession(sessions);
    const isActive = currentSession?.type === type;
    const [percentagePassed, setPercentagePassed] = useState(0);

    // Update the percentagePassed state when the active session changes
    useEffect(() => {
      if (isActive) {
        const updatePercentage = () => {
          const stats = getSessionTypeStats(sessions, type);
          setPercentagePassed(stats.percentagePassed);
        };

        // Initial calculation
        updatePercentage();

        // Update every second only if this is the active session
        const intervalId = setInterval(updatePercentage, 1000);
        return () => clearInterval(intervalId);
      } else {
        // For inactive sessions, calculate once
        const stats = getSessionTypeStats(sessions, type);
        setPercentagePassed(stats.percentagePassed);
      }
    }, [isActive, sessions, type]);

    // Determine the label for the session type
    const sessionLabel =
      staticStats.sessionCount === 1 ? "session" : "sessions";
    // Get the icon for the session type
    const Icon = sessionIcons[type];

    console.log(backgroundColor);

    return (
      <div className={`rounded-lg p-4 ${sessionTextColor}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              style={{ color: stroke }}
              className="h-6 w-6"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">{type}</h3>
          </div>
          <span className="text-sm font-medium">
            {staticStats.sessionCount} {sessionLabel}
          </span>
        </div>
        <p className="mb-2 text-2xl font-bold">
          {formatMinutesToHoursAndMinutes(staticStats.totalDuration)}
        </p>
        <div className="relative pt-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-block rounded-full bg-opacity-50 px-2 py-1 text-xs font-semibold uppercase">
              {percentagePassed.toFixed(1)}% Complete
            </span>
            <span className="inline-block rounded-full bg-opacity-50 px-2 py-1 text-xs font-semibold uppercase">
              {staticStats.percentageOfAllSessionsType.toFixed(1)}% of Total
              Sessions
            </span>
          </div>
          <Progress
            value={percentagePassed}
            className={sessionTextColor}
            isActive={isActive}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
    );
  },
);

SessionTypeSummary.displayName = "SessionTypeSummary";
