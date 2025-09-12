import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { TodoItem } from '../../models/TodoItem';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-todo-edit',
  standalone: false,
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.css'
})
export class TodoEdit {
  todo!: TodoItem;
  priorities: string[] = [];
  categories: string[] = [];
  today: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private todoService: ToDoList,
    private router: Router,
    private toast: ToastService 
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Charger les métadonnées (priorités + catégories)
    this.todoService.getMetadata().subscribe(data => {
      this.priorities = data.priorities;
      this.categories = data.categories;
    });

    // Charger le todo à modifier
    this.todoService.getById(id).subscribe({
      next: (data) => {
        if (data.dueDate) {
          const d = new Date(data.dueDate);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          data.dueDate = `${year}-${month}-${day}`;
        }
        this.todo = data;
        this.loading = false;
      },
      error: (err) => {
        this.toast.show('Impossible de charger la tâche.', 'error', 2000);
        this.router.navigate(['/todo']);
      }
    });
  }

  onSubmit() {
    this.todo.lastModifiedAt = new Date().toISOString();

    this.todoService.update(this.todo.id, this.todo).subscribe({
      next: () => {
        this.toast.show(
          `Tâche "${this.todo.title}" mise à jour avec succès !`,
          'success',
          3000
        );

        setTimeout(() => {
          this.router.navigate(['/todo']);
        }, 1500);
      },
      error: (err) => {
        this.toast.show(
          err.error?.message || 'Erreur lors de la mise à jour.',
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

