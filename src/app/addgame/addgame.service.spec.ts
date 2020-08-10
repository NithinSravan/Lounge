import { TestBed } from '@angular/core/testing';

import { AddgameService } from './addgame.service';

describe('AddgameService', () => {
  let service: AddgameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddgameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
