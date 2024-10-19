import { Session } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDebouncedCallback } from "use-debounce";

export const EventComponent = ({
  event,
  onUpdateSession,
  onDeleteSession,
  isFocused,
  onBlur,
}: {
  event: Session;
  onUpdateSession: (updatedSession: Session) => void;
  onDeleteSession: (sessionId: string) => void;
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

  // Function to handle session deletion
  const handleDelete = useCallback(() => {
    onDeleteSession(event.id);
  }, [event.id, onDeleteSession]);

  return (
    <Droppable droppableId={`event_${event.id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="relative h-full rounded-md shadow-sm"
        >
          {/* Trash icon */}
          <button
            onClick={handleDelete}
            className="absolute right-2 top-2 text-foreground opacity-50 hover:opacity-100 focus:outline-none"
            aria-label="Delete session"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
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
