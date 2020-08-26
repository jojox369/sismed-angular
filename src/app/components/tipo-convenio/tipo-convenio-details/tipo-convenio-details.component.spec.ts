import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoConvenioDetailsComponent } from './tipo-convenio-details.component';

describe('TipoConvenioDetailsComponent', () => {
  let component: TipoConvenioDetailsComponent;
  let fixture: ComponentFixture<TipoConvenioDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoConvenioDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoConvenioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
