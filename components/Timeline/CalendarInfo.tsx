import { CurrentSessionInfo } from "./CurrentSessionInfo";
import { WorkSessionSummary } from "./WorkSessionSummary";

export default function CalendarInfo() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-background p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Current Session</h3>
        <CurrentSessionInfo />
      </div>
      <div className="rounded-xl bg-background p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Work Summary</h3>
        <WorkSessionSummary />
      </div>
    </div>
  );
}
