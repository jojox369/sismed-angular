import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-agenda-observacao',
  templateUrl: './agenda-observacao.component.html',
  styleUrls: ['./agenda-observacao.component.css']
})
export class AgendaObservacaoComponent implements OnInit {

  faTimes = faTimes;
  constructor(
    @Inject(MAT_DIALOG_DATA) public observacao: string
  ) { }

  ngOnInit(): void {
  }

}
