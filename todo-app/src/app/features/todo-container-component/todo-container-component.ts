import { Component, OnInit } from '@angular/core';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { TodoItem } from '../../models/TodoItem';
import { TodoQuery } from '../../models/TodoQuery';
import {  Router } from '@angular/router';
declare var bootstrap: any;
@Component({
  selector: 'app-todo-container-component',
  standalone: false,
  templateUrl: './todo-container-component.html',
  styleUrl: './todo-container-component.css'
})
export class TodoContainerComponent implements OnInit {
  todos: TodoItem[] = [];
  todoIdToDelete: number | null = null;

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
  toastMessage: string = '';
  // Formulaire
  showForm: boolean = false;
  currentTodo: TodoItem = this.getEmptyTodo();

  constructor(private todoService: ToDoList, private router: Router) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  private getEmptyTodo(): TodoItem {
    return {
      id: 0,
      title: '',
      description: '',
      priority: '',
      category: '',
      isComplete: false,
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      dueDate: null
    };
  }

  // Chargement des todos
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

  // Filtrage
  onFilterChange(newQuery: TodoQuery) {
    this.query = { ...newQuery, page: 1 };
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

  // Formulaire ajout / édition
  openCreateForm() {
    this.currentTodo = this.getEmptyTodo();
    this.showForm = true;
    this.router.navigate(['/todo/add']);
  }

  openEditForm(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      this.currentTodo = { ...todo };
      if (this.currentTodo.dueDate) {
        this.currentTodo.dueDate = this.currentTodo.dueDate.split('T')[0];
      }
      this.showForm = true;
    }
    this.router.navigate([`/todo/edit/${id}`]);
  }


  saveTodo(todo: TodoItem) {
    if (todo.id && todo.id > 0) {
      this.todoService.update(todo.id, todo).subscribe(() => {
        this.showToast('mise à jour');
        this.showForm = false;
        this.loadTodos();
      });
    } else {
      this.todoService.create(todo).subscribe(() => {
        this.showToast('ajoutée');
        this.showForm = false;
        this.loadTodos();
      });
    }
    this.router.navigate(["/todo"]);
  }

  cancelForm() {
    this.showForm = false;
    this.router.navigate(["/todo"]);
  }

  // Ouvre le modal et stocke l'id à supprimer
  deleteTodo(id: number) {
    this.todoIdToDelete = id;
    const modalEl = document.getElementById('confirmDeleteModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // Confirme la suppression lorsque l'utilisateur clique sur le bouton du modal
  confirmDelete() {
    if (this.todoIdToDelete === null) return;

    this.todoService.delete(this.todoIdToDelete).subscribe({
      next: () => {
        this.loadTodos();
        this.showToast('supprimée');
      },
      error: err => {
        console.error('Erreur delete:', err);
        this.showToast('Erreur lors de la suppression');
      }
    });

    // Fermer le modal
    const modalEl = document.getElementById('confirmDeleteModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }

    this.todoIdToDelete = null;
  }

  // Méthode toast
  showToast(action: string) {
    this.toastMessage = action;
    const toastEl = document.getElementById('liveToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

}


