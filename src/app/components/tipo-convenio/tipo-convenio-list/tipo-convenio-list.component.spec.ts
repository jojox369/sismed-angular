import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoConvenioListComponent } from './tipo-convenio-list.component';

describe('TipoConvenioListComponent', () => {
  let component: TipoConvenioListComponent;
  let fixture: ComponentFixture<TipoConvenioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoConvenioListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoConvenioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
