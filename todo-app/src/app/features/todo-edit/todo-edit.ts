import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { TodoItem } from '../../models/TodoItem';

@Component({
  selector: 'app-todo-edit',
  standalone: false,
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.css'
})
export class TodoEdit {

  todo!: TodoItem; // sera chargé via API
  priorities: string[] = [];
  categories: string[] = [];
  today: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private todoService: ToDoList,
    private router: Router
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
        this.todo = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur de chargement', err);
        this.router.navigate(['/todo']);
      }
    });

    // Min date pour dueDate
    this.today = new Date().toISOString().split('T')[0];
  }

  onSubmit() {
    this.todo.lastModifiedAt = new Date().toISOString();

    this.todoService.update(this.todo.id, this.todo).subscribe({
      next: () => {
        alert('✅ Tâche mise à jour avec succès !');
        this.router.navigate(['/todo']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la mise à jour', err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/todo']);
  }
}
