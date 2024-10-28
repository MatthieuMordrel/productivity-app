"use client";

import { WorkSessionSummary } from "@/components/Summary/WorkSessionSummary";
import { useSessionsContext } from "@/contexts/SessionsContext";

export default function Page() {
  const { sessions } = useSessionsContext();
  return (
    <div className="hScreenWithoutNavbar">
      <WorkSessionSummary sessions={sessions} />
    </div>
  );
}
