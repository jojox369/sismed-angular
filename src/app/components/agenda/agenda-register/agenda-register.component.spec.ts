import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaRegisterComponent } from './agenda-register.component';

describe('AgendaRegisterComponent', () => {
  let component: AgendaRegisterComponent;
  let fixture: ComponentFixture<AgendaRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
