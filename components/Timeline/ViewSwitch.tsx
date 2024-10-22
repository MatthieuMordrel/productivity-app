"use client";
import { CalendarDays, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function ViewSwitch({
  view,
  setView,
}: {
  view: string;
  setView: (view: string) => void;
}) {
  return (
    <Tabs value={view} onValueChange={setView} className="">
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
        </TabsList>
      </div>
    </Tabs>
  );
}
