import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioTipoConvenioListComponent } from './funcionario-tipo-convenio-list.component';

describe('FuncionarioTipoConvenioListComponent', () => {
  let component: FuncionarioTipoConvenioListComponent;
  let fixture: ComponentFixture<FuncionarioTipoConvenioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioTipoConvenioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioTipoConvenioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
