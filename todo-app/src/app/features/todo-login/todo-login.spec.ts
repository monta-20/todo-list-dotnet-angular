import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoLogin } from './todo-login';

describe('TodoLogin', () => {
  let component: TodoLogin;
  let fixture: ComponentFixture<TodoLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
