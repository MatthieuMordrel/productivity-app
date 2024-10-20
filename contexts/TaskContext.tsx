"use client";

import { Task } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

//Create an object that is the context, set to undefined
//This object has a property called Provider, which can be used to wrap around the components that need to access the context
//The Provider component will pass down the context to the components that need it
const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    //Create a provider component that will wrap around the components that need to access the context
    //The provider component will pass down the context to the components that need it
    //The provider takes a value prop, which is the context object
    <TaskContext.Provider value={{ tasks, setTasks }}>
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
