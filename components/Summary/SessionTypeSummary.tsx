import { Progress } from "@/components/ui/progress";
import { useCurrentSession } from "@/contexts/CurrentSessionContext";
import { getSessionTypeStats } from "@/lib/functions/sessionsUtils";
import { getTypeColors, sessionIcons } from "@/lib/logos";
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
    const { textColor, stroke, backgroundColor } = getTypeColors(type);
    const { currentSession } = useCurrentSession();
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

    return (
      <div className={`rounded-lg p-4`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              style={{ color: stroke }}
              className="h-6 w-6"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">
              {type} -{" "}
              {formatMinutesToHoursAndMinutes(staticStats.totalDuration)}
            </h3>
          </div>
          <span className="text-sm font-medium">
            {staticStats.sessionCount} {sessionLabel}
          </span>
        </div>
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
            className={textColor}
            isActive={isActive}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
    );
  },
);

SessionTypeSummary.displayName = "SessionTypeSummary";
