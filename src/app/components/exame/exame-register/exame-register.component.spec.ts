import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExameRegisterComponent } from './exame-register.component';

describe('ExameRegisterComponent', () => {
  let component: ExameRegisterComponent;
  let fixture: ComponentFixture<ExameRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExameRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExameRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
