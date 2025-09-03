export interface TodoQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
  priority?: string;
  category?: string;
  isComplete?: boolean;
  search?: string;
}
