import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioRegisterComponent } from './funcionario-register.component';

describe('FuncionarioRegisterComponent', () => {
  let component: FuncionarioRegisterComponent;
  let fixture: ComponentFixture<FuncionarioRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
