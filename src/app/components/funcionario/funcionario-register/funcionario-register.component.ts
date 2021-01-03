import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { faCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Funcionario } from 'src/app/models/funcionario';
import { Endereco } from 'src/app/models/endereco';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { EnderecoService } from 'src/app/services/endereco.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-funcionario-register',
  templateUrl: './funcionario-register.component.html',
  styleUrls: ['./funcionario-register.component.css']
})
export class FuncionarioRegisterComponent implements OnInit {


  //Icone de voltar
  faChevronLeft = faChevronLeft

  // icone de salvar
  faCheck = faCheck;

  // faz o controle dos campos de funcionario
  formFuncionario: FormGroup

  // Variavel que controla a aparição dos campos de crm e especialidade
  isADoctor = false;

  // Recebe os dados do formulario
  funcionario: Funcionario;

  loadingDataMessage: string;

  isLoading: boolean;

  user = JSON.parse(sessionStorage.getItem('user'));

  @ViewChild('numberInput') numberInput: ElementRef;


  constructor(
    private funcionarioService: FuncionarioService,
    private enderecoService: EnderecoService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.user.perfil === 2) {
      this.router.navigate(['access-denied']);
    } else {
      this.createForm();
    }
  }

  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {
    this.funcionario = new Funcionario;
    this.funcionario.endereco = new Endereco;
    this.formFuncionario = this.fb.group({
      nome: [this.funcionario.nome, Validators.required],
      cpf: [this.funcionario.cpf, Validators.required],
      rg: [this.funcionario.rg, Validators.required],
      orgaoEmissor: [this.funcionario.orgaoEmissor, Validators.required],
      dataEmissao: [this.funcionario.dataEmissao, Validators.required],
      dataNascimento: [this.funcionario.dataNascimento, Validators.required],
      dataInicio: [this.funcionario.dataInicio, Validators.required],
      naturalidade: [this.funcionario.naturalidade, Validators.required],
      nacionalidade: [this.funcionario.nacionalidade, Validators.required],
      telefoneFixo: [this.funcionario.telefoneFixo, Validators.required],
      celular: [this.funcionario.celular, Validators.required],
      senha: [this.funcionario.senha, Validators.required],
      email: [this.funcionario.email, Validators.required],
      sexo: [this.funcionario.sexo, Validators.required],
      estadoCivil: [this.funcionario.estadoCivil, Validators.required],
      escolaridade: [this.funcionario.escolaridade, Validators.required],
      perfilId: [this.funcionario.perfilId, Validators.required],
      especialidade: [this.funcionario.especialidade],
      crm: [this.funcionario.crm],
      endereco: this.fb.group({
        cep: [this.funcionario.endereco.cep, Validators.required],
        logradouro: [this.funcionario.endereco.logradouro, Validators.required],
        numero: [this.funcionario.endereco.numero, Validators.required],
        complemento: [this.funcionario.endereco.complemento],
        bairro: [this.funcionario.endereco.bairro, Validators.required],
        cidade: [this.funcionario.endereco.cidade, Validators.required],
        estado: [this.funcionario.endereco.estado, Validators.required]
      }),
    });
  }

  save(frm: FormGroup) {
    this.isLoading = true;
    this.loadingDataMessage = 'Atualizando as informações do funcionário';
    if (this.funcionario.orgaoEmissor) {
      this.formFuncionario.controls.orgaoEmissor.setValue(
        this.formFuncionario.controls.orgaoEmissor.value.toUpperCase()
      )
    }

    if (this.funcionario.email) {
      this.formFuncionario.controls.email.setValue(
        this.formFuncionario.controls.email.value.toUpperCase()
      )
    }

    if (this.funcionario.naturalidade) {
      this.formFuncionario.controls.naturalidade.setValue(
        this.formFuncionario.controls.naturalidade.value.toUpperCase()
      )
    }
    this.formFuncionario.controls.nome.setValue(this.formFuncionario.value.nome.toUpperCase());
    this.formFuncionario.controls.naturalidade.setValue(this.formFuncionario.value.naturalidade.toUpperCase());
    this.formFuncionario.get('endereco.logradouro').setValue(this.formFuncionario.get('endereco.logradouro').value.toUpperCase());
    this.formFuncionario.get('endereco.bairro').setValue(this.formFuncionario.get('endereco.bairro').value.toUpperCase());
    this.formFuncionario.get('endereco.cidade').setValue(this.formFuncionario.get('endereco.cidade').value.toUpperCase());
    this.formFuncionario.get('endereco.estado').setValue(this.formFuncionario.get('endereco.estado').value.toUpperCase());
    this.formFuncionario.get('endereco.complemento').setValue(this.formFuncionario.get('endereco.complemento').value.toUpperCase());
    this.funcionarioService.saveFuncionario(this.formFuncionario.value).subscribe(
      data => {

        this.funcionarioService.message = 'Funcionario cadastrado com sucesso!';
        this.router.navigate(['funcionarios']);



      },
      error => {

        this.buildMessage('Erro ao tentar cadastrar o funcionario', 1);
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




  /*função que é chamada quando um tipo de funcionario é selecionado no formulário
    Também habilita os campos de crm e especialidade
  */
  funcionarioType() {
    if (this.formFuncionario.controls.perfilId.value === 1) {
      this.isADoctor = true;
    } else {
      this.formFuncionario.controls.crm.setValue(null);
      this.formFuncionario.controls.especialidade.setValue(null);
      this.isADoctor = false;
    }
  }

  getEndereco() {
    this.enderecoService.getEndereco(this.formFuncionario.value.endereco.cep).subscribe(
      data => {
        this.formFuncionario.get('endereco.logradouro').setValue(data['logradouro'].toUpperCase());
        this.formFuncionario.get('endereco.bairro').setValue(data['bairro'].toUpperCase());
        this.formFuncionario.get('endereco.cidade').setValue(data['localidade'].toUpperCase());
        this.formFuncionario.get('endereco.estado').setValue(data['uf'].toUpperCase());
        this.formFuncionario.get('endereco.complemento').setValue(data['complemento'].toUpperCase());
        this.numberInput.nativeElement.focus();
      },
      error => {
        console.log(error);
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
