import { Progress } from "@/components/ui/progress";
import { getTypeColors } from "@/lib/functions/sessions";
import { sessionIcons } from "@/lib/logos";
import { SessionType } from "@/lib/types";
import { formatMinutesToHoursAndMinutes } from "@/lib/utils";
import React from "react";

interface SessionTypeSummaryProps {
  type: SessionType;
  stats: {
    sessionCount: number;
    totalDuration: number;
    percentagePassed: number;
    percentageOfAllSessionsType: number;
  };
}

export const SessionTypeSummary: React.FC<SessionTypeSummaryProps> = React.memo(
  ({ type, stats }) => {
    const { sessionTextColor, stroke } = getTypeColors(type);
    const Icon = sessionIcons[type];

    // Determine the correct session label
    const sessionLabel = stats.sessionCount === 1 ? "session" : "sessions";

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
            {stats.sessionCount} {sessionLabel}
          </span>
        </div>
        <p className="mb-2 text-2xl font-bold">
          {formatMinutesToHoursAndMinutes(stats.totalDuration)}
        </p>
        <div className="relative pt-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-block rounded-full bg-opacity-50 px-2 py-1 text-xs font-semibold uppercase">
              {stats.percentagePassed.toFixed(1)}% Complete
            </span>
            <span className="inline-block rounded-full bg-opacity-50 px-2 py-1 text-xs font-semibold uppercase">
              {stats.percentageOfAllSessionsType.toFixed(1)}% of Total Sessions
            </span>
          </div>
          <Progress
            value={stats.percentagePassed}
            className={`h-2 ${sessionTextColor}`}
          />
        </div>
      </div>
    );
  },
);

SessionTypeSummary.displayName = "SessionTypeSummary";
