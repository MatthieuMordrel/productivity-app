"use client";

import { useCompletion } from "@/contexts/CompletionContext";
import { useCurrentSession } from "@/contexts/CurrentSessionContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { formatDateToTime } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function TitleUpdater() {
  const { state } = useSettingsContext();
  const { currentSession } = useCurrentSession();
  const { remainingTime } = useCompletion();
  const pathname = usePathname();

  const startTime = state.startTime;
  const startTimeFormatted = formatDateToTime(startTime);

  useEffect(() => {
    // Update document title directly for client-side changes
    if (currentSession) {
      document.title = `${remainingTime} - ${currentSession.taskTitle} | Productivity Timer`;
    } else {
      document.title = `Next Session: ${startTimeFormatted}`;
    }
  }, [currentSession, remainingTime, pathname, startTime, startTimeFormatted]);

  // This component doesn't render anything
  return null;
}
