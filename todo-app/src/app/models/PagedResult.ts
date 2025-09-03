import { TodoItem } from "./TodoItem";

export interface PagedResult {
  items: TodoItem[];
  total: number;
}
