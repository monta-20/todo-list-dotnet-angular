import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';

@Component({
  selector: 'app-todo-form-component',
  standalone: false,
  templateUrl: './todo-form-component.html',
  styleUrl: './todo-form-component.css'
})
export class TodoFormComponent {
  @Input() todo!: TodoItem;

  @Output() saveTodo = new EventEmitter<TodoItem>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit() {
    if (this.todo) {
      this.saveTodo.emit(this.todo);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
