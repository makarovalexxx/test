import { writable } from "svelte/store";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export const toasts = writable<Toast[]>([]);

let nextId = 1;

export function pushToast(
  type: ToastType,
  message: string,
  timeoutMs = 3000
): number {
  const id = nextId++;
  toasts.update((list) => [...list, { id, type, message }]);
  if (timeoutMs > 0) {
    setTimeout(() => dismissToast(id), timeoutMs);
  }
  return id;
}

export function dismissToast(id: number): void {
  toasts.update((list) => list.filter((t) => t.id !== id));
}

export const notify = {
  success: (msg: string, t = 2500) => pushToast("success", msg, t),
  error: (msg: string, t = 3500) => pushToast("error", msg, t),
  info: (msg: string, t = 3000) => pushToast("info", msg, t),
};
