import { Component, OnInit } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';
import { Router } from '@angular/router';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';

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

  constructor(private todoService: ToDoList, private router: Router) { }

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
        alert('✅ Tâche créée avec succès !');
        this.router.navigate(['/todo']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création', err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/todo']);
  }
}
