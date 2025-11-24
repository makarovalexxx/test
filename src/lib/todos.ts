import { db } from "./db";
import type { Todo, TodoStatus } from "./types";

export async function createTodo(input: {
  title: string;
  description?: string;
  status?: TodoStatus;
}): Promise<number> {
  const now = Date.now();
  const todo: Omit<Todo, "id"> = {
    title: input.title.trim(),
    description: input.description?.trim() || "",
    status: input.status ?? "active",
    createdAt: now,
    updatedAt: now,
  };
  return db.todos.add(todo);
}

export async function getAllTodos(): Promise<Todo[]> {
  return db.todos.orderBy("createdAt").reverse().toArray();
}

export async function searchTodosByTitle(query: string): Promise<Todo[]> {
  const q = query.trim().toLowerCase();
  if (!q) return getAllTodos();
  // Dexie filter (client-side) since we didn't define a case-insensitive index
  return db.todos
    .filter((t) => t.title.toLowerCase().includes(q))
    .sortBy("createdAt")
    .then((list) => list.reverse());
}

export async function updateTodo(
  id: number,
  data: Partial<Pick<Todo, "title" | "description" | "status">>
): Promise<number> {
  const changes = {
    ...data,
    updatedAt: Date.now(),
  };
  return db.todos.update(id, changes);
}

export async function deleteTodo(id: number): Promise<void> {
  await db.todos.delete(id);
}
