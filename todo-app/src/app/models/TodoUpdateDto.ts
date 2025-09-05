export interface TodoUpdateDto {
  id?: number;             
  title?: string;          
  description?: string;    
  isComplete: boolean;     
  priority?: string;       
  dueDate?: string;        
  category?: string;       
  isOverdue: boolean;      
  lastModifiedAt: string;
}
