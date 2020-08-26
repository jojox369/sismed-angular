import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClinicoListComponent } from './registro-clinico-list.component';

describe('RegistroClinicoListComponent', () => {
  let component: RegistroClinicoListComponent;
  let fixture: ComponentFixture<RegistroClinicoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroClinicoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroClinicoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
