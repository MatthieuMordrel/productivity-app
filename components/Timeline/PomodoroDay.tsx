"use client";

import { useSessionsContext } from "@/contexts/SessionsContext";
import { useSessionFilters } from "@/hooks/useSessionFilters";
import { useViewControls } from "@/hooks/useViewControls";
import "@styles/calendar-agenda.css";
import "@styles/calendar-event.css";
import "@styles/calendar-header.css";
import "@styles/calendar-override.css";
import "@styles/calendar-scrollbar.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SheetSettings } from "../settings/SheetSettings";
import { Card } from "../ui/card";
import { CalendarComponent } from "./Calendar";
import CalendarButtons from "./CalendarButtons";
import CalendarZoom from "./CalendarZoom";
import NoSession from "./NoSession";
import ViewSwitch from "./ViewSwitch";

// Dynamic import for Time component to avoid hydration errors
const Time = dynamic(() => import("./Time").then((mod) => mod.Time), {
  ssr: false,
});

export default function PomodoroDay() {
  const { sessions } = useSessionsContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    view,
    setView,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    calculatedStepSize,
  } = useViewControls();

  const {
    showPauses,
    setShowPauses,
    showBreaks,
    setShowBreaks,
    filteredEvents,
  } = useSessionFilters(sessions);

  return (
    <div className="container mx-auto">
      <Card className="overflow-hidden">
        <div className="p-6">
          {sessions.length === 0 ? (
            <NoSession />
          ) : (
            <div className="flex flex-col space-y-4">
              <Time />
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between space-x-4">
                  <ViewSwitch view={view} setView={setView} />
                  <SheetSettings
                    isSettingsOpen={isSettingsOpen}
                    setIsSettingsOpen={setIsSettingsOpen}
                  />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <CalendarZoom
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                  />
                  <CalendarButtons
                    showPauses={showPauses}
                    setShowPauses={setShowPauses}
                    showBreaks={showBreaks}
                    setShowBreaks={setShowBreaks}
                  />
                </div>
              </div>
              <CalendarComponent
                view={view as "day" | "agenda"}
                filteredEvents={filteredEvents}
                calculatedStepSize={calculatedStepSize}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
