import { Component, OnInit } from '@angular/core';
import { Convenio } from 'src/app/models/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-convenio-details',
  templateUrl: './convenio-details.component.html',
  styleUrls: ['./convenio-details.component.css'],
})
export class ConvenioDetailsComponent implements OnInit {

  faTimes = faTimes;


  faCheck = faCheck;


  faChevronLeft = faChevronLeft;


  faPencilAlt = faPencilAlt;


  faBan = faBan;


  faPlus = faPlus;


  faList = faList;


  convenio: Convenio


  convenioId = this.route.snapshot.paramMap.get('convenioId');


  formConvenio: FormGroup;


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
      registroAns: [this.convenio.registroAns],
      dataAdesao: [this.convenio.dataAdesao, Validators.required],
      dadosBancarios: this.fb.group({
        id: [this.convenio.dadosBancarios.id, Validators.required],
        agencia: [this.convenio.dadosBancarios.agencia],
        banco: [this.convenio.dadosBancarios.banco, Validators.required],
        conta: [this.convenio.dadosBancarios.conta, Validators.required]
      }),
    });
    this.formConvenio.disable();
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();

  }


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


  cancelEditing() {

    this.isEditing = false;
    this.loadConvenio();
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


  onlyLetters(event) {
    if (event.charCode == 32 ||
      (event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      (event.charCode > 191 && event.charCode <= 255)
    ) {
      return true;
    } else {
      this.buildMessage('Insira apenas letras', 1);
      return false;
    }

  }

}
