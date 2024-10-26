import { ZoomIn, ZoomOut } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface CalendarZoomProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const CalendarZoom: React.FC<CalendarZoomProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={onZoomOut}
        disabled={zoomLevel <= 1}
        variant="outline"
        size="icon"
        className="h-8 w-8"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        onClick={onZoomIn}
        disabled={zoomLevel >= 5}
        variant="outline"
        size="icon"
        className="h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      {/* Set a fixed width to prevent layout shift when zoomLevel changes */}
    </div>
  );
};

export default CalendarZoom;
