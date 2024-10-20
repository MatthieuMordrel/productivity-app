import { Session } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const useEventComponent = (
  event: Session,
  onUpdateSession: (updatedSession: Session) => void,
  onDeleteSession: (sessionId: string) => void,
  isFocused: boolean,
  onBlur: () => void,
) => {
  const [taskTitle, setTaskTitle] = useState(event.taskTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedUpdateSession = useDebouncedCallback(
    (updatedSession: Session) => {
      onUpdateSession(updatedSession);
    },
    300,
  );

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTaskTitle(newTitle);

      const updatedSession = {
        ...event,
        taskTitle: newTitle,
      };

      debouncedUpdateSession(updatedSession);
    },
    [event, debouncedUpdateSession],
  );

  const handleDelete = useCallback(() => {
    onDeleteSession(event.id);
  }, [event.id, onDeleteSession]);

  return {
    taskTitle,
    inputRef,
    handleTitleChange,
    handleDelete,
    onBlur,
  };
};
