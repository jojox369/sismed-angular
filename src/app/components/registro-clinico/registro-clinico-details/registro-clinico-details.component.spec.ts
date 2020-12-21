import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClinicoDetailsComponent } from './registro-clinico-details.component';

describe('RegistroClinicoDetailsComponent', () => {
  let component: RegistroClinicoDetailsComponent;
  let fixture: ComponentFixture<RegistroClinicoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroClinicoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroClinicoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
