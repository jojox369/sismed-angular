import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaAnterioresComponent } from './agenda-anteriores.component';

describe('AgendaAnterioresComponent', () => {
  let component: AgendaAnterioresComponent;
  let fixture: ComponentFixture<AgendaAnterioresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaAnterioresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaAnterioresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
