import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoConvenioRegisterComponent } from './tipo-convenio-register.component';

describe('TipoConvenioRegisterComponent', () => {
  let component: TipoConvenioRegisterComponent;
  let fixture: ComponentFixture<TipoConvenioRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoConvenioRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoConvenioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
