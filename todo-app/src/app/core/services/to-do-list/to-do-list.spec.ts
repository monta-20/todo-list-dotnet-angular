import { TestBed } from '@angular/core/testing';

import { ToDoList } from './to-do-list';

describe('ToDoList', () => {
  let service: ToDoList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToDoList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
