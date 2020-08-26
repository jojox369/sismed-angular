import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaObservacaoComponent } from './agenda-observacao.component';

describe('AgendaObservacaoComponent', () => {
  let component: AgendaObservacaoComponent;
  let fixture: ComponentFixture<AgendaObservacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaObservacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaObservacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
