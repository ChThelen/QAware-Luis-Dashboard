import { TestBed } from '@angular/core/testing';

import { LuisAppService } from './luis-app.service';

describe('LuisAppService', () => {
  let service: LuisAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuisAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
