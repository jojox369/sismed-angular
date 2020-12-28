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
import { Laboratorio } from 'src/app/models/laboratorio';
import { TipoConvenioPaciente } from 'src/app/models/tipo-convenio';
import { Exame } from 'src/app/models/exame';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
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

  laboratorios: Laboratorio[];

  laboratorioTipos: TipoConvenioPaciente[];

  exame: Exame;

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

    this.getExame();
  }

  getExame() {
    this.exameService.getById(this.exameId).subscribe(
      data => {
        this.exame = data;
        this.getLaboratorios();
        this.createForm();
      },
      error => {

        this.buildMessage('Erro ao tentar recuperar as informações do exame', 1);
      }
    );
  }

  createForm() {


    this.exameForm = this.fb.group({
      id: [this.exame.id],
      nome: [this.exame.nome, Validators.required],
      descricao: [this.exame.descricao, Validators.required],
      dataColeta: [this.exame.dataColeta, Validators.required],
      dataEnvio: [this.exame.dataEnvio, Validators.required],
      dataRetorno: [this.exame.dataRetorno],
      funcionarioLaboratorio: [this.exame.funcionarioLaboratorio, Validators.required],
      funcionarioId: [this.exame.funcionario.id],
      valor: [this.exame.valor, Validators.required],
      tipoConvenioId: [this.exame.tipoConvenio.id, Validators.required],
      pacienteId: [this.exame.paciente.prontuario, Validators.required],
      laboratorioId: [this.exame.laboratorio.id, Validators.required]
    });
    this.exameForm.controls.funcionarioId.setValue(this.user.id);
    this.exameForm.disable();
    this.dataColeta = this.exameForm.controls.dataColeta.value;
    this.dataEnvio = this.exameForm.controls.dataEnvio.value;
    this.dataRetorno = this.exameForm.controls.dataRetorno.value;

  }





  getLaboratorios() {
    this.laboratorioService.getByTipoConvenio(this.exame.paciente.tipoConvenio.id).subscribe(
      data => {
        this.laboratorios = data;
        this.getLaboratorioDetails();
      },
      error => {

        this.buildMessage('Erro ao tentar recuperar as informações do laboratório', 1);
      }
    );
  }

  getLaboratorioDetails() {
    this.laboratorioService.getById(this.exameForm.controls.laboratorioId.value).subscribe(
      data => {
        this.exame.laboratorio = data;

      },
      error => {

        this.buildMessage('Erro ao tentar recuperar as informaçõs do laboratório', 1);
      }
    );

    this.laboratorioTipoConvenioService.getAcceptedConveniosTipos(this.exameForm.controls.laboratorioId.value).subscribe(
      data => {
        this.laboratorioTipos = data.filter(tipo => tipo.id === 1 || tipo.id === this.exame.paciente.tipoConvenio.id);

      },
      error => {

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
    this.exameForm.controls.nome.setValue(this.exameForm.controls.nome.value.toUpperCase());
    this.exameForm.controls.descricao.setValue(this.exameForm.controls.descricao.value.toUpperCase());
    this.exameForm.controls.funcionarioLaboratorio.setValue(this.exameForm.controls.funcionarioLaboratorio.value.toUpperCase());
    this.exameService.update(this.exameForm.value).subscribe(
      data => {

        this.buildMessage('Informações atualizada com sucesso', 0);

        this.exameForm.controls.laboratorioId.disable();
        this.exameForm.controls.tipoConvenioId.disable();
        this.isEditing = false;
        this.getExame();
      },
      error => {

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
