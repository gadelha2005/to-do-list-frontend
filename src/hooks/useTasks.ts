import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import type { Task, TaskRequest, TaskStatus } from "../types/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTasks();
        if (!cancelled) setTasks(data);
      } catch {
        if (!cancelled) setError("Erro ao carregar tarefas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const refetch = () => setTrigger((n) => n + 1);

  const addTask = async (data: TaskRequest) => {
    const task = await createTask(data);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const editTask = async (id: number, data: TaskRequest) => {
    const updated = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTask = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStatus = async (task: Task) => {
    const next: TaskStatus =
      task.status === "PENDING"
        ? "IN_PROGRESS"
        : task.status === "IN_PROGRESS"
          ? "DONE"
          : "PENDING";
    return editTask(task.id, { title: task.title, status: next });
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
    refetch,
  };
}
