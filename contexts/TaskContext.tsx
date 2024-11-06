"use client";

import { MAX_TASK_CHARACTERS } from "@/lib/constants";
import { Task } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TaskContextType {
  tasks: Task[];
  addTask: (content: string) => string | null;
  deleteTask: (taskId: string) => void;
  renameTask: (taskId: string, newContent: string) => string | null;
}

//Create an object that is the context, set to undefined
//This object has a property called Provider, which can be used to wrap around the components that need to access the context
//The Provider component will pass down the context to the components that need it
const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage or empty array
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Helper function to validate task content
  const validateTaskContent = (content: string): string | null => {
    const trimmedContent = content.trim();

    if (trimmedContent === "") {
      return "Task content cannot be empty";
    }

    if (trimmedContent.length > MAX_TASK_CHARACTERS) {
      return `Task content cannot exceed ${MAX_TASK_CHARACTERS} characters`;
    }

    return null;
  };

  // Handle adding a new task
  const addTask = (content: string): string | null => {
    const validationError = validateTaskContent(content);
    if (validationError) return validationError;

    const trimmedContent = content.trim();

    // Check if a similar task already exists
    const isSimilarTaskExists = tasks.some(
      (task) => task.content.toLowerCase() === trimmedContent.toLowerCase(),
    );

    if (isSimilarTaskExists) {
      return "Two tasks cannot have the same name";
    }

    // If all checks pass, add the new task
    const task: Task = {
      id: Date.now().toString(),
      content: trimmedContent,
      familyId: "default",
      order: tasks.length,
    };
    setTasks((prevTasks) => [...prevTasks, task]);
    return null; // Indicate success
  };

  // Handle renaming a task
  const renameTask = (taskId: string, newContent: string): string | null => {
    const validationError = validateTaskContent(newContent);
    if (validationError) return validationError;

    const trimmedContent = newContent.trim();

    // Check if the new name already exists for another task
    const isNameTaken = tasks.some(
      (task) =>
        task.id !== taskId &&
        task.content.toLowerCase() === trimmedContent.toLowerCase(),
    );

    if (isNameTaken) {
      return "Two tasks cannot have the same name";
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, content: trimmedContent } : task,
      ),
    );

    return null; // Indicate success
  };

  // Handle deleting a task
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, renameTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
