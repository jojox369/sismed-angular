import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Agenda } from 'src/app/models/agenda';
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

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.component.html',
  styleUrls: ['./agenda-details.component.css'],
})
export class AgendaDetailsComponent implements OnInit {

  faTimes = faTimes;


  faCheck = faCheck;


  faChevronLeft = faChevronLeft;


  faPencilAlt = faPencilAlt;


  faBan = faBan;


  faPlus = faPlus;


  faList = faList;


  medicoId = this.route.snapshot.paramMap.get('medicoId');


  agendamentoId = this.route.snapshot.paramMap.get('agendamentoId');


  agendamento: Agenda;


  medicos: Funcionario[];


  convenios: Convenio[];


  tipos: TipoConvenio[];


  paciente: Paciente;


  procedimentos: Procedimento[];


  formAgenda: FormGroup;


  convenioControl = new FormControl('', Validators.required);


  showFields: boolean;


  isEditing: boolean;

  isLoading: boolean = true;

  horaAgendamento: string;

  loadingDataMessage: string = 'Carregando Dados ...';


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
    console.log(this.formAgenda.value)
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



  buildMessage(message: string, type: number) {

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
