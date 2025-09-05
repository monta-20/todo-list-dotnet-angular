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
    if (!todo.id) return;

    const dto: TodoUpdateDto = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isComplete: todo.isComplete,
      priority: todo.priority,
      dueDate: todo.dueDate ?? undefined,
      category: todo.category,
      isOverdue: this.isOverdue(todo),
      lastModifiedAt: todo.lastModifiedAt
    };

    this.todoService.toggleComplete(dto.id!).subscribe({
      next: updatedTodo => {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index > -1) {
          this.todos[index] = { ...this.todos[index], ...updatedTodo };
        }
      },
      error: err => console.error('Erreur toggle complete:', err)
    });
  }


  isOverdue(todo: TodoItem): boolean {
    return todo.dueDate ? new Date(todo.dueDate) < new Date() && !todo.isComplete : false;
  }

  onEdit(todo: TodoItem) { this.edit.emit(todo.id); }
  onDelete(todo: TodoItem) { this.delete.emit(todo.id); }



}
