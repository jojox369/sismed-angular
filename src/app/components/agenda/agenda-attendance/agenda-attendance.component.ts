import { Component, OnInit, ViewChild } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { Registroclinico } from 'src/app/models/registroclinico';
import { Relatorio } from 'src/app/models/relatorio';
import { ActivatedRoute } from '@angular/router';
import { AgendaService } from 'src/app/services/agenda.service';
import { RegistroclinicoService } from 'src/app/services/registroclinico.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { Agenda, Agendar } from 'src/app/models/agenda';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { TipoConvenioPaciente } from 'src/app/models/tipo-convenio';
import { Funcionario } from 'src/app/models/funcionario';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-agenda-attendance',
  templateUrl: './agenda-attendance.component.html',
  styleUrls: ['./agenda-attendance.component.css']
})
export class AgendaAttendanceComponent implements OnInit {

  // Variavel que recupera o id do medico para consulta
  medicoId = this.route.snapshot.paramMap.get('medicoId');
  // Icone de voltar a pagina
  faChevronLeft = faChevronLeft;

  // Icone do botão de salvar
  faCheck = faCheck;

  paciente: Paciente;

  agendamentos: Agenda[];

  agendamento: Agendar;

  medico: Funcionario;

  registroClinico: Registroclinico

  relatorio: Relatorio

  data_agendamento;

  registroForm: FormGroup;

  relatorioForm: FormGroup;

  hora: string;

  showPacienteDetails = false;

  @ViewChild('formDirective') private formDirective: NgForm;
  constructor(
    private agendaService: AgendaService,
    private registroClinicoService: RegistroclinicoService,
    private relatorioService: RelatorioService,
    private funcionarioService: FuncionarioService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.agendamento = new Agendar();
    this.getAgendamentos();
    this.getMedico();
    this.getHours();

  }

  getAgendamentos() {
    const todayDate = new Date().toLocaleDateString().split('/');
    this.data_agendamento = todayDate[2] + '-' + todayDate[1] + '-' + todayDate[0];

    this.agendaService.getAgendamentos(this.medicoId, this.data_agendamento).subscribe(
      data => {
        this.agendamentos = data;
        this.agendamentos = this.agendamentos.filter(agenda => agenda.finalizado !== 1);
        this.createForms();

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar dados', 1);
      }
    );
  }

  getMedico() {
    this.funcionarioService.getFuncionario(this.medicoId).subscribe(
      data => {
        this.medico = data;

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informações do médico', 1);
      }
    );
  }

  createForms() {
    this.registroClinico = new Registroclinico();
    this.relatorio = new Relatorio();
    this.paciente = new Paciente();
    this.paciente.tipo_convenio = new TipoConvenioPaciente();

    this.registroForm = this.fb.group({
      data: [this.registroClinico.data],
      hora: [this.registroClinico.hora],
      paciente: [this.registroClinico.paciente, Validators.required],
      funcionario: [this.registroClinico.funcionario],
      agendamento: [this.registroClinico.agendamento],
      descricao: [this.registroClinico.descricao, Validators.required],
    });

    this.registroForm.controls.funcionario.setValue(this.medicoId);
    this.registroForm.controls.data.setValue(this.data_agendamento);
    this.registroForm.controls.hora.setValue(this.hora);

    this.relatorioForm = this.fb.group({
      paciente: [this.relatorio.paciente],
      convenio: [this.relatorio.convenio],
      procedimento: [this.relatorio.procedimento],
      valor: [this.relatorio.valor],
      data: [this.relatorio.data],
      hora: [this.relatorio.hora],
      funcionario: [this.relatorio.funcionario],
      agendamento: [this.relatorio.agendamento]
    });
    this.relatorioForm.controls.funcionario.setValue(this.medicoId);
    this.relatorioForm.controls.hora.setValue(this.hora);


  }


  getPacienteDetails() {

    const agendamentoId = this.registroForm.controls.agendamento.value;
    let agendamentoInfo: Agenda;

    this.agendamentos.filter(function (agendamento) {
      if (agendamento.id === agendamentoId) {
        agendamentoInfo = agendamento;
      }

    });



    this.showPacienteDetails = true;

    this.paciente = agendamentoInfo.paciente;


    this.relatorioForm.controls.data.setValue(agendamentoInfo.data);
    this.relatorioForm.controls.procedimento.setValue(agendamentoInfo.procedimento.id);
    this.relatorioForm.controls.valor.setValue(agendamentoInfo.procedimento.valor);
    this.relatorioForm.controls.convenio.setValue(agendamentoInfo.tipo_convenio.convenio.id);
    this.relatorioForm.controls.paciente.setValue(agendamentoInfo.paciente.id);
    this.relatorioForm.controls.agendamento.setValue(agendamentoInfo.id);


    this.registroForm.controls.paciente.setValue(agendamentoInfo.paciente.id);
    this.registroForm.controls.agendamento.setValue(agendamentoInfo.id);



    /* Seta as informações do agendamentos para o mesmo ser atualizado */
    this.agendamento.id = agendamentoInfo.id;
    this.agendamento.data = agendamentoInfo.data;
    this.agendamento.hora = agendamentoInfo.hora;
    this.agendamento.paciente = agendamentoInfo.paciente.id;
    this.agendamento.funcionario = agendamentoInfo.funcionario.id;
    this.agendamento.procedimento = agendamentoInfo.procedimento.id;
    this.agendamento.tipo_convenio = agendamentoInfo.tipo_convenio.id;




  }

  /*

  Envia os dados para o back-end para serem salvos. 
  Salva o registro clinico, cria um novo dado para o relatorio e atualiza o agendamento;
  */
  finishAttendance(frm: FormGroup) {
    this.registroForm.controls.descricao.setValue(this.registroForm.controls.descricao.value.toUpperCase());
    this.registroClinicoService.saveRegistroClinico(this.registroForm.value).subscribe(
      data => {
        this.relatorioService.saveReport(this.relatorioForm.value).subscribe(
          data => {
            this.agendamento.finalizado = 1;
            this.agendaService.updateAgendamento(this.agendamento).subscribe(
              data => {
                this.buildMessage('Atendimento finalizado com sucesso', 0);

                this.updateList();


              },
              error => {
                console.log(error);
                this.buildMessage('Erro ao tentar atualizar as informações do agendamento', 1);
              }
            )
          },
          error => {
            console.log(error);
            this.buildMessage('Erro ao tentar salvar a finalização do atendimento', 1);
          }
        );
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar salvar o registro clinico', 1);
      }
    );

  }

  /* Atualiza a lista de pacientes vista no select */
  updateList() {
    this.getAgendamentos();
    this.registroForm.controls.agendamento.reset();
    this.registroForm.controls.descricao.reset();
    this.formDirective.resetForm();
    this.showPacienteDetails = false;
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  getHours() {
    const todayDate = new Date();
    let hora;
    let minutos;
    if (todayDate.getHours() < 10) {
      hora = '0' + todayDate.getHours();
    } else {
      hora = todayDate.getHours();
    }
    if (todayDate.getMinutes() < 10) {
      minutos = '0' + todayDate.getMinutes();
    } else {
      minutos = todayDate.getMinutes();
    }
    this.hora = hora + ':' + minutos;



  }



  // monta a mensagem que vai ser exibida na pagina
  buildMessage(message: string, type: number) {
    // configurações da mensagem de confirmação
    let snackbarConfig: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    }

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
