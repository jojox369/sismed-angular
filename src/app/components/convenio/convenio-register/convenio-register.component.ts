import { faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ConvenioService } from 'src/app/services/convenio.service';
import { Convenio } from 'src/app/models/convenio';
import { DadosBancarios } from 'src/app/models/dados-bancarios';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-convenio-register',
  templateUrl: './convenio-register.component.html',
  styleUrls: ['./convenio-register.component.css']
})
export class ConvenioRegisterComponent implements OnInit {

  // Recebe os dados do formulário
  convenio: Convenio;

  // Icone de cancelar
  faChevronLeft = faChevronLeft;

  // Icone de salvar
  faCheck = faCheck;

  // Controla os campos do formulario
  formConvenio: FormGroup;



  constructor(
    private convenioService: ConvenioService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.createForm();
  }

  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {
    this.convenio = new Convenio();
    this.convenio.dados_bancarios = new DadosBancarios();
    this.formConvenio = this.fb.group({
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
  }

  // Faz a requisição ao back-end para que o convenio seja salvo
  save(frm: FormGroup) {

    this.formConvenio.value.nome = this.formConvenio.value.nome.toUpperCase();
    this.convenioService.save(this.formConvenio.value).subscribe(
      data => {
        this.convenioService.message = 'Convenio cadastrado com sucesso!';
        this.router.navigate(['convenios']);
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar salvar o convenio', 1);
      }
    );
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
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
