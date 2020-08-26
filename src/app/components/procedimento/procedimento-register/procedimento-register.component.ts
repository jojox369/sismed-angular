import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Procedimento } from 'src/app/models/procedimento';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ConvenioService } from 'src/app/services/convenio.service';
import { ProcedimentoService } from 'src/app/services/procedimento.service';

@Component({
  selector: 'app-procedimento-register',
  templateUrl: './procedimento-register.component.html',
  styleUrls: ['./procedimento-register.component.css']
})
export class ProcedimentoRegisterComponent implements OnInit {

  // Icone de salvar
  faCheck = faCheck;

  // Icone de voltar
  faChevronLeft = faChevronLeft;

  // Controla os campos do formulario
  formProcedimento: FormGroup;

  /* Recupera o id do convenio para a consulta na API*/
  convenioId = this.route.snapshot.paramMap.get('convenioId');

  // Recebe os dados digitados no formulario
  procedimento: Procedimento;

  // Recebe o nome do convenio
  convenioNome: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private convenioService: ConvenioService,
    private procedimentoService: ProcedimentoService,
    private fb: FormBuilder

  ) { }

  ngOnInit(): void {

    this.createForm();
  }


  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {
    this.procedimento = new Procedimento;
    this.formProcedimento = this.fb.group({
      descricao: [this.procedimento.descricao, Validators.required],
      valor: [this.procedimento.valor, Validators.required],
      convenio: [this.procedimento.convenio]
    });

    this.convenioService.getById(this.convenioId).subscribe((data) => {
      this.convenioNome = data.nome;
      this.formProcedimento.controls.convenio.setValue(data.id);
    });


  }

  save(frm: FormGroup) {
    this.formProcedimento.value.descricao = this.formProcedimento.value.descricao.toUpperCase();
    this.procedimentoService.save(this.formProcedimento.value).subscribe(
      data => {
        this.procedimentoService.message = 'Procedimento cadastro com sucesso!';
        this.router.navigate(['/procedimentos', this.convenioId]);

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar salvar procedimento', 1);
      }
    );
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
