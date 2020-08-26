import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioRegisterComponent } from './convenio-register.component';

describe('ConvenioRegisterComponent', () => {
  let component: ConvenioRegisterComponent;
  let fixture: ComponentFixture<ConvenioRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvenioRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
