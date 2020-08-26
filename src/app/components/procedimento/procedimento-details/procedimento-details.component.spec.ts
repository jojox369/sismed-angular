import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedimentoDetailsComponent } from './procedimento-details.component';

describe('ProcedimentoDetailsComponent', () => {
  let component: ProcedimentoDetailsComponent;
  let fixture: ComponentFixture<ProcedimentoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedimentoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
