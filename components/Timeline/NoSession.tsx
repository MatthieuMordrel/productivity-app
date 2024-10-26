import { CalendarDays } from "lucide-react";

export default function NoSession() {
  return (
    <div className="flex items-center justify-center rounded-lg border-2 border-dashed calendarHeight">
      <div className="text-center">
        <CalendarDays className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-2 text-lg font-semibold">No sessions available</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Please check your time settings and add some sessions.
        </p>
        {/* <Button
    className="mt-4"
    variant="outline"
    onClick={() => {}}
  >
    <Settings className="mr-2 h-4 w-4" />
    Adjust Settings
  </Button> */}
      </div>
    </div>
  );
}
