import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import PomodoroSettings from "./PomodoroSettings";

export const SheetSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
}: {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}) => (
  <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent
      side="right"
      className="w-full max-w-[400px] overflow-y-auto sm:max-w-[480px]"
    >
      <SheetHeader>
        <SheetTitle className="text-xl sm:text-2xl">
          Pomodoro Settings
        </SheetTitle>
        <SheetDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="mb-2 sm:mb-0">
            Customize your Pomodoro experience
          </span>
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6">
        <PomodoroSettings />
      </div>
    </SheetContent>
  </Sheet>
);
