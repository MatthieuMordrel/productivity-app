import { Session } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDebouncedCallback } from "use-debounce";

export const EventComponent = ({
  event,
  onUpdateSession,
  isFocused,
  onBlur,
}: {
  event: Session;
  onUpdateSession: (updatedSession: Session) => void;
  isFocused: boolean;
  onBlur: () => void;
}) => {
  // console.log("Event component rerendered");
  // State to manage the editable task title
  const [taskTitle, setTaskTitle] = useState(event.taskTitle);

  // Ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced function to update the session
  const debouncedUpdateSession = useDebouncedCallback(
    (updatedSession: Session) => {
      onUpdateSession(updatedSession);
    },
    300, // Debounce delay in milliseconds
  );

  // Effect to handle focusing
  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  // Update the local state and call the debounced update function
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTaskTitle(newTitle);

      // Create an updated session object
      const updatedSession = {
        ...event,
        taskTitle: newTitle,
      };

      // Call the debounced update function
      debouncedUpdateSession(updatedSession);
    },
    [event, debouncedUpdateSession],
  );

  return (
    <Droppable droppableId={`event_${event.id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="h-full rounded-md shadow-sm"
        >
          <div className="flex h-1/4 space-x-2">
            <input
              ref={inputRef}
              aria-label="Task"
              type="text"
              value={taskTitle}
              onChange={handleTitleChange}
              onBlur={onBlur}
              className="w-full rounded border border-primary bg-inherit px-1 py-0.5 text-xl text-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
