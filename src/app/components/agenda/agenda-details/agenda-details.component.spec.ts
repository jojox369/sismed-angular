import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaDetailsComponent } from './agenda-details.component';

describe('AgendaDetailsComponent', () => {
  let component: AgendaDetailsComponent;
  let fixture: ComponentFixture<AgendaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
