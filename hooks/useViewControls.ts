import { possibleStepSizes } from "@/lib/constants";
import { useCallback, useState } from "react";
import { View } from "react-big-calendar";

export const useViewControls = () => {
  const [view, setView] = useState<View>("day");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prevZoom) =>
      Math.min(prevZoom + 1, possibleStepSizes.length),
    );
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 1, 1));
  }, []);

  // Calculate step size based on zoom level
  const calculatedStepSize = possibleStepSizes[zoomLevel - 1];

  return {
    view,
    setView,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    calculatedStepSize,
  };
};
