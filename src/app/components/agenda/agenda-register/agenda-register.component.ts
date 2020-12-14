import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Paciente } from 'src/app/models/paciente';
import { Funcionario } from 'src/app/models/funcionario';
import { Convenio } from 'src/app/models/convenio';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { Procedimento } from 'src/app/models/procedimento';
import { Agendar } from 'src/app/models/agenda';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';
import { ProcedimentoService } from 'src/app/services/procedimento.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { FuncionarioTipoConvenioService } from 'src/app/services/funcionario-tipo-convenio.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AgendaService } from 'src/app/services/agenda.service';
@Component({
  selector: 'app-agenda-register',
  templateUrl: './agenda-register.component.html',
  styleUrls: ['./agenda-register.component.css'],
})
export class AgendaRegisterComponent implements OnInit {
  // Variavel que recupera o id do paciente para consulta
  prontuario = this.route.snapshot.paramMap.get('prontuario');

  // Icone de voltar a pagina
  faChevronLeft = faChevronLeft;

  // Icone do botão de salvar
  faCheck = faCheck;

  // Variavel que vai receber os dados
  paciente: Paciente;

  // variavel que recebe a lista de medicos
  medicos: Funcionario[];

  // Variavel que recebe todos os convenios aceitos pelo medico
  convenios: Convenio[];

  // Variavel que recebe todos os tipos de convenio aceitos pelo medico
  tipos: TipoConvenio[];

  // Variavel que recebe todos os procedimentos de um convenio
  procedimentos: Procedimento[];

  // Variavel que recebe todos os dados do agendamentos para enviar para o django para ser salva
  agendamento: Agendar;

  // recebe os dados do formulario
  formAgenda: FormGroup;

  // Variavel que recebe os detalhes do funcionario
  medicoDetail = {
    crm: undefined,
    especialidade: undefined,
  };

  // Recebe o id do convenio selecionado
  convenio = new FormControl('', Validators.required);

  showContent = false;

  loadingDataMessage: string = 'Carregando Dados ...';

  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agendaService: AgendaService,
    private pacienteService: PacienteService,
    private procedimentoService: ProcedimentoService,
    private funcionarioService: FuncionarioService,
    private funcionarioTipoConvenioService: FuncionarioTipoConvenioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.createForm();
    this.getPaciente();
    this.getMedicos();
  }

  createForm() {
    this.agendamento = new Agendar();
    this.formAgenda = this.fb.group({
      data: [this.agendamento.data, Validators.required],
      hora: [this.agendamento.hora, Validators.required],
      paciente: [this.agendamento.paciente],
      funcionario: [this.agendamento.funcionario, Validators.required],
      procedimento: [this.agendamento.procedimento, Validators.required],
      tipoConvenio: [this.agendamento.tipoConvenio, Validators.required],
      pagou: [this.agendamento.pagou],
      primeira_vez: [this.agendamento.primeira_vez],
      compareceu: [this.agendamento.primeira_vez],
    });

    this.formAgenda.controls.compareceu.setValue(1);
    this.formAgenda.controls.pagou.setValue(1);
    this.formAgenda.controls.tipoConvenio.disable();
    this.formAgenda.controls.procedimento.disable();
    this.formAgenda.controls.data.disable();
    this.formAgenda.controls.hora.disable();
    this.convenio.disable();
  }

  // Metodo para pegar as informações do paciente
  getPaciente() {
    this.pacienteService.getPaciente(this.prontuario).subscribe(
      (data) => {
        console.log(data)
        this.paciente = data;
        this.formAgenda.controls.paciente.setValue(this.paciente.prontuario);
        this.showContent = true;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;

        this.buildMessage(
          'Erro ao tentar recuperar as informações do paciente',
          1
        );
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

  // Metodo para pegar os detalhes do medico selecionado
  getMedicoDetails() {
    this.getConvenios();
    this.funcionarioService
      .getFuncionario(this.formAgenda.value.funcionario)
      .subscribe(
        (data) => {

          this.medicoDetail = {
            crm: data.crm,
            especialidade: data.especialidade,
          };
        },
        (error) => {

          this.buildMessage(
            'Erro ao tentar recuperar as informações do médico',
            1
          );
        }
      );
  }

  // Metodo para pegar os convenios aceitos pelo medico
  getConvenios() {
    this.funcionarioTipoConvenioService
      .getAcceptedConvenios(this.formAgenda.value.funcionario)
      .subscribe(
        (data) => {
          this.convenios = data;
          this.convenio.enable();
        },
        (error) => {

          this.buildMessage(
            'Erro ao tentar recuperar a lista de convenios aceitos pelo médico',
            1
          );
        }
      );
  }

  // Metodo que pega todos os tipos de convenio aceitos pelo medico
  getTiposConvenio() {
    this.funcionarioTipoConvenioService
      .getAcceptedTipos(this.formAgenda.value.funcionario, this.convenio.value)
      .subscribe(
        (data) => {
          this.tipos = data;
          this.formAgenda.controls.tipoConvenio.enable();
        },
        (error) => {

          this.buildMessage(
            'Erro ao tentar recuperar a lista de planos aceitos pelo médico',
            1
          );
        }
      );
  }

  // Metodo que pega todos os procedimentos a partir de um convenio
  getProcedimentos() {
    this.procedimentoService.getAll(this.convenio.value).subscribe(
      (data) => {
        this.procedimentos = data;
        this.formAgenda.controls.procedimento.enable();
      },
      (error) => {

        this.buildMessage(
          'Erro ao tentar recuperar a lista de procedimentos do convenio',
          1
        );
      }
    );
  }

  // habilita os campos de data e hora para serem preenchidos
  enableDateTimefields() {
    this.formAgenda.controls.data.enable();
    this.formAgenda.controls.hora.enable();
  }

  save() {
    this.isLoading = true;

    this.loadingDataMessage = 'Agendando paciente';
    this.agendaService.lastAgendamento(this.paciente.prontuario).subscribe(
      (data) => {


        if (data) {
          this.formAgenda.controls.primeira_vez.setValue(0);

        } else {
          this.formAgenda.controls.primeira_vez.setValue(1);

        }
        this.agendaService.agendar(this.formAgenda.value).subscribe(
          (data) => {
            this.agendaService.message =
              'Paciente agendado para ' +
              this.formatDateTime(data.data, data.hora);
            this.router.navigate(['/agenda']);
          },
          (error) => {

            if (error.status === 409) {
              this.buildMessage(
                'Médico já possui agendamento para essa data e hora',
                1
              );
              this.isLoading = false;
            } else {
              this.buildMessage('Erro ao tentar salvar o agendamento', 1);
              this.isLoading = false;
            }

          }

        );
      });
  }

  // Verifica se o medico ja possui agendamento para o dia e hora selecionados;
  verifyAgendamento(frm: FormGroup) {
    this.isLoading = true;
    this.loadingDataMessage = 'Verificando disponibilidade do médico';
    this.agendaService
      .verifyAgendamento(
        this.formAgenda.controls.data.value,
        this.formAgenda.controls.hora.value,
        this.formAgenda.controls.funcionario.value
      )
      .subscribe(
        (data) => {
          if (Object.keys(data).length == 0) {
            this.save();
          } else {
            this.buildMessage(
              'Médico já possui agendamento para essa data e hora',
              1
            );
            this.isLoading = false;
          }
        },
        (error) => {

          this.buildMessage('Erro ao verificar a disponibilidade do médico', 1);
        }
      );
  }

  // formata a data e a hora do agendamento e forma uma string para a mensagem de sucesso no agendamento
  formatDateTime(date: string, time: string): string {
    const arrayDate = date.split('-');
    const arrayTime = time.split(':', 2);
    const dateFormat = arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0];
    const timeFormat = arrayTime[0] + ':' + arrayTime[1];
    const message = dateFormat + ' as ' + timeFormat;
    return message;
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
