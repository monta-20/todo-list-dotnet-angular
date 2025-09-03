import { Component, OnInit } from '@angular/core';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { TodoItem } from '../../models/TodoItem';
import { TodoQuery } from '../../models/TodoQuery';
import { PagedResult } from '../../models/PagedResult';

@Component({
  selector: 'app-todo-container-component',
  standalone: false,
  templateUrl: './todo-container-component.html',
  styleUrl: './todo-container-component.css'
})
export class TodoContainerComponent implements OnInit {
  todos: TodoItem[] = [];
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
  totalPages: number = 0;
  loading: boolean = false;
  errorMessage: string = '';

  showForm: boolean = false;
  currentTodo: TodoItem | null = null;

  constructor(private todoService: ToDoList) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.loading = true;
    this.todoService.getFiltred(this.query).subscribe({
      next: (data) => {
        const items = (data as any)?.items ?? (data as any) ?? [];
        const total = (data as any)?.total ?? items.length;

        this.todos = items;
        this.totalPages = Math.ceil(total / (this.query.pageSize || 1));
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des tâches.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFilterChange(newQuery: TodoQuery) {
    this.query = { ...newQuery, page: 1 };
    this.loadTodos();
  }

  changePage(offset: number) {
    if (!this.query.page || !this.totalPages) return;

    const newPage = this.query.page + offset;
    if (newPage < 1 || newPage > this.totalPages) return;

    this.query.page = newPage;
    this.loadTodos();
  }

  openCreateForm() {
    this.currentTodo = {
      id: 0,
      title: '',
      description: '',
      isComplete: false,
      priority: 'Moyenne',
      category: '',
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      dueDate: new Date().toISOString()
    };
    this.showForm = true;
  }

  openEditForm(todo: TodoItem) {
    this.currentTodo = { ...todo };
    this.showForm = true;
  }

  saveTodo(todo: TodoItem) {
    if (todo.id && todo.id > 0) {
      this.todoService.update(todo.id, todo).subscribe({
        next: () => {
          this.loadTodos();
          this.showForm = false;
        },
        error: (err) => console.error(err)
      });
    } else {
      this.todoService.create(todo).subscribe({
        next: () => {
          this.loadTodos();
          this.showForm = false;
        },
        error: (err) => console.error(err)
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.currentTodo = null;
  }

}

