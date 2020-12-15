import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Agenda, Agendar } from 'src/app/models/agenda';
import { Funcionario } from 'src/app/models/funcionario';
import { Convenio } from 'src/app/models/convenio';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { Procedimento } from 'src/app/models/procedimento';
import { AgendaService } from 'src/app/services/agenda.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { FuncionarioTipoConvenioService } from 'src/app/services/funcionario-tipo-convenio.service';
import { ProcedimentoService } from 'src/app/services/procedimento.service';
import {
  faChevronLeft,
  faCheck,
  faTimes,
  faPencilAlt,
  faBan,
  faPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { LogService } from 'src/app/services/log.service';
import { CompareDates } from 'src/app/function';
import { LogSave } from 'src/app/models/log';

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.component.html',
  styleUrls: ['./agenda-details.component.css'],
})
export class AgendaDetailsComponent implements OnInit {
  // Icone de exluir
  faTimes = faTimes;

  // Icone de salvar
  faCheck = faCheck;

  // Icone de voltar
  faChevronLeft = faChevronLeft;

  // Icone de editar
  faPencilAlt = faPencilAlt;

  // Icone de cancelar edição
  faBan = faBan;

  // Icone de adicionar
  faPlus = faPlus;

  // Icone de listar
  faList = faList;

  // Variavel que recupera o id do medico da url
  medicoId = this.route.snapshot.paramMap.get('medicoId');

  // Variavel que recupera o id do agendamento da url
  agendamentoId = this.route.snapshot.paramMap.get('agendamentoId');

  // Variavel que recebe os dados do agendamento
  agendamento: Agenda;

  // variavel que recebe a lista de medicos
  medicos: Funcionario[];

  // Variavel que recebe todos os convenios aceitos pelo medico
  convenios: Convenio[];

  // Variavel que recebe todos os tipos de convenio aceitos pelo medico
  tipos: TipoConvenio[];

  // Receve as informações do paciente
  paciente: Paciente;

  // Variavel que recebe todos os procedimentos de um convenio
  procedimentos: Procedimento[];

  // recebe os dados do formulario
  formAgenda: FormGroup;

  // Recebe o id do convenio selecionado
  convenioControl = new FormControl('', Validators.required);

  // Controla a exibição das informações do paciente
  showFields: boolean;

  // Controla a edição do formulário
  isEditing: boolean;

  isLoading: boolean = true;

  horaAgendamento: string;

  loadingDataMessage: string = 'Carregando Dados ...';

  // Guarda a data do baco de dados para verificação na hora da edição
  dataAgendamento;



  user = JSON.parse(sessionStorage.getItem('user'));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private agendaService: AgendaService,
    private funcionarioService: FuncionarioService,
    private convenioService: ConvenioService,
    private tipoConvenioService: TipoConvenioService,
    private funcionarioTipoConvenioService: FuncionarioTipoConvenioService,
    private procedimentoService: ProcedimentoService,
    private pacienteService: PacienteService,
    private dialog: MatDialog,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.getAgendamento();
    this.getTime();
  }

  createForm() {
    this.formAgenda = this.fb.group({
      id: [this.agendamento.id],
      data: [this.agendamento.data, Validators.required],
      hora: [this.agendamento.hora, Validators.required],
      paciente: [this.agendamento.paciente.prontuario],
      funcionario: [this.agendamento.funcionario.id, Validators.required],
      procedimento: [this.agendamento.procedimento.id, Validators.required],
      tipoConvenio: [this.agendamento.tipoConvenio.id, Validators.required],
      pagou: [this.agendamento.pagou],
      primeiraVez: [this.agendamento.primeiraVez],
      compareceu: [this.agendamento.compareceu],
      observacao: [this.agendamento.observacao],
    });
    this.formAgenda.disable();
    this.convenioControl.disable();
    this.getMedicos();
    this.getConvenios();
    this.getTiposConvenio();
    this.getProcedimentos();

    this.getMedicoDetails();
  }

  // Metodo para pegar as informações do agendamento
  getAgendamento() {
    this.agendaService
      .getAgendamento(this.agendamentoId)
      .subscribe(
        (data) => {
          this.agendamento = data;
          this.convenioControl.setValue(data.tipoConvenio.convenio.id);

          this.paciente = data.paciente;

          this.horaAgendamento = this.agendamento.hora;
          this.dataAgendamento = this.agendamento.data;
          if (CompareDates(this.agendamento.data.toString())) {
            this.createForm();
          } else {
            this.router.navigate(['/notfound']);
          }
        },
        (error) => {
          this.buildMessage(
            'Erro ao carregar as informações do agendamento',
            1
          );
          this.router.navigate(['/error']);
        }
      );
  }

  // Metodo para pegar a lista de medicos
  getMedicos() {
    this.funcionarioService.getMedicos().subscribe(
      (data) => {
        this.medicos = data;
      },
      (error) => {
        this.buildMessage('Erro ao tentar recuperar a lista de médicos', 1);
      }
    );
  }

  // Metodo para pegar os convenios aceitos pelo medico
  getConvenios() {
    this.funcionarioTipoConvenioService
      .getAcceptedConvenios(this.formAgenda.controls.funcionario.value)
      .subscribe(
        (data) => {
          this.convenios = data;
        },
        (error) => {
          this.buildMessage(
            'Erro ao tentar recuperar a lista de convenios aceitos pelo médico',
            1
          );
        }
      );
  }




  // Metodo para pegar os detalhes do medico selecionado
  getMedicoDetails() {
    this.getConvenios();

    this.funcionarioService
      .getFuncionario(this.formAgenda.value.funcionario)
      .subscribe(
        (data) => {
          this.agendamento.funcionario = data;
          this.isLoading = false;
        },
        (error) => {
          this.buildMessage(
            'Erro ao tentar recuperar as informações do médico',
            1
          );
        }
      );
  }

  // Metodo que pega todos os tipos de convenio aceitos pelo medico
  getTiposConvenio() {
    this.funcionarioTipoConvenioService
      .getAcceptedTipos(
        this.formAgenda.controls.funcionario.value,
        this.convenioControl.value
      )
      .subscribe(
        (data) => {
          this.tipos = data;
        },
        (error) => { }
      );
  }

  // Metodo que pega todos os procedimentos a partir de um convenio
  getProcedimentos() {
    this.procedimentoService.getAll(this.convenioControl.value).subscribe(
      (data) => {
        this.procedimentos = data;
      },
      (error) => { }
    );
  }

  /*Função para liberar os campos para edição */
  unblockFields() {
    this.formAgenda.enable();
    this.isEditing = true;
    this.convenioControl.enable();
  }

  // função para bloquear os campos de edição
  cancelEditing() {
    this.isEditing = false;
    this.convenioControl.disable();
    this.formAgenda.disable();
    this.getAgendamento();
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  getTime(): string {
    const time = new Date().toLocaleTimeString().split(':', 2);

    return time[0] + ':' + time[1];
  }

  getDate(): string {
    const todayDate = new Date().toLocaleDateString().split('/');
    return todayDate[2] + '-' + todayDate[1] + '-' + todayDate[0];
  }

  formatDate(date: string): string {
    const arrayDate = date.split('-');
    return arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0];
  }

  save() {
    this.isLoading = true;
    this.loadingDataMessage = 'Agendando paciente';
    if (this.formAgenda.controls.observacao.value !== null) {
      this.formAgenda.controls.observacao.setValue(
        this.formAgenda.controls.observacao.value.toUpperCase()
      );
    }
    this.agendaService.updateAgendamento(this.formAgenda.value).subscribe(
      (data) => {
        this.buildMessage(
          'Informações do agendamento atualizadas com sucesso!',
          0
        );
        this.isEditing = false;
        this.isLoading = false;
        this.convenioControl.disable();
        this.formAgenda.disable();
        /* if (this.formAgenda.controls.data.value !== this.dataAgendamento) {
          let logSave = new LogSave();
          logSave.data = this.getDate();
          logSave.hora = this.getTime();
          logSave.funcionario = this.user.id;
          logSave.evento = 'EDIÇÃO';
          logSave.descricao =
            'ALTERAÇÃO NA DATA DO AGENDAMENTO DO PACIENTE ' +
            this.paciente.nome +
            '. Do dia: ' +
            this.formatDate(this.dataAgendamento) +
            ' para o dia: ' +
            this.formatDate(this.formAgenda.controls.data.value);
          this.logService.save(logSave).subscribe(
            (data) => { },
            (error) => {
              this.buildMessage('erro ao tentar salvar registro de evento', 1);
            }
          );
        } */


      },
      (error) => {
        if (error.status === 409) {
          this.buildMessage(
            'Médico já possui agendamento para essa data e hora',
            1
          );
          this.isLoading = false;
        } else {
          this.buildMessage('Erro ao tentar salvar as informações', 1);
          this.isLoading = false;
        }

      }
    );
  }

  delete() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this.isLoading = true;
        this.loadingDataMessage = 'Excluindo agendamento';
        this.agendaService.deleteAgendamento(this.agendamento.id).subscribe(
          (data) => {
            this.agendaService.message = 'Agendamento Excluído Com Sucesso!';
            this.router.navigate(['/agenda']);
          },
          (error) => {
            this.isLoading = false;
            this.buildMessage('Erro ao tentar excluir o agendamento', 1);
          }
        );
      }
    });
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
