"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSoundContext } from "@/contexts/SoundContext";
import { usePlaySound } from "@/hooks/useSound";
import { AVAILABLE_SOUNDS } from "@/lib/constants";
import { SessionType } from "@/lib/types";
import { Settings } from "lucide-react";
export function SoundSettingsPanel() {
  const playSound = usePlaySound();
  const { sounds, setSessionSound } = useSoundContext();
  const sessionTypes: SessionType[] = ["Work", "Break", "Pause"];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted"
          aria-label="Sound settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Sound Settings</h4>
          <div className="space-y-4">
            {sessionTypes.map((sessionType) => (
              <div
                key={sessionType}
                className="flex items-center justify-between gap-4"
              >
                <label className="text-sm font-medium">{sessionType}</label>
                <div className="flex items-center gap-2">
                  <Select
                    value={sounds[sessionType]}
                    onValueChange={(value) => {
                      setSessionSound(
                        sessionType,
                        value as keyof typeof AVAILABLE_SOUNDS,
                      );
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.entries(AVAILABLE_SOUNDS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      playSound("session sounds", "complete.wav", true)
                    }
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
