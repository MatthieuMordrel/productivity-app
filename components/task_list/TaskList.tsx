"use client";

import { Task } from "@/lib/types";
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState<string>("");

  // Handle adding a new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        content: newTask.trim(),
      };
      setTasks((prevTasks) => [...prevTasks, task]);
      setNewTask("");
    }
  };

  return (
    <div className="mx-auto max-w-md bg-background p-4 text-foreground">
      <h2 className="mb-4 text-2xl font-bold">Task List</h2>

      {/* Add new task form */}
      <form onSubmit={handleAddTask} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="mb-2 w-full rounded border bg-secondary p-2 text-foreground"
        />
        <button
          type="submit"
          className="w-full rounded bg-primary p-2 text-white transition-colors hover:bg-opacity-90"
        >
          Add Task
        </button>
      </form>

      {/* Droppable area for the entire task list */}
      {/* Droppable component represents the area where items can be dropped */}
      <Droppable droppableId="tasks">
        {/* The Droppable component uses a render prop pattern, providing the 'provided' object */}
        {(provided) => (
          <ul
            /* Spread the droppableProps to enable drop functionality */
            {...provided.droppableProps}
            /* Attach the innerRef to allow react-beautiful-dnd to track this element */
            ref={provided.innerRef}
            className="space-y-2"
          >
            {/* Iterate through tasks to create individual Draggable components */}
            {tasks.map((task, index) => (
              /* Each Draggable must have a unique draggableId and an index */
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {/* Draggable also uses a render prop pattern */}
                {(provided) => (
                  <li
                    /* Attach the innerRef for tracking */
                    ref={provided.innerRef}
                    /* Spread draggableProps to make the item draggable */
                    {...provided.draggableProps}
                    /* Spread dragHandleProps to specify which part of the item can be used to drag it */
                    {...provided.dragHandleProps}
                    className="rounded bg-secondary p-3 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Container for task content */}
                    <div className="flex items-center justify-between">
                      {/* Display the task content */}
                      <span>{task.content}</span>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {/* 
              This placeholder is crucial for react-beautiful-dnd to function correctly.
              It maintains the correct list height when items are being dragged.
            */}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList;
