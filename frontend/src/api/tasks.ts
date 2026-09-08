import type { Task } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("jwt");
}

export async function getTasks(): Promise<Task[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać tasków");
  }

  return response.json();
}

export async function createTask(
  title: string,
  type: "daily" | "general"
): Promise<Task> {
  const token = getToken();

  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      type,
    }),
  });

  if (!response.ok) {
    throw new Error("Nie udało się dodać taska");
  }

  return response.json();
}

export async function toggleTask(
  id: number
): Promise<Task> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/tasks/${id}/toggle`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się zmienić taska");
  }

  return response.json();
}

export async function deleteTask(
  id: number
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/tasks/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Nie udało się usunąć taska");
  }
}