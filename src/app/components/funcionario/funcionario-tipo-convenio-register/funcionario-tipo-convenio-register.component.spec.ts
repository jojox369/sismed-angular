import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioTipoConvenioRegisterComponent } from './funcionario-tipo-convenio-register.component';

describe('FuncionarioTipoConvenioRegisterComponent', () => {
  let component: FuncionarioTipoConvenioRegisterComponent;
  let fixture: ComponentFixture<FuncionarioTipoConvenioRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioTipoConvenioRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioTipoConvenioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
