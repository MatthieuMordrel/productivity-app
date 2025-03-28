"use client";

import { useEventContext } from "@/contexts/EventContext";
import { useSessionsContext } from "@/contexts/SessionsContext";
import { useViewControls } from "@/lib/hooks/useViewControls";
import "@styles/calendar-agenda.css";
import "@styles/calendar-currentTime.css";
import "@styles/calendar-event.css";
import "@styles/calendar-header.css";
import "@styles/calendar-override.css";
import "@styles/calendar-scrollbar.css";
import "@styles/calendar-timeAxis.css";
import { useState } from "react";
import { View } from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SheetSettings } from "../settings/SheetSettings";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CalendarComponent } from "./Calendar";
import CalendarZoom from "./CalendarZoom";
import NoSession from "./NoSession";
import ViewSwitch from "./ViewSwitch";

// Dynamic import for Time component to avoid hydration errors
// const Time = dynamic(() => import("./Time").then((mod) => mod.Time), {
//   ssr: false,
// });

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

  const { filteredEvents } = useEventContext();

  // State to manage time format, default is American
  const [isAmericanFormat, setIsAmericanFormat] = useState(false);

  // Function to toggle time format
  const toggleTimeFormat = () => {
    setIsAmericanFormat((prevFormat) => !prevFormat);
  };

  return (
    <div className="mx-auto">
      <Card
        variant="outline"
        className="flex min-h-[calc(100vh-88px)] flex-col space-y-4 overflow-hidden p-6"
      >
        {sessions.length === 0 ? (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-end">
              <SheetSettings
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
              />
            </div>
            <NoSession />
          </div>
        ) : (
          <>
            {/* <Time /> */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <ViewSwitch view={view} setView={setView} />
                <Button onClick={toggleTimeFormat} className="hidden">
                  Toggle Time Format
                </Button>
                <div className="flex items-center space-x-4">
                  <CalendarZoom
                    view={view as View}
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                  />
                  <SheetSettings
                    isSettingsOpen={isSettingsOpen}
                    setIsSettingsOpen={setIsSettingsOpen}
                  />
                </div>
              </div>
            </div>
            <CalendarComponent
              view={view as "day" | "agenda"}
              filteredEvents={filteredEvents}
              calculatedStepSize={calculatedStepSize}
              isAmericanFormat={isAmericanFormat}
            />
          </>
        )}
      </Card>
    </div>
  );
}
