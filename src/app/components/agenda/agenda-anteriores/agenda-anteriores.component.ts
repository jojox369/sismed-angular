import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AgendaService } from 'src/app/services/agenda.service';
import { MatTableDataSource } from '@angular/material/table';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-agenda-anteriores',
  templateUrl: './agenda-anteriores.component.html',
  styleUrls: ['./agenda-anteriores.component.css']
})
export class AgendaAnterioresComponent implements OnInit {

  faTimes = faTimes;

  // Variavel de controle da tabela para a exibição de dados
  isAgendaNotEmpty = true;

  // Variavel que recebe todos os agendament anteriores do paciente
  agendamentAnteriores;

  // Variavel que controla a mensagem de erro 
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  // Controla a progress spiner e a aparição da lista
  isLoading = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['medico', 'especialidade', 'data', 'hora', 'primeira_vez', 'compareceu', 'observacao'];


  constructor(
    @Inject(MAT_DIALOG_DATA) public pacienteId: number,
    private agendaService: AgendaService
  ) { }

  ngOnInit(): void {
    this.getagendamentAnteriores();
  }


  // Metodo para pegar os agendament anteriores do paciente
  getagendamentAnteriores() {
    this.agendaService.anteriores(this.pacienteId).subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.isAgendaNotEmpty = false;
          this.isLoading = false;
          this.showEmptyMessage = true;
          this.agendamentAnteriores = data;
          this.buildTable();
        } else {
          this.isLoading = false;
          this.agendamentAnteriores = data;
          this.convertTime();
          this.buildTable();
        }

      }
    );
  }

  // monta a lista de convenio
  buildTable() {

    this.dataSource = new MatTableDataSource(this.agendamentAnteriores);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  // Metodo para formatar a hora do agendamento
  convertTime() {
    for (const agendamento of this.agendamentAnteriores) {
      const hora = agendamento.hora.split(':', 2);
      agendamento.hora = hora[0] + ':' + hora[1];
    }
  }


  openObservacaoDialog(observacao: string) {

  }

}
