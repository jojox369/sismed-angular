import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Paciente } from 'src/app/models/paciente';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Convenio } from 'src/app/models/convenio';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { PacienteService } from 'src/app/services/paciente.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Endereco } from 'src/app/models/endereco';
import { EnderecoService } from 'src/app/services/endereco.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-register',
  templateUrl: './paciente-register.component.html',
  styleUrls: ['./paciente-register.component.css'],
})
export class PacienteRegisterComponent implements OnInit {
  //Icone de voltar
  faChevronLeft = faChevronLeft;

  // icone de salvar
  faCheck = faCheck;

  // faz o controle dos campos de paciente
  formPaciente: FormGroup;

  // Recebe os dados informados no formulario
  paciente: Paciente;

  // Recebe a lista de convenios para serem listadas no formulário
  convenios: Convenio[];

  //Recebe uma lista de tipos de convenio apos um convenio ser selecionado
  tiposConvenio: TipoConvenio[];

  // controla o select de convenio
  convenioFormControl: FormControl;

  loadingDataMessage: string;

  isLoading: boolean;

  @ViewChild('numberInput') numberInput: ElementRef;

  constructor(
    private pacienteService: PacienteService,
    private convenioService: ConvenioService,
    private tipoConvenioService: TipoConvenioService,
    private enderecoService: EnderecoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.paciente = new Paciente();
    this.paciente.endereco = new Endereco();
    this.paciente.tipoConvenio = new TipoConvenio();
    this.convenioFormControl = new FormControl('');
    this.getConvenios();
    this.createForm();
  }

  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {
    this.formPaciente = this.fb.group({
      nome: [this.paciente.nome, Validators.required],
      cpf: [this.paciente.cpf, Validators.required],
      rg: [this.paciente.rg],
      orgaoEmissor: [this.paciente.orgaoEmissor],
      dataEmissao: [this.paciente.dataEmissao],
      dataNascimento: [this.paciente.dataNascimento],
      naturalidade: [this.paciente.naturalidade],
      nacionalidade: [this.paciente.nacionalidade],
      telefoneFixo: [this.paciente.telefoneFixo],
      telefoneTrabalho: [this.paciente.telefoneTrabalho],
      celular: [this.paciente.celular, Validators.required],
      email: [this.paciente.email],
      sexo: [this.paciente.sexo],
      estadoCivil: [this.paciente.estadoCivil],
      profissao: [this.paciente.profissao],
      recomendacao: [this.paciente.recomendacao],
      escolaridade: [this.paciente.escolaridade],
      carteiraConvenio: [this.paciente.carteiraConvenio],
      validade: [this.paciente.validade],
      tipoConvenio: [this.paciente.tipoConvenio.id, Validators.required],
      endereco: this.fb.group({
        cep: [this.paciente.endereco.cep],
        logradouro: [this.paciente.endereco.logradouro],
        numero: [this.paciente.endereco.numero],
        complemento: [this.paciente.endereco.complemento],
        bairro: [this.paciente.endereco.bairro],
        cidade: [this.paciente.endereco.cidade],
        estado: [this.paciente.endereco.estado],
      }),
    });
  }

  save(frm: FormGroup) {
    this.isLoading = true;
    this.loadingDataMessage = 'Atualizando as informações do paciente';
    this.formPaciente.controls.nome.setValue(
      this.formPaciente.controls.nome.value.toUpperCase()
    );

    if (this.formPaciente.controls.naturalidade.value !== null) {
      this.formPaciente.controls.naturalidade.setValue(
        this.formPaciente.controls.naturalidade.value.toUpperCase()
      );
    }

    if (this.formPaciente.controls.orgaoEmissor.value !== null) {
      this.formPaciente.controls.orgaoEmissor.setValue(
        this.formPaciente.controls.orgaoEmissor.value.toUpperCase()
      );
    }

    if (this.formPaciente.controls.profissao.value !== null) {
      this.formPaciente.controls.profissao.setValue(
        this.formPaciente.controls.profissao.value.toUpperCase()
      );
    }

    if (this.formPaciente.controls.recomendacao.value !== null) {
      this.formPaciente.controls.recomendacao.setValue(
        this.formPaciente.controls.recomendacao.value.toUpperCase()
      );
    }

    if (this.formPaciente.get('endereco.logradouro').value !== null) {
      this.formPaciente
        .get('endereco.logradouro')
        .setValue(
          this.formPaciente.get('endereco.logradouro').value.toUpperCase()
        );
    }

    if (this.formPaciente.get('endereco.bairro').value !== null) {
      this.formPaciente
        .get('endereco.bairro')
        .setValue(this.formPaciente.get('endereco.bairro').value.toUpperCase());
    }

    if (this.formPaciente.get('endereco.cidade').value !== null) {
      this.formPaciente
        .get('endereco.cidade')
        .setValue(this.formPaciente.get('endereco.cidade').value.toUpperCase());
    }

    if (this.formPaciente.get('endereco.estado').value !== null) {
      this.formPaciente
        .get('endereco.estado')
        .setValue(this.formPaciente.get('endereco.estado').value.toUpperCase());
    }
    if (this.formPaciente.get('endereco.complemento').value !== null) {
      this.formPaciente
        .get('endereco.complemento')
        .setValue(
          this.formPaciente.get('endereco.complemento').value.toUpperCase()
        );
    }

    this.pacienteService.savePaciente(this.formPaciente.value).subscribe(
      (data) => {
        this.router.navigate(['pacientes']);
        this.pacienteService.message = 'Paciente cadastrado com sucesso';
      },
      (error) => {
        this.isLoading = false;
        this.buildMessage('Erro ao tentar cadastrar o paciente', 1);
      }
    );
  }

  verifyCPF() {
    this.pacienteService
      .getPacienteByCpf(this.formPaciente.controls.cpf.value)
      .subscribe(
        (data) => {
          if (Object.keys(data).length > 0) {
            this.buildMessage('CPF já cadastrado', 1);
          }
        },
        (error) => { }
      );
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  // Varificação de caractere
  onlyLetters(event) {
    if (
      event.charCode == 32 || // espaço
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

  getConvenios() {
    this.convenioService.getAll().subscribe(
      (data) => {
        this.convenios = data;
      },
      (error) => {
        this.buildMessage('Erro ao tentar carregar a lista de convênios', 1);
      }
    );
  }



  getTipos() {
    this.tipoConvenioService.getAll(this.convenioFormControl.value).subscribe(
      (data) => {
        this.tiposConvenio = data;
      },
      (error) => {
        this.buildMessage(
          'Erro ao tentar carregar a lista de planos do convênio',
          1
        );
      }
    );
  }

  getEndereco() {
    this.enderecoService
      .getEndereco(this.formPaciente.value.endereco.cep)
      .subscribe(
        (data) => {
          this.formPaciente
            .get('endereco.logradouro')
            .setValue(data['logradouro'].toUpperCase());
          this.formPaciente
            .get('endereco.bairro')
            .setValue(data['bairro'].toUpperCase());
          this.formPaciente
            .get('endereco.cidade')
            .setValue(data['localidade'].toUpperCase());
          this.formPaciente
            .get('endereco.estado')
            .setValue(data['uf'].toUpperCase());
          this.formPaciente
            .get('endereco.complemento')
            .setValue(data['complemento'].toUpperCase());
          this.numberInput.nativeElement.focus();
        },
        (error) => {
          this.buildMessage('Erro ao tentar carregar dados do endereco', 1);
        }
      );
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
