import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorioDetailsComponent } from './laboratorio-details.component';

describe('LaboratorioDetailsComponent', () => {
  let component: LaboratorioDetailsComponent;
  let fixture: ComponentFixture<LaboratorioDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaboratorioDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratorioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
