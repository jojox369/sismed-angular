import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvenioService } from 'src/app/services/convenio.service';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tipo-convenio-register',
  templateUrl: './tipo-convenio-register.component.html',
  styleUrls: ['./tipo-convenio-register.component.css'],
})
export class TipoConvenioRegisterComponent implements OnInit {
  // Icone de voltar
  faChevronLeft = faChevronLeft;

  // Icone de salvar
  faCheck = faCheck;

  // Controla os campos do formulario
  formTipoConvenio: FormGroup;

  // Recebe os dados digitados no formulário
  tipoConvenio: TipoConvenio;

  /* Recupera o id do convenio para a consulta na API*/
  convenioId = this.route.snapshot.paramMap.get('convenioId');

  // Recebe o nome do convenio
  convenioNome: string;

  constructor(
    private route: ActivatedRoute,
    private convenioService: ConvenioService,
    private tipoConvenioService: TipoConvenioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {
    this.tipoConvenio = new TipoConvenio();
    this.formTipoConvenio = this.fb.group({
      nome: [this.tipoConvenio.nome, Validators.required],
      convenio: [this.tipoConvenio.convenio]
    })

    this.convenioService.getById(this.convenioId).subscribe((data) => {
      this.convenioNome = data.nome;
      this.formTipoConvenio.controls.convenio.setValue(data.id);
    });
  }

  save(frm) {
    this.formTipoConvenio.value.nome = this.formTipoConvenio.value.nome.toUpperCase();
    this.tipoConvenioService.save(this.formTipoConvenio.value).subscribe(
      (data) => {
        this.router.navigate(['/tiposConvenio', this.convenioId]);
        this.tipoConvenioService.message =
          'Novo tipo de convenio cadastrado com sucesso';
      },
      (error) => {
        this.buildMessage('Erro ao tentar salvar o plano', 1);
        console.log(error);
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
