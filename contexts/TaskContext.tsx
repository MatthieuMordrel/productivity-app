"use client";

import { Task } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

interface TaskContextType {
  tasks: Task[];
  addTask: (content: string) => string | null;
  deleteTask: (taskId: string) => void;
  renameTask: (taskId: string, newContent: string) => void;
}

//Create an object that is the context, set to undefined
//This object has a property called Provider, which can be used to wrap around the components that need to access the context
//The Provider component will pass down the context to the components that need it
const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Handle adding a new task
  const addTask = (content: string): string | null => {
    const trimmedContent = content.trim();
    if (trimmedContent === "") {
      return "Task content cannot be empty";
    }

    // Check if a similar task already exists
    console.log("tasks", tasks);
    const isSimilarTaskExists = tasks.some(
      (task) => task.content.toLowerCase() === trimmedContent.toLowerCase(),
    );

    if (isSimilarTaskExists) {
      return "Two tasks cannot have the same name";
    }

    // If no similar task exists, add the new task
    const task: Task = {
      id: Date.now().toString(),
      content: trimmedContent,
    };
    setTasks((prevTasks) => [...prevTasks, task]);
    return null; // Indicate success
  };

  // Handle deleting a task
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Handle renaming a task
  const renameTask = (taskId: string, newContent: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, content: newContent } : task,
      ),
    );
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
