import { Component, OnInit } from '@angular/core';
import { Agendar } from 'src/app/models/agenda';
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { PacientePost } from 'src/app/models/paciente';
import { Funcionario } from 'src/app/models/funcionario';
import { Convenio } from 'src/app/models/convenio';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { Procedimento } from 'src/app/models/procedimento';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ProcedimentoService } from 'src/app/services/procedimento.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { FuncionarioTipoConvenioService } from 'src/app/services/funcionario-tipo-convenio.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Endereco } from 'src/app/models/endereco';

@Component({
  selector: 'app-agenda-pre-register',
  templateUrl: './agenda-pre-register.component.html',
  styleUrls: ['./agenda-pre-register.component.css'],
})
export class AgendaPreRegisterComponent implements OnInit {
  // Icone de voltar a pagina
  faChevronLeft = faChevronLeft;

  // Icone do botão de salvar
  faCheck = faCheck;

  // Variavel que vai receber os dados
  paciente: PacientePost;

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

  // recebe os dados do formulario
  formPaciente: FormGroup;

  // Recebe o id do convenio selecionado
  convenio = new FormControl('', Validators.required);

  disableButton = true;

  // Variavel que recebe os detalhes do funcionario
  medicoDetail = {
    crm: undefined,
    especialidade: undefined,
  };

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
    this.getProntuario();
    this.createForm();
    this.getMedicos();
  }

  createForm() {
    this.paciente = new PacientePost();
    this.paciente.endereco = new Endereco();
    this.agendamento = new Agendar();
    this.formAgenda = this.fb.group({
      data: [this.agendamento.data, Validators.required],
      hora: [this.agendamento.hora, Validators.required],
      paciente: [this.agendamento.paciente],
      funcionario: [this.agendamento.funcionario, Validators.required],
      procedimento: [this.agendamento.procedimento, Validators.required],
      tipoConvenio: [this.agendamento.tipoConvenio, Validators.required],
      pagou: [this.agendamento.pagou],
      primeiVez: [this.agendamento.primeiraVez],
      compareceu: [this.agendamento.compareceu],

    });

    this.formPaciente = this.fb.group({
      prontuario: [this.paciente.prontuario, Validators.required],
      nome: [this.paciente.nome, Validators.required],
      cpf: [this.paciente.cpf, Validators.required],
      rg: [this.paciente.rg],
      dataNascimento: [this.paciente.dataNascimento],
      celular: [this.paciente.celular, Validators.required],
      tipoConvenioId: [this.paciente.tipoConvenio],

      endereco: this.fb.group({
        cep: [this.paciente.endereco.cep, Validators.required],
        logradouro: [this.paciente.endereco.logradouro, Validators.required],
        numero: [this.paciente.endereco.numero, Validators.required],
        complemento: [this.paciente.endereco.complemento],
        bairro: [this.paciente.endereco.bairro, Validators.required],
        cidade: [this.paciente.endereco.cidade, Validators.required],
        estado: [this.paciente.endereco.estado, Validators.required],
      }),
    });

    this.formAgenda.controls.compareceu.setValue(1);
    this.formAgenda.controls.pagou.setValue(1);
    this.formAgenda.controls.primeiVez.setValue(1);
    this.formAgenda.controls.tipoConvenio.disable();
    this.formAgenda.controls.procedimento.disable();
    this.formAgenda.controls.data.disable();
    this.formAgenda.controls.hora.disable();
    this.convenio.disable();
    this.formPaciente.controls.prontuario.disable();
  }

  // Metodo para pegar a lista de medicos
  getMedicos() {
    this.funcionarioService.getMedicos().subscribe(
      (data) => {
        this.medicos = data;
        this.isLoading = false;
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
    this.loadingDataMessage = 'Agendando paciente';

    this.formPaciente.controls.tipoConvenioId.setValue(
      this.formAgenda.controls.tipoConvenio.value
    );
    this.formPaciente.controls.nome.setValue(
      this.formPaciente.controls.nome.value.toUpperCase()
    );
    this.formAgenda.controls.paciente.setValue(+this.formPaciente.controls.prontuario.value)


    this.agendaService.agendamentoPreCadastro({ agenda: this.formAgenda.value, paciente: this.formPaciente.value }).subscribe(
      (data) => {
        this.agendaService.message =
          'Paciente agendado para ' +
          this.formatDateTime(data.data, data.hora);

        this.router.navigate(['/agenda']);
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 409) {

          this.buildMessage('Médico já possui agendamento para esse dia e horário', 1);
        } else {
          this.buildMessage('Erro ao tentar salvar o agendamento', 1);

        }

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

  getProntuario() {
    this.pacienteService.nextProntuario().subscribe(
      (data) => {
        this.formPaciente.controls.prontuario.setValue(data.proximoProntuario);
      },
      (error) => {

      }
    );
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  // Varificação de caractere
  onlyLetters(event) {
    if (
      event.charCode == 32 || // espaço
      (event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      (event.charCode > 191 && event.charCode <= 255) // letras com acentos
    ) {
      return true;
    } else {
      this.buildMessage('Insira apenas letras', 1);
      return false;
    }
  }
}
