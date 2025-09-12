import { Component, OnInit } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';
import { Router } from '@angular/router';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-todo-create',
  standalone: false,
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.css'
})

export class TodoCreate implements OnInit {
  priorities: string[] = [];
  categories: string[] = [];
  today: string = '';

  todo: TodoItem = {
    id: 0,
    title: '',
    description: '',
    isComplete: false,
    priority: '',
    createdAt: new Date().toISOString(),
    lastModifiedAt: new Date().toISOString(),
    dueDate: null,
    category: ''
  };

  constructor(
    private todoService: ToDoList,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.todoService.getMetadata().subscribe(data => {
      this.priorities = data.priorities;
      this.categories = data.categories;
    });

    const now = new Date();
    this.today = now.toISOString().split('T')[0];
  }

  onSubmit() {
    this.todo.lastModifiedAt = new Date().toISOString();

    this.todoService.create(this.todo).subscribe({
      next: () => {
        // Toast succès
        this.toast.show(`Tâche "${this.todo.title}" créée avec succès !`, 'success', 2000);

        // Redirection après un petit délai
        setTimeout(() => {
          this.router.navigate(['/todo']);
        }, 1500);
      },
      error: (err) => {
        // Toast erreur
        this.toast.show(
          err.error?.message || 'Impossible de créer la tâche.',
          'error',
          2000
        );
      }
    });
  }

  onCancel() {
    this.router.navigate(['/todo']);
  }
}
