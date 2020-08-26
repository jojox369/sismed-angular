import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioRegisterComponent } from './laboratorio-register.component';

describe('LaboratorioRegisterComponent', () => {
  let component: LaboratorioRegisterComponent;
  let fixture: ComponentFixture<LaboratorioRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaboratorioRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratorioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
