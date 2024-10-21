"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { useCalendarHelpers } from "@/hooks/useCalendarHelpers";
import { eventPropGetter } from "@/lib/functions/calendar_functions";
import { Info } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Calendar, EventPropGetter, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskList from "../task_list/TaskList";
import { CurrentSessionInfo } from "./CurrentSessionInfo";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";
import { WorkSessionSummary } from "./WorkSessionSummary";

const localizer = momentLocalizer(moment);

export default function PomodoroDay() {
  const { state } = useSettingsContext();
  const { sessions, handleDragEnd } = useSessionsContext();
  const {
    showPauses,
    setShowPauses,
    showBreaks,
    setShowBreaks,
    filteredEvents,
    stepSize,
  } = useCalendarHelpers(sessions);

  const [calendarHeight, setCalendarHeight] = useState("calc(100vh - 12rem)");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        setCalendarHeight(`calc(100vh - ${containerTop + 80}px)`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between"></div>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]" ref={containerRef}>
          <div className="rounded-xl bg-background p-6 shadow-lg">
            {sessions.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-red-500">
                <p>No sessions available. Please check your time settings.</p>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex-grow" style={{ height: calendarHeight }}>
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    defaultView="day"
                    views={["day", "agenda"]}
                    toolbar={true}
                    dayLayoutAlgorithm="no-overlap"
                    step={stepSize}
                    timeslots={1}
                    min={state.startTime}
                    max={state.endTime}
                    eventPropGetter={eventPropGetter as EventPropGetter<object>}
                    components={{
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      event: ({ event }: { event: any }) => (
                        <EventComponent event={event} />
                      ),
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      toolbar: CustomToolbar as any,
                    }}
                    className="bg-card text-card-foreground h-full rounded-lg border shadow-sm"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-pauses"
                        checked={showPauses}
                        onCheckedChange={setShowPauses}
                      />
                      <label
                        htmlFor="show-pauses"
                        className="text-sm font-medium"
                      >
                        Show Pauses
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-breaks"
                        checked={showBreaks}
                        onCheckedChange={setShowBreaks}
                      />
                      <label
                        htmlFor="show-breaks"
                        className="text-sm font-medium"
                      >
                        Show Breaks
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="rounded-xl bg-background p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Current Session</h3>
              <CurrentSessionInfo />
            </div>
            <div className="rounded-xl bg-background p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Work Summary</h3>
              <WorkSessionSummary sessions={sessions} />
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
        </div>
      </div>
    </DragDropContext>
  );
}
