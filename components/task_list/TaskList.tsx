"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskContext } from "@/contexts/TaskContext";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "../ui/button";
import Task from "./Task";
import TaskTooltipInfo from "./TaskTooltipInfo";

const TaskList: React.FC<{ className?: string }> = ({ className }) => {
  const { tasks, addTask } = useTaskContext();
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = addTask(newTask);
    console.log("errorMessage", errorMessage);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setNewTask("");
      setError(null);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
    setError(null); // Clear error when user starts typing
  };

  return (
    <Card
      variant="none"
      className={cn("min-h-[calc(100vh-88px)] max-w-full", className)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          Tasks
          <TaskTooltipInfo />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add new task form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="space-y-2">
            <input
              type="text"
              value={newTask}
              onChange={handleInputChange}
              placeholder="Enter a new task"
              className={cn(
                "w-full rounded border p-2",
                error ? "border-red-500" : "border-transparent",
              )}
            />
            <div className="h-6">
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-full rounded p-2 transition-colors hover:bg-opacity-90"
          >
            Add Task
          </Button>
        </form>

        <Droppable
          droppableId="taskList"
          isDropDisabled={true}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <Task
                  key={task.id}
                  task={task}
                  index={index}
                  setRenameError={setRenameError}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>

        {/* Move renameError below the task list */}
        {renameError && (
          <div className="mt-4 text-sm text-red-500" role="alert">
            {renameError}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
