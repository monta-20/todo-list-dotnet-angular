export interface TodoItem {
  id: number;
  title?: string;
  description?: string;
  isComplete: boolean;
  isOverdue?: boolean;    // ajouté
  canToggle?: boolean;    // ajouté
  priority?: string;
  createdAt: string;
  lastModifiedAt: string;
  dueDate?: string | null;
  category?: string;
}
