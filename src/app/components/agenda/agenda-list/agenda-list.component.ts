import { Component, OnInit, ViewChild } from '@angular/core';
import {
  faPencilAlt,
  faSearch,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { AgendaService } from 'src/app/services/agenda.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { Funcionario } from 'src/app/models/funcionario';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Agenda } from 'src/app/models/agenda';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { AgendaObservacaoComponent } from '../agenda-observacao/agenda-observacao.component';
import { AgendaAnterioresComponent } from '../agenda-anteriores/agenda-anteriores.component';
import { CompareDates } from 'src/app/function';
@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.css'],
})
export class AgendaListComponent implements OnInit {
  // Icone de iniciar atendimento
  faPencilAlt = faPencilAlt;

  // Icone de pesquisa
  faSearch = faSearch;

  // Icone de novo agendamento
  faPlus = faPlus;

  // Variavel que recebe o numero do perfil do funcionario logado
  funcionarioPerfil: number;

  // Variavel que guarda o id do medico
  medicoId: number;

  // Guarda o nome do medico
  medicoName: string;

  // Variavel que recebe o id do medico selecionado no combo box
  selectedMedicoId: number;

  // Variavel que recebe o array com todos os medicos
  medicos: Funcionario[];

  // Varivael que recebe o array com todos os agendamentos do medico
  agendamentos: Agenda[];

  // Variavel que controla a mensagem de erro
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  // Controla a progress spiner e a aparição da lista
  isLoading = true;

  // Variavel de controle da tabela para a exibição de dados
  isAgendaNotEmpty = true;

  // Variavel que controla a edição de um agendamento
  editable = false;

  // Recede a data atual para ser exebida no input. Também serve para fazer a pesquisa por data;
  data_agendamento;

  user = JSON.parse(sessionStorage.getItem('user'));

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = [
    'prontuario',
    'nome',
    'telefone',
    'celular',
    'hora',
    'convenio',
    'primeira_vez',
    'compareceu',
    'pagou',
    'idade',
    'observacao',
  ];

  constructor(
    private agendaservice: AgendaService,
    private funcionarioService: FuncionarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.verifyEmployee();
    this.verifyMessage();
  }

  // verificação pra saber qual usuario esta logado
  verifyEmployee() {
    const todayDate = new Date().toLocaleDateString().split('/');
    this.data_agendamento =
      todayDate[2] + '-' + todayDate[1] + '-' + todayDate[0];
    this.funcionarioPerfil = this.user.perfil;
    /*
      caso seja medico ou administrador, chama o metodo direto
    */
    if (this.funcionarioPerfil !== 2) {
      this.getAllAgendamentos();
      this.medicoName = this.user.nome;
    } else {
      /*Caso não seja medico nem administrador, fica aguardando um medico ser selecionado
    no combo box para poder pegar o id e passar para a função para retornar todos os agendamentos */
      this.isLoading = false;
      this.isAgendaNotEmpty = false;
      this.funcionarioService.getMedicos().subscribe(
        (data) => {
          this.medicos = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  // Função para pegar todos os agendamentos do medico;
  getAllAgendamentos() {
    /*Verificação pra saber da onde pegar o id para realizar a consulta */
    if (this.funcionarioPerfil !== 2) {
      this.medicoId = this.user.id;
    } else {
      this.medicoId = this.selectedMedicoId;
    }
    this.agendaservice
      .getAgendamentos(this.medicoId, this.data_agendamento)
      .subscribe(
        (data) => {
          if (Object.keys(data).length === 0) {
            this.isAgendaNotEmpty = false;
            this.isLoading = false;
            this.showEmptyMessage = true;
            this.agendamentos = data;
            this.buildTable();
          } else {
            this.isLoading = false;
            this.agendamentos = data;
            this.convertTime();
            this.buildTable();
            this.editable = CompareDates(this.agendamentos[0].data.toString());
          }
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar recuperar dados', 1);
        }
      );
  }

  // Metodo que é chamado quando um medico é selecionado no select
  selectedDoctor() {
    this.showEmptyMessage = false;
    this.getAllAgendamentos();
  }

  // Metodo que e chamado quando o botão de pesquisa é clicado
  getAgendamentoByDate() {
    this.showEmptyMessage = false;
    this.getAllAgendamentos();
  }

  // Metodo para formatar a hora do agendamento
  convertTime() {
    for (const agendamento of this.agendamentos) {
      const hora = agendamento.hora.split(':', 2);
      agendamento.hora = hora[0] + ':' + hora[1];
    }
  }

  // monta a lista de convenio
  buildTable() {
    this.dataSource = new MatTableDataSource(this.agendamentos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  // abre o dialogo para um novo agendamento
  newAgendamento() {
    let dialogRef = this.dialog.open(SearchDialogComponent, {
      height: '400px',
      width: '600px',
    });
  }

  // abre o dialogo de observação do agendamento
  openObservacaoDialog(observacao: string) {
    const dialogRef = this.dialog.open(AgendaObservacaoComponent, {
      height: '350px',
      width: '500px',
      data: observacao,
    });
  }

  // abre o dialogo de agendamentos anteriores do paciente
  openAgendamentosAnteriosDialog(pacienteId: number) {
    const dialogRef = this.dialog.open(AgendaAnterioresComponent, {
      height: '500px',
      width: '9000px',
      data: pacienteId,
    });
  }

  // Metodo para calcular a idade do paciente
  pacienteIdade(dataNascimento: string): string {
    const todayDate = new Date();
    const todayArray = todayDate.toLocaleDateString().split('/');
    const nascimentoArray = dataNascimento.split('-');

    // Informações sobre a data atual
    const todayYear = Number(todayArray[2]);
    const todayMonth = Number(todayArray[1]);
    const todayDay = Number(todayArray[0]);

    // Informações da data de nascimento do paciente
    const yearNascimento = Number(nascimentoArray[0]);
    const monthNascimento = Number(nascimentoArray[1]);
    const dayNascimento = Number(nascimentoArray[2]);

    let idade = todayYear - yearNascimento;

    /*Caso o mes atual seja menor que o mes do nascimento
      aniversario ainda não passou
    */
    if (todayMonth < monthNascimento) {
      idade--;
    }
    // Esta no mes do aniversario
    else if (todayMonth === monthNascimento) {
      /*Caso o dia atual seja menor que o dia do nascimento
        aniversario ainda não passou
      */
      if (todayDay < dayNascimento) {
        idade--;
      }
    }

    return idade + ' ANOS';
  }

  // Verifica no service se existe alguma mensagem para ser mostrada
  verifyMessage() {
    if (this.agendaservice.message !== undefined) {
      this.buildMessage(this.agendaservice.message, 0);
      setTimeout(() => {
        this.agendaservice.message = undefined;
      }, 5000);
    }
  }

  // monta a mensagem que vai ser exibida na pagina
  buildMessage(message: string, type: number) {
    // configurações da mensagem de confirmação
    let snackbarConfig: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };

    /*
      type = 0: Mensagem de sucesso
      type = 1: Mensagem de erro
      type = 3: Mensagem de warning
    */

    if (type === 0) {
      snackbarConfig.panelClass = 'success-snackbar';
    } else if (type === 1) {
      snackbarConfig.panelClass = 'danger-snackbar';
    } else {
      snackbarConfig.panelClass = 'warning-snackbar';
    }
    this.snackBar.open(message, undefined, snackbarConfig);
  }
}
