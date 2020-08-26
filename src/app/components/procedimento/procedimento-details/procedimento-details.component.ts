import { Component, OnInit } from '@angular/core';
import { faTimes, faCheck, faChevronLeft, faPencilAlt, faBan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Procedimento } from 'src/app/models/procedimento';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcedimentoService } from 'src/app/services/procedimento.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-procedimento-details',
  templateUrl: './procedimento-details.component.html',
  styleUrls: ['./procedimento-details.component.css']
})
export class ProcedimentoDetailsComponent implements OnInit {

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
  formProcedimento: FormGroup;

  // Variavel que recupera o id do procedimento na url
  procedimentoId = this.route.snapshot.paramMap.get('procedimentoId');

  procedimento: Procedimento;

  // Recebe o nome do convenio
  convenioNome: string;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private procedimentoService: ProcedimentoService,
    private convenioService: ConvenioService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProcedimento();
  }

  // Função que faz requisição ao service para retorna os detalhes de um procedimento
  getProcedimento() {
    this.procedimentoService.getById(this.procedimentoId).subscribe(
      data => {
        this.procedimento = data;
        this.createForm();


      },
      error => {
        console.log(error);
      }
    );
  }

  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {
    this.formProcedimento = this.fb.group({
      id: [this.procedimento.id],
      descricao: [this.procedimento.descricao, Validators.required],
      valor: [this.procedimento.valor, Validators.required],
      convenio: [this.procedimento.convenio]
    });



    this.formProcedimento.disable();
  }

  // Função que busca o nome do convenio para ser exibido na pagina
  loadConvenio() {
    this.convenioService.getById(this.procedimento.convenio).subscribe(
      data => {
        this.convenioNome = data.nome;
      }
    );
  }

  update(frm: FormGroup) {
    this.formProcedimento.value.descricao = this.formProcedimento.value.descricao.toUpperCase();
    this.procedimentoService.update(this.formProcedimento.value).subscribe(
      data => {
        this.procedimento = data;
        this.createForm()
        this.isEditing = false;
        this.buildMessage('Informações atualizadas com sucesso', 0)
      },
      error => {
        this.cancelEditing();
        this.buildMessage('Erro ao tentar atualizar as informações', 1)
        console.log(error);
      }
    );
  }

  delete() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.procedimentoService.delete(this.procedimento).subscribe(
          data => {
            this.procedimentoService.message = 'Procedimento excluido com sucesso!';
            this.router.navigate(['procedimentos/' + this.formProcedimento.controls.convenio_id.value]);
          },
          error => {
            this.buildMessage('Não foi possivel excluir o procedimento ', 0);
          }
        );
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
    this.formProcedimento.enable();
    this.isEditing = true;
  }

  // função que bloqueia os campos de edição
  cancelEditing() {
    this.isEditing = false;
    this.getProcedimento();
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
