export interface TodoItem {
  id: number;
  title?: string;
  description?: string;
  isComplete: boolean;
  isOverdue?: boolean;    
  canToggle?: boolean;
  priority?: string;
  createdAt: string;
  lastModifiedAt: string;
  dueDate?: string | null;
  category?: string;
}
