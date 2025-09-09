import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TodoItem } from '../../models/TodoItem';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';

@Component({
  selector: 'app-todo-form-component',
  standalone: false,
  templateUrl: './todo-form-component.html',
  styleUrl: './todo-form-component.css'
})

export class TodoFormComponent implements OnChanges {
  @Input() todo!: TodoItem;
  @Output() saveTodo = new EventEmitter<TodoItem>();
  @Output() cancel = new EventEmitter<void>();

  priorities: string[] = [];
  categories: string[] = [];
  today: string = '';

  constructor(private todoService: ToDoList) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && !this.todo) {
      this.todo = {
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
  }

  ngOnInit(): void {
    this.todoService.getMetadata().subscribe(data => {
      this.priorities = data.priorities;
      this.categories = data.categories;
    });
    this.today = new Date().toISOString().split('T')[0];
  }

  onSubmit() {
    this.todo.lastModifiedAt = new Date().toISOString();
    this.saveTodo.emit(this.todo);
  }

  onCancel() {
    this.cancel.emit();
  }
}

