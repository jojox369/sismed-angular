import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClinicoPacienteListAllComponent } from './registro-clinico-paciente-list-all.component';

describe('RegistroClinicoPacienteListAllComponent', () => {
  let component: RegistroClinicoPacienteListAllComponent;
  let fixture: ComponentFixture<RegistroClinicoPacienteListAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroClinicoPacienteListAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroClinicoPacienteListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
