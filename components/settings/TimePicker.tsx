import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  showSetNowButton?: boolean;
  showDateToggle?: boolean; // New prop to control date toggle visibility
  minTime?: Date;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  showSetNowButton = false,
  showDateToggle = true, // Default to true to maintain backward compatibility
  minTime,
}) => {
  // Add state to track if tomorrow is selected
  const [isTomorrow, setIsTomorrow] = React.useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return value.getDate() === tomorrow.getDate();
  });

  // Add ref for the dropdown container to handle focus
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Convert Date to HH:mm string because input type="time" only accepts strings
  const timeString = value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(value);

    // Set the date to today or tomorrow based on toggle
    const today = new Date();
    newDate.setDate(today.getDate() + (isTomorrow ? 1 : 0));
    newDate.setHours(hours, minutes);

    // If the new time is before the minTime, set it to 30 minutes after minTime
    if (minTime && newDate <= minTime) {
      newDate.setTime(minTime.getTime() + 30 * 60000);
    }

    onChange(newDate);
  };

  const setToNow = () => {
    console.log("setToNow");
    const now = new Date();
    // Just zero out seconds and milliseconds while keeping the current minute
    now.setSeconds(0, 0); // Setting both seconds and milliseconds in one call
    console.log(now);
    setIsTomorrow(false);
    // If the new time is before the minTime, set it to 30 minutes after minTime
    if (minTime && now <= minTime) {
      now.setTime(minTime.getTime() + 30 * 60000);
    }
    onChange(now);
  };

  // Handle toggle between today and tomorrow
  const handleToggleDay = (isTomorrow: boolean) => {
    const newDate = new Date(value);
    const today = new Date();

    // Toggle the date and update state
    const newIsTomorrow = isTomorrow;
    setIsTomorrow(newIsTomorrow);

    // Adjust the date while keeping the same time
    newDate.setDate(today.getDate() + (newIsTomorrow ? 1 : 0));
    onChange(newDate);
  };

  const [isOpen, setIsOpen] = React.useState(false);

  // Add click outside handler to manage focus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Modified adjustHour function to round to nearest hour
  const adjustHour = (increment: number) => {
    const newDate = new Date(value);

    // Round to the next or previous hour based on increment
    if (increment > 0) {
      // Round up to the next hour
      newDate.setHours(newDate.getHours() + 1, 0, 0, 0);
    } else {
      // If we're exactly on the hour, go to previous hour
      if (newDate.getMinutes() === 0) {
        newDate.setHours(newDate.getHours() - 1, 0, 0, 0);
      } else {
        // Otherwise, round down to current hour
        newDate.setMinutes(0, 0, 0);
      }
    }

    // Check if we've crossed midnight
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Determine if the new time should be tomorrow
    const shouldBeTomorrow =
      (!isTomorrow && increment > 0 && newDate.getDate() !== today.getDate()) ||
      (isTomorrow && !(increment < 0 && newDate.getDate() === today.getDate()));

    // Update the tomorrow state if it changed
    if (shouldBeTomorrow !== isTomorrow) {
      setIsTomorrow(shouldBeTomorrow);
    }

    // Check against minTime if it exists
    if (minTime && newDate <= minTime) {
      newDate.setTime(minTime.getTime() + 30 * 60000);
    }

    onChange(newDate);
  };

  return (
    <div className="relative">
      {/* Main row with time input and other controls */}
      <div className="flex items-center space-x-1">
        <input
          id="time-picker"
          type="time"
          value={timeString}
          onChange={handleChange}
          className="rounded-md bg-primary/10 p-2"
          placeholder="HH:MM"
        />

        {showDateToggle && (
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="default"
              size="sm"
              className="w-[36px] text-[10px]"
              title={isTomorrow ? "Tomorrow" : "Today"}
            >
              {isTomorrow ? "T+1" : "T"}
            </Button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-24 rounded-md bg-background py-1 shadow-lg">
                <Button
                  onClick={() => {
                    handleToggleDay(false);
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className={`h-auto w-full justify-start px-3 py-1.5 text-xs ${
                    !isTomorrow ? "text-primary" : " "
                  }`}
                >
                  Today
                </Button>
                <Button
                  onClick={() => {
                    handleToggleDay(true);
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className={`h-auto w-full justify-start px-3 py-1.5 text-xs ${
                    isTomorrow ? "text-primary" : " "
                  }`}
                >
                  Tomorrow
                </Button>
              </div>
            )}
          </div>
        )}

        {showSetNowButton && (
          <Button
            onClick={setToNow}
            variant="default"
            size="sm"
            title="Set to current time"
          >
            Now
          </Button>
        )}
      </div>

      {/* Hour adjustment buttons below */}
      <div className="mt-1 flex space-x-1">
        <button
          onClick={() => adjustHour(-1)}
          className={`rounded px-1.5 py-0.5 text-xs transition-colors hover:bg-opacity-80 ${
            minTime && value.getTime() - 3600000 <= minTime.getTime()
              ? "opacity-50"
              : "hover:bg-foreground hover:text-background"
          }`}
          disabled={minTime && value.getTime() - 3600000 <= minTime.getTime()}
          title="Previous hour"
        >
          -1h
        </button>
        <button
          onClick={() => adjustHour(1)}
          className="rounded px-1.5 py-0.5 text-xs transition-colors hover:bg-foreground hover:text-background"
          title="Next hour"
        >
          +1h
        </button>
      </div>
    </div>
  );
};
