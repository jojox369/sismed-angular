import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClinicoRegisterComponent } from './registro-clinico-register.component';

describe('RegistroClinicoRegisterComponent', () => {
  let component: RegistroClinicoRegisterComponent;
  let fixture: ComponentFixture<RegistroClinicoRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroClinicoRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroClinicoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
