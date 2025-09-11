import { Component, OnInit } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';
import { PagedResult } from '../../models/PagedResult';
import { TodoQuery } from '../../models/TodoQuery';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: false,
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoList implements OnInit {
  todos: TodoItem[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  filterExpanded: boolean = false;

  // Pagination + filtres
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

  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private todoService: ToDoList, public router: Router) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  // Bascule affichage filtres
  toggleFilterExpansion(): void {
    this.filterExpanded = !this.filterExpanded;
  }

  // Charger les todos
  loadTodos() {
    this.loading = true;
    this.todoService.getFiltred(this.query).subscribe({
      next: (res: PagedResult) => {
        this.todos = res.items;
        this.totalItems = res.total;
        this.totalPages = Math.ceil(this.totalItems / this.query.pageSize!);
        this.loading = false;
      },
      error: err => {
        this.errorMessage = 'Erreur lors du chargement des todos';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Marquer comme complet/incomplet
  toggleComplete(todo: TodoItem) {
    this.todoService.toggleComplete(todo.id).subscribe({
      next: updated => {
        todo.isComplete = updated.isComplete;
        todo.isOverdue = updated.isOverdue;
        todo.canToggle = updated.canToggle;
        todo.lastModifiedAt = updated.lastModifiedAt;
      },
      error: err => console.error('Erreur lors du toggle', err)
    });
  }

  // Supprimer
  deleteTodo(todo: TodoItem) {
    this.todoService.delete(todo.id).subscribe({
      next: () => this.loadTodos(),
      error: err => console.error('Erreur lors de la suppression', err)
    });
  }

  // Appliquer filtre
  applyFilter() {
    this.query.page = 1;
    this.loadTodos();
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
    this.loadTodos();
  }

  // Pagination
  changePage(offset: number) {
    if (!this.query.page || !this.totalPages) return;
    const newPage = this.query.page + offset;
    if (newPage < 1 || newPage > this.totalPages) return;

    this.query.page = newPage;
    this.loadTodos();
  }

  // TrackBy
  trackByTodoId(index: number, todo: TodoItem): number {
    return todo.id;
  }
}
