import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExameDetailsComponent } from './exame-details.component';

describe('ExameDetailsComponent', () => {
  let component: ExameDetailsComponent;
  let fixture: ComponentFixture<ExameDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExameDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
