import { useTaskContext } from "@/contexts/TaskContext";
import { useEffect, useRef, useState } from "react";

export const useTaskActions = (
  taskId: string,
  initialContent: string,
  setRenameError: (error: string | null) => void,
) => {
  const { renameTask } = useTaskContext();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");
  const [originalTaskContent, setOriginalTaskContent] =
    useState<string>(initialContent);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Trigger when the user clicks the edit button
  const handleEditClick = () => {
    setEditingTaskId(taskId);
    setEditedTaskContent(initialContent);
    setOriginalTaskContent(initialContent);
    setRenameError(null);
  };

  // Effect to focus on edit input when entering edit mode
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  // Handle edit input change
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskContent(e.target.value);
    setRenameError(null);
  };

  // Trigger when the user presses enter or escape in edit input
  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  // Update the handleEditSave function
  const handleEditSave = () => {
    if (editingTaskId && editedTaskContent.trim()) {
      const error = renameTask(editingTaskId, editedTaskContent.trim());
      if (error) {
        setRenameError(error);
        // Keep focus on the input field when there's an error
        editInputRef.current?.focus();
      } else {
        setEditingTaskId(null);
        setRenameError(null);
      }
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditedTaskContent(originalTaskContent);
    setRenameError(null);
  };

  return {
    editingTaskId,
    editedTaskContent,
    editInputRef,
    handleEditClick,
    handleEditInputChange,
    handleEditKeyPress,
    handleEditSave,
    handleEditCancel,
  };
};
