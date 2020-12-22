import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LaboratorioService } from 'src/app/services/laboratorio.service';
import { EnderecoService } from 'src/app/services/endereco.service';
import { Laboratorio } from 'src/app/models/laboratorio';
import { Endereco } from 'src/app/models/endereco';

@Component({
  selector: 'app-laboratorio-register',
  templateUrl: './laboratorio-register.component.html',
  styleUrls: ['./laboratorio-register.component.css']
})
export class LaboratorioRegisterComponent implements OnInit {

  // Icone de cancelar
  faChevronLeft = faChevronLeft;

  // Icone de salvar
  faCheck = faCheck;

  // Controla os campos do formulario
  formLaboratorio: FormGroup;

  laboratorio: Laboratorio;

  @ViewChild('numberInput') numberInput: ElementRef;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
    private laboratorioService: LaboratorioService,
    private enderecoService: EnderecoService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.laboratorio = new Laboratorio();
    this.laboratorio.endereco = new Endereco();
    this.formLaboratorio = this.fb.group({
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
        estado: [this.laboratorio.endereco.estado, Validators.required]
      })
    })
  }

  save(frm: FormGroup) {
    this.formLaboratorio.controls.nome.setValue(this.formLaboratorio.controls.nome.value.toUpperCase());
    this.formLaboratorio.controls.responsavel.setValue(this.formLaboratorio.controls.responsavel.value.toUpperCase());
    this.formLaboratorio.get('endereco.logradouro').setValue(this.formLaboratorio.get('endereco.logradouro').value.toUpperCase());
    this.formLaboratorio.get('endereco.bairro').setValue(this.formLaboratorio.get('endereco.bairro').value.toUpperCase());
    this.formLaboratorio.get('endereco.cidade').setValue(this.formLaboratorio.get('endereco.cidade').value.toUpperCase());
    this.formLaboratorio.get('endereco.estado').setValue(this.formLaboratorio.get('endereco.estado').value.toUpperCase());
    this.formLaboratorio.get('endereco.complemento').setValue(this.formLaboratorio.get('endereco.complemento').value.toUpperCase());
    this.laboratorioService.save(this.formLaboratorio.value).subscribe(
      data => {
        this.laboratorioService.message = 'Laboratório cadastrado com sucesso';
        this.router.navigate(['laboratorios']);
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar cadastrar laboratório', 1);
      }
    );
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();

  }

  getEndereco() {
    this.enderecoService.getEndereco(this.formLaboratorio.value.endereco.cep).subscribe(
      data => {
        this.formLaboratorio.get('endereco.logradouro').setValue(data['logradouro'].toUpperCase());
        this.formLaboratorio.get('endereco.bairro').setValue(data['bairro'].toUpperCase());
        this.formLaboratorio.get('endereco.cidade').setValue(data['localidade'].toUpperCase());
        this.formLaboratorio.get('endereco.estado').setValue(data['uf'].toUpperCase());
        this.formLaboratorio.get('endereco.complemento').setValue(data['complemento'].toUpperCase());
        this.numberInput.nativeElement.focus();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar carregar dados do endereco', 1);
      }
    )
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
