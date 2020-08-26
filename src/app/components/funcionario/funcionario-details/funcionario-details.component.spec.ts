import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioDetailsComponent } from './funcionario-details.component';

describe('FuncionarioDetailsComponent', () => {
  let component: FuncionarioDetailsComponent;
  let fixture: ComponentFixture<FuncionarioDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncionarioDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncionarioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
