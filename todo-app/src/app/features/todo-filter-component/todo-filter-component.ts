import { Component, EventEmitter, Output, output } from '@angular/core';
import { TodoQuery } from '../../models/TodoQuery';

@Component({
  selector: 'app-todo-filter-component',
  standalone: false,
  templateUrl: './todo-filter-component.html',
  styleUrl: './todo-filter-component.css'
})
export class TodoFilterComponent {
  query: TodoQuery = {
    priority: '',
    category: '',
    isComplete: undefined,
    search: '',
    sortBy: 'CreatedAt',
    descending: false,
    page: 1,
    pageSize: 3
  };

  @Output() filterChange = new EventEmitter<TodoQuery>();

  applyFilter() {
    this.query.page = 1; 
    this.filterChange.emit(this.query); 
  }

  resetFilter() {
    this.query = {
      priority: '',
      category: '',
      isComplete: undefined,
      search: '',
      sortBy: 'CreatedAt',
      descending: false,
      page: 1,
      pageSize: 3
    };
    this.filterChange.emit(this.query);
  }

}
