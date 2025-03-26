"use client";
import { CalendarDays, List } from "lucide-react";
import { View } from "react-big-calendar";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function ViewSwitch({
  view,
  setView,
}: {
  view: View;
  setView: (view: View) => void;
}) {
  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(value as "day" | "agenda")}
      className=""
    >
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="day" className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Day</span>
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Agenda</span>
          </TabsTrigger>
          {/* <TabsTrigger value="week" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Week</span>
          </TabsTrigger> */}
        </TabsList>
      </div>
    </Tabs>
  );
}
