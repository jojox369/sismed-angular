import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {
  faTimes,
  faCheck,
  faChevronLeft,
  faPencilAlt,
  faBan,
  faPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvenioService } from 'src/app/services/convenio.service';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Convenio } from 'src/app/models/convenio';

@Component({
  selector: 'app-tipo-convenio-details',
  templateUrl: './tipo-convenio-details.component.html',
  styleUrls: ['./tipo-convenio-details.component.css'],
})
export class TipoConvenioDetailsComponent implements OnInit {
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

  // Controla a edição do formulário
  isEditing = false;


  // Controla os campos do formulario
  formTipoConvenio: FormGroup;

  tipoConvenio: TipoConvenio;


  /*Recupera o id do tipo de convenio para a consulta na API*/
  tipoConvenioId = this.route.snapshot.paramMap.get('tipoConvenioId');

  // Recebe o nome do convenio
  convenioNome: string;

  constructor(
    private tipoConvenioService: TipoConvenioService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadTipoConvenioDetail();
  }

  // Faz a requisição ao service pelos dados do tipo de convenio
  loadTipoConvenioDetail() {
    this.tipoConvenioService.getById(this.tipoConvenioId).subscribe(
      data => {
        this.tipoConvenio = data;

        this.createForm();
      },
      error => {

        this.buildMessage('Erro ao tentar recuperar informações do plano', 1);

      }
    );
  }



  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {

    this.formTipoConvenio = this.fb.group({
      id: [this.tipoConvenio.id],
      nome: [this.tipoConvenio.nome, Validators.required],
      convenioId: [this.tipoConvenio.convenio.id]
    });
    this.formTipoConvenio.disable();
  }



  update(frm: FormGroup) {

    this.formTipoConvenio.value.nome = this.formTipoConvenio.value.nome.toUpperCase()
    this.tipoConvenioService.update(this.formTipoConvenio.value).subscribe(
      data => {
        this.loadTipoConvenioDetail();
        this.createForm();
        this.isEditing = false;
        this.buildMessage('Informações atualizadas com sucesso', 0);
      },
      error => {
        this.cancelEditing();
        this.buildMessage('Erro ao tentar atualizar as informações', 1);
      }
    );
  }

  deleteTipoConvenio() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.tipoConvenioService.delete(this.formTipoConvenio.controls.id.value).subscribe(
          data => {
            this.tipoConvenioService.message = 'Plano excluido com sucesso!';
            this.router.navigate(['/tiposConvenio', this.tipoConvenio.convenio.id]);

          },
          error => {

            this.buildMessage('Erro ao tentar excluir plano', 1);
          }
        )
      }
    }
    );
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();

  }

  /*Função para liberar os campos para edição */
  unblockFields() {
    this.formTipoConvenio.enable();
    this.isEditing = true;
  }

  // função que bloqueia os campos de edição
  cancelEditing() {
    this.isEditing = false;
    this.loadTipoConvenioDetail();
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
