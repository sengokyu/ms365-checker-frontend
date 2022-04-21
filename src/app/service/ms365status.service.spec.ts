import { TestBed } from '@angular/core/testing';

import { Ms365statusService } from './ms365status.service';

describe('Ms365statusService', () => {
  let service: Ms365statusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ms365statusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
