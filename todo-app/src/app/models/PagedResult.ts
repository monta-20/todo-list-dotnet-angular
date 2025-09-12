import { TodoItem } from "./TodoItem";

export interface PagedResult<T> {
  items: T[];
  total: number;
}
