import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioTipoConvenioDeleteComponent } from './funcionario-tipo-convenio-delete.component';

describe('FuncionarioTipoConvenioDeleteComponent', () => {
  let component: FuncionarioTipoConvenioDeleteComponent;
  let fixture: ComponentFixture<FuncionarioTipoConvenioDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioTipoConvenioDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioTipoConvenioDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
