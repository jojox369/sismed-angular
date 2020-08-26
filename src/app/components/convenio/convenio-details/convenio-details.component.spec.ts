import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioDetailsComponent } from './convenio-details.component';

describe('ConvenioDetailsComponent', () => {
  let component: ConvenioDetailsComponent;
  let fixture: ComponentFixture<ConvenioDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvenioDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
