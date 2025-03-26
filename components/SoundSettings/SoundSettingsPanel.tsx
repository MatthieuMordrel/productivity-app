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
import { Slider } from "@/components/ui/slider";
import { AVAILABLE_SOUNDS } from "@/lib/constants";
import { usePlaySound } from "@/lib/hooks/useSound";
import {
  useSessionSounds,
  useSoundActions,
  useSoundEnabled,
  useSoundVolume,
} from "@/lib/stores/soundStore";
import { SessionType } from "@/lib/types";
import { Settings, Volume2, VolumeX } from "lucide-react";

export function SoundSettingsPanel() {
  const isSoundEnabled = useSoundEnabled();
  const volume = useSoundVolume();
  const sounds = useSessionSounds();
  const { toggleSound, setVolume, setSessionSound } = useSoundActions();

  const playSound = usePlaySound();
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
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Sound Settings</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="hover:bg-muted"
            >
              {isSoundEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
          </div>
          <div className={`space-y-4 ${!isSoundEnabled ? "opacity-50" : ""}`}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Volume</label>
              <Slider
                disabled={!isSoundEnabled}
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              {sessionTypes.map((sessionType) => (
                <div
                  key={sessionType}
                  className="flex items-center justify-between gap-4"
                >
                  <label className="text-sm font-medium">{sessionType}</label>
                  <div className="flex items-center gap-2">
                    <Select
                      disabled={!isSoundEnabled}
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
                      disabled={!isSoundEnabled}
                      onClick={() =>
                        playSound("session sounds", sounds[sessionType])
                      }
                    >
                      Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
