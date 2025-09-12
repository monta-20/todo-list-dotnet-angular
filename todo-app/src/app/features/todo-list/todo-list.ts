import { Component, OnInit } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';
import { PagedResult } from '../../models/PagedResult';
import { TodoQuery } from '../../models/TodoQuery';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/Toast/toast.service';
import { ConfirmService } from '../../core/services/Confirm/confirm.service';

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
  priorities: string[] = [];
  categories: string[] = [];
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

  constructor(private todoService: ToDoList, private toast: ToastService, private confirm: ConfirmService , public router: Router) { }

  ngOnInit(): void {
    this.todoService.getMetadata().subscribe(data => {
      this.priorities = data.priorities;
      this.categories = data.categories;
    });
    this.loadTodos();
  }

  toggleFilterExpansion(): void {
    this.filterExpanded = !this.filterExpanded;
  }

  loadTodos() {
    this.loading = true;
    this.todoService.getFiltred(this.query).subscribe({
      next: (res: PagedResult<TodoItem>) => {
        this.todos = res.items;
        this.totalItems = res.total;
        this.totalPages = Math.ceil(this.totalItems / this.query.pageSize!);
        this.loading = false;
      },
      error: err => {
        this.toast.show('Erreur lors du chargement des todos', 'error');
        this.loading = false;
      }
    });
  }

  toggleComplete(todo: TodoItem) {
    this.todoService.toggleComplete(todo.id).subscribe({
      next: updated => {
        Object.assign(todo, updated);
        this.toast.show(
          `Tâche "${todo.title}" mise à jour (${todo.isComplete ? 'complète' : 'incomplète'})`,
          'success'
        );
      },
      error: err => {
        this.toast.show('Erreur lors du changement de statut', 'error');
        console.error(err);
      }
    });
  }

  deleteTodo(todo: TodoItem) {
    this.confirm.confirm({
      title: 'Suppression',
      message: `Voulez-vous vraiment supprimer "${todo.title}" ?`,
      confirmText: 'Oui, supprimer',
      cancelText: 'Annuler'
    }).then(result => {
      if (result) {
        this.todoService.delete(todo.id).subscribe({
          next: () => {
            this.loadTodos();
            this.toast.show(`Tâche "${todo.title}" supprimée`, 'success');
          },
          error: err => {
            this.toast.show('Erreur lors de la suppression', 'error');
            console.error(err);
          }
        });
      }
    });
  }

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
    this.toast.show('Filtres réinitialisés', 'success');
  }

  changePage(offset: number) {
    if (!this.query.page || !this.totalPages) return;
    const newPage = this.query.page + offset;
    if (newPage < 1 || newPage > this.totalPages) return;

    this.query.page = newPage;
    this.loadTodos();
  }

  trackByTodoId(index: number, todo: TodoItem): number {
    return todo.id;
  }
}
