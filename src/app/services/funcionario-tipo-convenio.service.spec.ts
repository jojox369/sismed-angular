import { TestBed } from '@angular/core/testing';

import { FuncionarioTipoConvenioService } from './funcionario-tipo-convenio.service';

describe('FuncionarioTipoConvenioService', () => {
  let service: FuncionarioTipoConvenioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionarioTipoConvenioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
