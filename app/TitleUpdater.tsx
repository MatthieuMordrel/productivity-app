"use client";

import { useCurrentSession } from "@/hooks/useCurrentSession";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function TitleUpdater() {
  const { currentSession, remainingTime } = useCurrentSession();
  const pathname = usePathname();

  useEffect(() => {
    // Update document title directly for client-side changes
    document.title = currentSession
      ? `${remainingTime} - ${currentSession.taskTitle} | Productivity Timer`
      : "Productivity Timer";
  }, [currentSession, remainingTime, pathname]);

  // This component doesn't render anything
  return null;
}
