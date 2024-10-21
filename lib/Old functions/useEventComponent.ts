import { useSessionsContext } from "@/contexts/SessionsContext";
import { updateSingleSession } from "@/lib/functions/sessions";
import { Session } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const useEventComponent = (
  event: Session,
  isFocused: boolean,
  onBlur: () => void,
) => {
  const { setSessions, handleDeleteSession } = useSessionsContext();

  const [taskTitle, setTaskTitle] = useState(event.taskTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedUpdateSession = useDebouncedCallback(
    (updatedSession: Session) => {
      updateSingleSession(updatedSession, setSessions);
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
    handleDeleteSession(event.id);
  }, [event.id, handleDeleteSession]);

  return {
    taskTitle,
    inputRef,
    handleTitleChange,
    handleDelete,
    onBlur,
  };
};
