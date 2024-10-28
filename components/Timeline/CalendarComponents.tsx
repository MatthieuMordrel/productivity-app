import { useSettingsContext } from "@/contexts/SettingsContext";
import { Session } from "@/lib/types";
import { useMemo } from "react";
import { EventComponent } from "./EventComponent";
import { CustomToolbar } from "./Toolbar";

export default function CalendarComponents({
  handleDateChange,
}: {
  handleDateChange: (newDate: Date) => void;
}) {
  const { state } = useSettingsContext();
  // Memoize the views and any other calendar configurations
  const { views, components } = useMemo(
    () => ({
      views: ["day", "agenda"],

      components: {
        event: (props: { event: Session; view: string }) =>
          props.view === "day" ? (
            <EventComponent event={props.event} view={props.view} />
          ) : (
            <div>{props.event.taskTitle}</div>
          ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toolbar: (toolbarProps: any) => {
          // Only show toolbar if start and end times are on different days
          if (state.startTime.getDate() !== state.endTime.getDate()) {
            return (
              <CustomToolbar
                {...toolbarProps}
                onDateChange={handleDateChange}
              />
            );
          }
          // Return null to hide toolbar when on same day
          return null;
        },
      },
    }),
    [state, handleDateChange],
  );

  return { views, components };
}

// formats: {
//     timeGutterFormat: (date: Date) => {
//       // Create DateTime with explicit timezone
//       const dt = DateTime.fromJSDate(date, { zone: "Europe/Paris" });
//       // Add indication for the time standard
//       const timeStandard = dt.isInDST ? "(Summer)" : "(Standard)";
//       // Only show the standard indication during the transition hour
//       const shouldShowStandard = dt.hour === 1 || dt.hour === 2;
//       return (
//         dt.toFormat("HH:mm") +
//         (shouldShowStandard ? ` ${timeStandard}` : "")
//       );
//     },
//     eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
//       const startDt = DateTime.fromJSDate(start, { zone: "Europe/Paris" });
//       const endDt = DateTime.fromJSDate(end, { zone: "Europe/Paris" });
//       return `${startDt.toFormat("HH:mm")} - ${endDt.toFormat("HH:mm")}`;
//     },
//   },
