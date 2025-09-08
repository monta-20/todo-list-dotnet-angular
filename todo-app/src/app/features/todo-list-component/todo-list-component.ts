import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';
import { TodoUpdateDto } from '../../models/TodoUpdateDto';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';

@Component({
  selector: 'app-todo-list-component',
  standalone: false,
  templateUrl: './todo-list-component.html',
  styleUrl: './todo-list-component.css'
})
export class TodoListComponent {
  @Input() todos: TodoItem[] = [];
  @Input() loading: boolean = false;
  @Input() errorMessage: string = '';

  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  constructor(private todoService: ToDoList) { }

  toggleComplete(todo: TodoItem) {
    this.todoService.toggleComplete(todo.id).subscribe({
      next: updated => {
        todo.isComplete = updated.isComplete;
        todo.isOverdue = updated.isOverdue;
        todo.canToggle = updated.canToggle;
        todo.lastModifiedAt = updated.lastModifiedAt;
      },
      error: err => {
        console.error('Erreur lors du toggle', err);
      }
    });
    console.log('Toggle complete for todo id:', todo.dueDate);
  }
  trackByTodoId(index: number, todo: TodoItem): number {
    return todo.id; 
  }
  onEdit(todo: TodoItem) { this.edit.emit(todo.id); }
  onDelete(todo: TodoItem) { this.delete.emit(todo.id); }
}
