import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPreRegisterComponent } from './agenda-pre-register.component';

describe('AgendaPreRegisterComponent', () => {
  let component: AgendaPreRegisterComponent;
  let fixture: ComponentFixture<AgendaPreRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaPreRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPreRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
