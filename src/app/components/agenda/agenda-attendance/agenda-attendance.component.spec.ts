import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaAttendanceComponent } from './agenda-attendance.component';

describe('AgendaAttendanceComponent', () => {
  let component: AgendaAttendanceComponent;
  let fixture: ComponentFixture<AgendaAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
