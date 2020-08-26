import { TestBed } from '@angular/core/testing';

import { LaboratorioTipoConvenioService } from './laboratorio-tipo-convenio.service';

describe('LaboratorioTipoConvenioService', () => {
  let service: LaboratorioTipoConvenioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorioTipoConvenioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
