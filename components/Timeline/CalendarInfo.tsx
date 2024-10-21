import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import TaskList from "../task_list/TaskList";
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
      <div className="rounded-xl bg-background p-6 shadow-lg">
        <h3 className="mb-4 flex items-center justify-between text-lg font-semibold">
          Tasks
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Drag and drop tasks to reorder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <div className="max-h-[calc(100vh-36rem)] overflow-y-auto">
          <TaskList />
        </div>
      </div>
    </div>
  );
}
