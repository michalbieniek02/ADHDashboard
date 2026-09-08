import { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  toggleTask as toggleTaskApi,
  deleteTask as deleteTaskApi,
} from "../api/tasks";

import type { Task } from "../types";

export function useTasks(loggedIn: boolean) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(
          "Błąd ładowania tasków:",
          error
        );
      }
    };

    loadTasks();
  }, [loggedIn]);

  const addTask = async (
    title: string,
    type: "daily" | "general"
  ) => {
    const newTask = await createTask(
      title,
      type
    );

    setTasks((current) => [
      ...current,
      newTask,
    ]);
  };

  const toggleTask = async (id: number) => {
  const updatedTask =
    await toggleTaskApi(id);

  setTasks((current) =>
    current.map((task) =>
      task.id === id
        ? updatedTask
        : task
    )
  );
};

const deleteTask = async (id: number) => {
  await deleteTaskApi(id);

  setTasks((current) =>
    current.filter((task) => task.id !== id)
  );
};

return {
  tasks,
  addTask,
  toggleTask,
  deleteTask,
};
}