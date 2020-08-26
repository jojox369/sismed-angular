import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedimentoRegisterComponent } from './procedimento-register.component';

describe('ProcedimentoRegisterComponent', () => {
  let component: ProcedimentoRegisterComponent;
  let fixture: ComponentFixture<ProcedimentoRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedimentoRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
