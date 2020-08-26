import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExameListComponent } from './exame-list.component';

describe('ExameListComponent', () => {
  let component: ExameListComponent;
  let fixture: ComponentFixture<ExameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExameListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
