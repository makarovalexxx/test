export type TodoStatus = "active" | "completed";

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: number;
  updatedAt: number;
}
