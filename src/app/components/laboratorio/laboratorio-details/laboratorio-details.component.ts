import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  faChevronLeft,
  faCheck,
  faTimes,
  faPencilAlt,
  faBan,
  faPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Laboratorio } from 'src/app/models/laboratorio';
import { Convenio } from 'src/app/models/convenio';
import { LaboratorioService } from 'src/app/services/laboratorio.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { LaboratorioTipoConvenioService } from 'src/app/services/laboratorio-tipo-convenio.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EnderecoService } from 'src/app/services/endereco.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { TipoConvenioRegisterDialogComponent } from '../tipo-convenio-register-dialog/tipo-convenio-register-dialog.component';

import { TipoConvenioDeleteDialogComponent } from '../tipo-convenio-delete-dialog/tipo-convenio-delete-dialog.component';

@Component({
  selector: 'app-laboratorio-details',
  templateUrl: './laboratorio-details.component.html',
  styleUrls: ['./laboratorio-details.component.css'],
})
export class LaboratorioDetailsComponent implements OnInit {
  /*Recupera o id do laboratorio para realizar a requisição a API */
  laboratorioId = this.route.snapshot.paramMap.get('laboratorioId');

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

  // Controla os campos do formulario
  formLaboratorio: FormGroup;

  laboratorio: Laboratorio;

  // Recebe as informações dos convenios aceitos pelo laboratorio
  convenios: Convenio[];

  convenioNome;

  // Controla a edição do formulário
  isEditing = false;

  @ViewChild('numberInput') numberInput: ElementRef;

  constructor(
    private laboratorioService: LaboratorioService,
    private convenioService: ConvenioService,
    private laboratorioTipoSerivce: LaboratorioTipoConvenioService,
    private enderecoService: EnderecoService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getLaboratorio();
    this.getConveniosLaboratorio();
  }

  // Recupera as informações do laboratorio
  getLaboratorio() {
    this.laboratorioService.getById(this.laboratorioId).subscribe(
      (data) => {
        this.laboratorio = data;
        this.createForm();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createForm() {
    this.formLaboratorio = this.fb.group({
      id: [this.laboratorio.id],
      nome: [this.laboratorio.nome, Validators.required],
      cnpj: [this.laboratorio.cnpj, Validators.required],
      responsavel: [this.laboratorio.responsavel, Validators.required],
      telefoneFixo: [this.laboratorio.telefoneFixo, Validators.required],
      email: [this.laboratorio.email],
      endereco: this.fb.group({
        cep: [this.laboratorio.endereco.cep, Validators.required],
        logradouro: [this.laboratorio.endereco.logradouro, Validators.required],
        numero: [this.laboratorio.endereco.numero, Validators.required],
        complemento: [this.laboratorio.endereco.complemento],
        bairro: [this.laboratorio.endereco.bairro, Validators.required],
        cidade: [this.laboratorio.endereco.cidade, Validators.required],
        estado: [this.laboratorio.endereco.estado, Validators.required],
      }),
    });
    this.formLaboratorio.disable();
  }

  // Recupera os convenios aceitos pelo laboratorio
  getConveniosLaboratorio() {
    this.laboratorioTipoSerivce
      .getAcceptedConvenios(this.laboratorioId)
      .subscribe(
        (data) => {
          this.convenios = data;
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar recuperar os convenios aceitos', 1);
        }
      );
  }

  // abre o dialogo para o cadastro de tipos de convenio
  tipoConvenioRegister() {
    const dialogRef = this.dialog.open(TipoConvenioRegisterDialogComponent, {
      height: '600px',
      width: '650px',
      data: this.laboratorioId,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getConveniosLaboratorio();
    });
  }

  // Abre o dialogo para exclusão de tipo de convenio
  tipoConvenioDelete() {
    const dialogRef = this.dialog.open(TipoConvenioDeleteDialogComponent, {
      height: '600px',
      width: '650px',
      data: this.laboratorioId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getConveniosLaboratorio();
    });
  }

  getEndereco() {
    this.enderecoService
      .getEndereco(this.formLaboratorio.value.endereco.cep)
      .subscribe(
        (data) => {
          this.formLaboratorio
            .get('endereco.logradouro')
            .setValue(data['logradouro'].toUpperCase());
          this.formLaboratorio
            .get('endereco.bairro')
            .setValue(data['bairro'].toUpperCase());
          this.formLaboratorio
            .get('endereco.cidade')
            .setValue(data['localidade'].toUpperCase());
          this.formLaboratorio
            .get('endereco.estado')
            .setValue(data['uf'].toUpperCase());
          this.formLaboratorio
            .get('endereco.complemento')
            .setValue(data['complemento'].toUpperCase());
          this.numberInput.nativeElement.focus();
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar carregar dados do endereco', 1);
        }
      );
  }

  /*Função para liberar os campos para edição */
  unblockFields() {
    this.formLaboratorio.enable();
    this.isEditing = true;
  }

  update(frm: FormGroup) {
    this.formLaboratorio.controls.nome.setValue(
      this.formLaboratorio.controls.nome.value.toUpperCase()
    );
    this.formLaboratorio.controls.responsavel.setValue(
      this.formLaboratorio.controls.responsavel.value.toUpperCase()
    );
    this.formLaboratorio
      .get('endereco.logradouro')
      .setValue(
        this.formLaboratorio.get('endereco.logradouro').value.toUpperCase()
      );
    this.formLaboratorio
      .get('endereco.bairro')
      .setValue(
        this.formLaboratorio.get('endereco.bairro').value.toUpperCase()
      );
    this.formLaboratorio
      .get('endereco.cidade')
      .setValue(
        this.formLaboratorio.get('endereco.cidade').value.toUpperCase()
      );
    this.formLaboratorio
      .get('endereco.estado')
      .setValue(
        this.formLaboratorio.get('endereco.estado').value.toUpperCase()
      );
    this.formLaboratorio
      .get('endereco.complemento')
      .setValue(
        this.formLaboratorio.get('endereco.complemento').value.toUpperCase()
      );
    this.laboratorioService.update(this.formLaboratorio.value).subscribe(
      (data) => {
        this.buildMessage('Dados atualizados com sucesso', 0);
        this.isEditing = false;
        this.laboratorio = data;
        this.formLaboratorio.get('endereco.estado').disable();
        this.createForm();
      },
      (error) => {
        console.log(error);
        this.buildMessage('Erro ao tentar atualizar dados', 1);
      }
    );
  }

  delete() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this.laboratorioService.delete(this.laboratorioId).subscribe(
          (data) => {
            this.laboratorioService.message =
              'Laboratório excluido com sucesso!';
            this.router.navigate(['laboratorios']);
          },
          (error) => {
            this.buildMessage('Erro ao tentar excluir o convenio', 1);
          }
        );
      }
    });
  }

  // função para bloquear os campos de edição
  cancelEditing() {
    this.isEditing = false;
    this.formLaboratorio.get('endereco.estado').disable();
    this.getLaboratorio();
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
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
