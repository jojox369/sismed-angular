import { Component, OnInit } from '@angular/core';
import { Convenio } from 'src/app/models/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DadosBancarios } from 'src/app/models/dados-bancarios';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-convenio-details',
  templateUrl: './convenio-details.component.html',
  styleUrls: ['./convenio-details.component.css'],
})
export class ConvenioDetailsComponent implements OnInit {
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

  // recece os dados da api
  convenio: Convenio

  /*Recupera o id do convenio para realizar a requisição a API */
  convenioId = this.route.snapshot.paramMap.get('convenioId');

  // Controla os campos do formulario
  formConvenio: FormGroup;

  // Controla a edição do formulário
  isEditing = false;



  constructor(
    private convenioService: ConvenioService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loadConvenio();
  }

  // Metodo que recupera os dados do convenio
  loadConvenio() {
    this.convenioService.getById(this.convenioId).subscribe(
      (data) => {
        this.convenio = data;
        this.createForm();
      },
      (error) => {
        this.buildMessage(
          'Erro ao tentar recuperar as informações do convenio',
          1
        );
        console.log('Erro ao carregar dados');
      }
    );
  }

  createForm() {
    this.formConvenio = this.fb.group({
      id: [this.convenio.id],
      nome: [this.convenio.nome, [Validators.required]],
      cnpj: [this.convenio.cnpj],
      registro_ans: [this.convenio.registro_ans],
      data_adesao: [this.convenio.data_adesao, Validators.required],
      dados_bancarios: this.fb.group({
        agencia: [this.convenio.dados_bancarios.agencia, Validators.required],
        banco: [this.convenio.dados_bancarios.banco, Validators.required],
        conta: [this.convenio.dados_bancarios.conta, Validators.required]
      }),
    });
    this.formConvenio.disable();
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();

  }

  // Faz a requisição ao back-end para que o convenio seja atualizado
  update(form: FormGroup) {
    this.formConvenio.value.nome = this.formConvenio.value.nome.toUpperCase();
    this.convenioService.update(this.formConvenio.value).subscribe(
      data => {
        this.convenio = data;
        this.createForm();
        this.isEditing = false;
        this.buildMessage('Informações do convenio atualizadas com sucesso', 0);
      },
      error => {
        console.log(error);
        this.cancelEditing();
        this.buildMessage(
          'Erro ao tentar atualizar as informações do convenio',
          1
        );
        this.loadConvenio();
      }
    );
  }

  /* Função responsavel por requisitar ao service que um convenio seja deletado*/
  deleteConvenio() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.convenioService.delete(this.convenioId).subscribe(
          (data) => {
            this.convenioService.message = 'Convenio excluido com sucesso!';
            this.router.navigate(['convenios']);
          },
          (error) => {
            this.buildMessage('Erro ao tentar excluir o convenio', 1);
          }
        );
      }
    });
  }

  /*Função para liberar os campos para edição */
  unblockFields() {
    this.formConvenio.enable();
    this.isEditing = true;
  }

  // função para bloquear os campos de edição
  cancelEditing() {

    this.isEditing = false;
    this.loadConvenio();
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

}
