import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoConvenioRegisterDialogComponent } from './tipo-convenio-register-dialog.component';

describe('TipoConvenioRegisterDialogComponent', () => {
  let component: TipoConvenioRegisterDialogComponent;
  let fixture: ComponentFixture<TipoConvenioRegisterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoConvenioRegisterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoConvenioRegisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
