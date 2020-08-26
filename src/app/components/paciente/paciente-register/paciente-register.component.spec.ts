import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteRegisterComponent } from './paciente-register.component';

describe('PacienteRegisterComponent', () => {
  let component: PacienteRegisterComponent;
  let fixture: ComponentFixture<PacienteRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacienteRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacienteRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
