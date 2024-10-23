import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

export const SettingsTooltipReset = ({ className }: { className?: string }) => {
  const { dispatch } = useSettingsContext();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => dispatch({ type: "RESET_SETTINGS" })}
            variant="outline"
            size="icon"
            className={cn("h-8 w-8", className)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset to default settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
