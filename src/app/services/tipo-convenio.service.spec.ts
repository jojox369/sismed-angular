import { TestBed } from '@angular/core/testing';

import { TipoConvenioService } from './tipo-convenio.service';

describe('TipoConvenioService', () => {
  let service: TipoConvenioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoConvenioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
