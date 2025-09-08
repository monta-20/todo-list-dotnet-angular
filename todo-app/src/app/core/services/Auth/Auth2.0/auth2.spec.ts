import { TestBed } from '@angular/core/testing';

import { Auth2 } from './auth2';

describe('Auth2', () => {
  let service: Auth2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
