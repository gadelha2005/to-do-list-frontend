import axiosInstance from './axiosInstance';
import type { Task, TaskRequest, TaskStatus } from '../types/task';

export async function getTasks(status?: TaskStatus): Promise<Task[]> {
  const params = status ? { status } : {};
  const response = await axiosInstance.get<Task[]>('/tasks', { params });
  return response.data;
}

export async function getTask(id: number): Promise<Task> {
  const response = await axiosInstance.get<Task>(`/tasks/${id}`);
  return response.data;
}

export async function createTask(data: TaskRequest): Promise<Task> {
  const response = await axiosInstance.post<Task>('/tasks', data);
  return response.data;
}

export async function updateTask(id: number, data: TaskRequest): Promise<Task> {
  const response = await axiosInstance.patch<Task>(`/tasks/${id}`, data);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await axiosInstance.delete(`/tasks/${id}`);
}
