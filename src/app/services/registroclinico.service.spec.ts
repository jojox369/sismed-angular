import { TestBed } from '@angular/core/testing';

import { RegistroclinicoService } from './registroclinico.service';

describe('RegistroclinicoService', () => {
  let service: RegistroclinicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroclinicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
