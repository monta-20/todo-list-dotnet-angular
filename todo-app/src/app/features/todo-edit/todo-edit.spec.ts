import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoEdit } from './todo-edit';

describe('TodoEdit', () => {
  let component: TodoEdit;
  let fixture: ComponentFixture<TodoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
