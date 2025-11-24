import Dexie, { type Table } from "dexie";
import type { Todo } from "./types";

class AppDB extends Dexie {
  todos!: Table<Todo, number>;

  constructor() {
    super("vibe-todos");
    this.version(1).stores({
      // ++id = autoincremented primary key
      todos: "++id, title, status, createdAt, updatedAt",
    });
  }
}

export const db = new AppDB();
