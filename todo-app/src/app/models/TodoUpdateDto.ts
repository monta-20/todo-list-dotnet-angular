export interface TodoUpdateDto {
  id: number;
  title: string;
  isComplete: boolean;
  isOverdue: boolean;
  canToggle: boolean;
  dueDate: string;
  lastModifiedAt: string;
}
