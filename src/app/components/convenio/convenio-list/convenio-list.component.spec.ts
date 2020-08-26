import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenioListComponent } from './convenio-list.component';

describe('ConvenioListComponent', () => {
  let component: ConvenioListComponent;
  let fixture: ComponentFixture<ConvenioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvenioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
