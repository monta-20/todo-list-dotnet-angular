import { Component, Input } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';

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
}
