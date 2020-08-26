import { Component, OnInit } from '@angular/core';
import { faTimes, faCheck, faChevronLeft, faPencilAlt, faBan, faPlus, faList } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/services/paciente.service';
import { ExameService } from 'src/app/services/exame.service';
import { LaboratorioService } from 'src/app/services/laboratorio.service';
import { LaboratorioTipoConvenioService } from 'src/app/services/laboratorio-tipo-convenio.service';
import { Paciente } from 'src/app/models/paciente';
import { Laboratorio } from 'src/app/models/laboratorio';
import { TipoConvenioPaciente } from 'src/app/models/tipo-convenio';
import { ExameDetail } from 'src/app/models/exame';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { LogSave } from 'src/app/models/log';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-exame-details',
  templateUrl: './exame-details.component.html',
  styleUrls: ['./exame-details.component.css']
})
export class ExameDetailsComponent implements OnInit {

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

  /*Recupera o id do convenio para realizar a requisição a API */
  exameId = this.route.snapshot.paramMap.get('exameId');

  // Controla a edição do formulário
  isEditing = false;

  exameForm: FormGroup;

  pacientes: Paciente[];

  paciente: Paciente;

  laboratorios: Laboratorio[];

  laboratorio: Laboratorio;

  laboratorioTipos: TipoConvenioPaciente[];

  exame: ExameDetail;

  user = JSON.parse(sessionStorage.getItem('user'));

  dataColeta;
  dataEnvio;
  dataRetorno;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private exameService: ExameService,
    private laboratorioService: LaboratorioService,
    private laboratorioTipoConvenioService: LaboratorioTipoConvenioService,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.paciente = new Paciente;
    this.laboratorio = new Laboratorio;
    this.getExame();
  }

  getExame() {
    this.exameService.getById(this.exameId).subscribe(
      data => {
        this.exame = data;
        this.createForm();
        this.getPacienteDetails();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informações do exame', 1);
      }
    );
  }

  createForm() {


    this.exameForm = this.fb.group({
      id: [this.exame.id],
      nome: [this.exame.nome, Validators.required],
      descricao: [this.exame.descricao, Validators.required],
      data_coleta: [this.exame.data_coleta, Validators.required],
      data_envio: [this.exame.data_envio, Validators.required],
      data_retorno: [this.exame.data_retorno],
      funcionario_laboratorio: [this.exame.funcionario_laboratorio, Validators.required],
      funcionario: [this.exame.funcionario],
      valor: [this.exame.valor, Validators.required],
      tipo_convenio: [this.exame.tipo_convenio, Validators.required],
      paciente: [this.exame.paciente, Validators.required],
      laboratorio: [this.exame.laboratorio, Validators.required]
    });
    this.exameForm.controls.funcionario.setValue(this.user.id);
    this.exameForm.disable();
    this.dataColeta = this.exameForm.controls.data_coleta.value;
    this.dataEnvio = this.exameForm.controls.data_envio.value;
    this.dataRetorno = this.exameForm.controls.data_retorno.value;

  }



  getPacienteDetails() {
    this.pacienteService.getPacienteDetails(this.exameForm.controls.paciente.value).subscribe(
      data => {
        this.paciente = data[0];
        this.getLaboratorios();

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informações do paciente', 1);
      }
    );
  }

  getLaboratorios() {
    this.laboratorioService.getByTipoConvenio(this.paciente.tipo_convenio.id).subscribe(
      data => {
        this.laboratorios = data;
        this.getLaboratorioDetails();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informações do laboratório', 1);
      }
    );
  }

  getLaboratorioDetails() {
    this.laboratorioService.getById(this.exameForm.controls.laboratorio.value).subscribe(
      data => {
        this.laboratorio = data;

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informaçõs do laboratório', 1);
      }
    );

    this.laboratorioTipoConvenioService.getAcceptedConveniosTipos(this.exameForm.controls.laboratorio.value).subscribe(
      data => {
        this.laboratorioTipos = data.filter(tipo => tipo.id === 1 || tipo.id === this.paciente.tipo_convenio.id);

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar a lista de convenios aceitos pelo laboratório', 1);
      }
    )
  }
  getDate(): string {
    const todayDate = new Date().toLocaleDateString().split('/');
    return todayDate[2] + '-' + todayDate[1] + '-' + todayDate[0];
  }



  formatDate(date: string): string {
    const arrayDate = date.split('-');
    return arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0];
  }

  update() {
    let log = new LogSave();

    if (this.exameForm.controls.data_retorno.value !== null) {
      if (this.dataRetorno !== null && this.exameForm.controls.data_retorno.value !== this.dataRetorno) {
        log.data = this.getDate();
        log.hora = new Date().toLocaleTimeString();
        log.funcionario = this.user.id;
        log.evento = 'EDIÇÃO';
        log.descricao = 'ALTERAÇÃO NA DATA DE RETORNO DO EXAME ' + this.exame.nome + ' DO PACIÊNTE ' + this.paciente.nome + '. DA DATA ' +
          this.formatDate(this.dataRetorno) + ' PARA A DATA ' + this.formatDate(this.exameForm.controls.data_retorno.value);
        this.logService.save(log).subscribe(

          error => {
            this.buildMessage('erro ao tentar salvar registro de evento', 1);
          }
        );
      } else if (this.dataRetorno === null) {
        log.data = this.getDate();
        log.hora = new Date().toLocaleTimeString();
        log.funcionario = this.user.id;
        log.evento = 'EDIÇÃO';
        log.descricao = 'ALTERAÇÃO NA DATA DE RETORNO DO EXAME ' + this.exame.nome + ' DO PACIÊNTE ' + this.paciente.nome + '. DE RETORNO PENDENTE'
          + ' PARA A DATA ' + this.formatDate(this.exameForm.controls.data_retorno.value);
        this.logService.save(log).subscribe(
          error => {
            this.buildMessage('erro ao tentar salvar registro de evento', 1);
          }
        );
      }
    } else if (this.dataRetorno !== null && this.exameForm.controls.data_retorno.value === null) {
      log.data = this.getDate();
      log.hora = new Date().toLocaleTimeString();
      log.funcionario = this.user.id;
      log.evento = 'EDIÇÃO';
      log.descricao = 'ALTERAÇÃO NA DATA DE RETORNO DO EXAME ' + this.exame.nome + ' DO PACIÊNTE ' + this.paciente.nome + '. DA DATA ' +
        this.formatDate(this.dataRetorno) + ' PARA DATA DE RETORNO PENDENTE';
      this.logService.save(log).subscribe(
        error => {
          console.log(error);
          this.buildMessage('erro ao tentar salvar registro de evento', 1);
        }
      );
    }

    if (this.dataColeta !== this.exameForm.controls.data_coleta.value) {
      log.data = this.getDate();
      log.hora = new Date().toLocaleTimeString();
      log.funcionario = this.user.id;
      log.evento = 'EDIÇÃO';
      log.descricao = 'ALTERAÇÃO NA DATA DE COLETA DO EXAME ' + this.exame.nome + ' DO PACIÊNTE ' + this.paciente.nome + '. DA DATA ' +
        this.formatDate(this.dataColeta) + ' PARA DATA ' + this.formatDate(this.exameForm.controls.data_coleta.value);
      this.logService.save(log).subscribe(
        error => {
          this.buildMessage('erro ao tentar salvar registro de evento', 1);
        }
      );
    }

    if (this.dataEnvio !== this.exameForm.controls.data_envio.value) {
      log.data = this.getDate();
      log.hora = new Date().toLocaleTimeString();
      log.funcionario = this.user.id;
      log.evento = 'EDIÇÃO';
      log.descricao = 'ALTERAÇÃO NA DATA DE ÊNVIO DO EXAME ' + this.exame.nome + ' DO PACIÊNTE ' + this.paciente.nome + '. DA DATA ' +
        this.formatDate(this.dataEnvio) + ' PARA DATA ' + this.formatDate(this.exameForm.controls.data_envio.value);
      this.logService.save(log).subscribe(

        error => {
          this.buildMessage('erro ao tentar salvar registro de evento', 1);
        }
      );
    }



    this.exameForm.controls.nome.setValue(this.exameForm.controls.nome.value.toUpperCase());
    this.exameForm.controls.descricao.setValue(this.exameForm.controls.descricao.value.toUpperCase());
    this.exameForm.controls.funcionario_laboratorio.setValue(this.exameForm.controls.funcionario_laboratorio.value.toUpperCase());
    this.exameService.update(this.exameForm.value).subscribe(
      data => {
        this.exame = data;
        this.buildMessage('Informações atualizada com sucesso', 0);

        this.exameForm.controls.laboratorio.disable();
        this.exameForm.controls.tipo_convenio.disable();
        this.isEditing = false;
        this.createForm();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar atualizar os dados', 1);
      }
    );
  }

  delete() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.exameService.delete(this.exameId).subscribe(
          (data) => {
            let log = new LogSave
            log.data = this.getDate();
            log.hora = new Date().toLocaleTimeString();
            log.funcionario = this.user.id;
            log.evento = 'EXCLUSÃO';
            log.descricao = 'EXCLUSÃO DO EXAME ' + this.exame.nome + ' DO PACIÊNTE ' + this.paciente.nome;
            this.logService.save(log).subscribe(
              error => {
                this.buildMessage('erro ao tentar salvar registro de evento', 1);
              }
            );
            this.exameService.message = 'Exame excluido com sucesso!';
            this.router.navigate(['exames']);
          },
          (error) => {
            this.buildMessage('Erro ao tentar excluir o exame', 1);
          }
        );
      }
    });
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event) {
    return event.target.value = event.target.value.toUpperCase();
  }

  // Varificação de caractere
  onlyLetters(event) {
    if (event.charCode == 32 || // espaço
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


  /*Função para liberar os campos para edição */
  unblockFields() {
    this.exameForm.enable();
    this.isEditing = true;
  }

  // função para bloquear os campos de edição
  cancelEditing() {
    this.isEditing = false;
    this.exameForm.controls.laboratorio.disable();
    this.exameForm.controls.tipo_convenio.disable();
    this.getExame();
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
