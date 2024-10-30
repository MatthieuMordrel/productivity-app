"use client";

import { WorkSessionSummary } from "@/components/Summary/WorkSessionSummary";
import { useSessionsContext } from "@/contexts/SessionsContext";

export default function Page() {
  const { sessions } = useSessionsContext();
  return (
    <div className="m-4 flex items-center justify-center hScreenWithoutNavbar">
      <WorkSessionSummary sessions={sessions} className="mx-auto w-[80%]" />
    </div>
  );
}
