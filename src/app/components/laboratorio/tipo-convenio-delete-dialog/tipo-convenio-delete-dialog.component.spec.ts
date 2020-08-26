import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoConvenioDeleteDialogComponent } from './tipo-convenio-delete-dialog.component';

describe('TipoConvenioDeleteDialogComponent', () => {
  let component: TipoConvenioDeleteDialogComponent;
  let fixture: ComponentFixture<TipoConvenioDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoConvenioDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoConvenioDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
