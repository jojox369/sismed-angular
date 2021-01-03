import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { Funcionario } from 'src/app/models/funcionario';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import {
  faTimes,
  faCheck,
  faChevronLeft,
  faPencilAlt,
  faBan,
  faPlus,
  faList,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import { EnderecoService } from 'src/app/services/endereco.service';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FuncionarioTipoConvenioListComponent } from '../funcionario-tipo-convenio-list/funcionario-tipo-convenio-list.component';
import { FuncionarioTipoConvenioRegisterComponent } from '../funcionario-tipo-convenio-register/funcionario-tipo-convenio-register.component';
import { FuncionarioTipoConvenioDeleteComponent } from '../funcionario-tipo-convenio-delete/funcionario-tipo-convenio-delete.component';
import { LogSave } from 'src/app/models/log';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { UserLogged } from 'src/app/models/user';

@Component({
  selector: 'app-funcionario-details',
  templateUrl: './funcionario-details.component.html',
  styleUrls: ['./funcionario-details.component.css'],
})
export class FuncionarioDetailsComponent implements OnInit {

  faTimes = faTimes;


  faCheck = faCheck;


  faChevronLeft = faChevronLeft;


  faPencilAlt = faPencilAlt;


  faBan = faBan;


  faPlus = faPlus;


  faList = faList;


  faKey = faKey;

  /*Recupera o id do convenio para realizar a requisição a API */
  funcionarioId = this.route.snapshot.paramMap.get('funcionarioId');


  formFuncionario: FormGroup;


  isADoctor = false;


  isEditing = false;


  funcionario: Funcionario;

  dataInicio: string;

  dataTermino: string;

  log: LogSave;

  user: UserLogged = JSON.parse(sessionStorage.getItem('user'));

  @ViewChild('numberInput') numberInput: ElementRef;

  isLoading: boolean = true;

  loadingDataMessage: string = 'Carregando Dados ... ';

  constructor(
    private funcionarioService: FuncionarioService,
    private enderecoService: EnderecoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getFuncionario();
  }


  getFuncionario() {
    this.funcionarioService.getFuncionario(this.funcionarioId).subscribe(
      (data) => {
        if (this.user.perfil !== 3 && this.user.cpf !== data.cpf) {
          this.router.navigate(['access-denied']);
        } else {
          this.funcionario = data;
          this.createForm();
        }
      },
      (error) => {
        this.buildMessage('Erro ao carregar os dados', 1);
      }
    );
  }


  createForm() {
    this.formFuncionario = this.fb.group({
      id: [this.funcionario.id],
      nome: [
        { value: this.funcionario.nome, disabled: true },
        Validators.required,
      ],
      cpf: [this.funcionario.cpf, Validators.required],
      rg: [this.funcionario.rg, Validators.required],
      orgaoEmissor: [this.funcionario.orgaoEmissor, Validators.required],
      dataEmissao: [this.funcionario.dataEmissao, Validators.required],
      dataNascimento: [this.funcionario.dataNascimento, Validators.required],
      dataInicio: [this.funcionario.dataInicio, Validators.required],
      dataTermino: [this.funcionario.dataTermino],
      naturalidade: [this.funcionario.naturalidade, Validators.required],
      nacionalidade: [this.funcionario.nacionalidade, Validators.required],
      telefoneFixo: [this.funcionario.telefoneFixo, Validators.required],
      celular: [this.funcionario.celular, Validators.required],
      email: [this.funcionario.email, Validators.required],
      sexo: [this.funcionario.sexo, Validators.required],
      estadoCivil: [this.funcionario.estadoCivil, Validators.required],
      escolaridade: [this.funcionario.escolaridade, Validators.required],
      perfilId: [this.funcionario.perfilId, Validators.required],
      especialidade: [this.funcionario.especialidade],
      crm: [this.funcionario.crm],
      endereco: this.fb.group({
        id: [this.funcionario.endereco.id, Validators.required],
        cep: [this.funcionario.endereco.cep, Validators.required],
        logradouro: [this.funcionario.endereco.logradouro, Validators.required],
        numero: [this.funcionario.endereco.numero, Validators.required],
        complemento: [this.funcionario.endereco.complemento],
        bairro: [this.funcionario.endereco.bairro, Validators.required],
        cidade: [this.funcionario.endereco.cidade, Validators.required],
        estado: [this.funcionario.endereco.estado, Validators.required],
      }),
    });

    if (this.funcionario.crm !== null) {
      this.isADoctor = true;
    }

    this.formFuncionario.disable();
    this.dataInicio = this.formFuncionario.controls.dataInicio.value;
    this.dataTermino = this.formFuncionario.controls.dataTermino.value;
    this.isLoading = false;

  }

  /*função que é chamada quando um tipo de funcionario é selecionado no formulário
    Também habilita os campos de crm e especialidade
  */
  funcionarioType() {
    if (this.formFuncionario.controls.perfil.value === 1) {
      this.isADoctor = true;
    } else {
      this.formFuncionario.controls.crm.setValue(null);
      this.formFuncionario.controls.especialidade.setValue(null);
      this.isADoctor = false;
    }
  }

  getEndereco() {
    this.enderecoService
      .getEndereco(this.formFuncionario.value.endereco.cep)
      .subscribe(
        (data) => {
          this.formFuncionario
            .get('endereco.logradouro')
            .setValue(data['logradouro'].toUpperCase());
          this.formFuncionario
            .get('endereco.bairro')
            .setValue(data['bairro'].toUpperCase());
          this.formFuncionario
            .get('endereco.cidade')
            .setValue(data['localidade'].toUpperCase());
          this.formFuncionario
            .get('endereco.estado')
            .setValue(data['uf'].toUpperCase());
          this.formFuncionario
            .get('endereco.complemento')
            .setValue(data['complemento'].toUpperCase());
          this.numberInput.nativeElement.focus();
        },
        (error) => {
          this.buildMessage('Erro ao tentar carregar dados do endereco', 1);
        }
      );
  }

  formatDate(date: string): string {
    const arrayDate = date.split('-');
    return arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0];
  }

  getDate(): string {
    const todayDate = new Date().toLocaleDateString().split('/');
    return todayDate[2] + '-' + todayDate[1] + '-' + todayDate[0];
  }

  update(frm: FormGroup) {
    this.isLoading = true;
    this.loadingDataMessage = 'Atualizando informações do funcionário';
    this.formFuncionario.value.nome = this.formFuncionario.value.nome.toUpperCase();

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

    if (this.funcionario.endereco.logradouro) {
      this.formFuncionario
        .get('endereco.logradouro')
        .setValue(
          this.formFuncionario.get('endereco.logradouro').value.toUpperCase()
        );
    }
    if (this.funcionario.endereco.bairro) {
      this.formFuncionario
        .get('endereco.bairro')
        .setValue(
          this.formFuncionario.get('endereco.bairro').value.toUpperCase()
        );
    }

    if (this.funcionario.endereco.cidade) {
      this.formFuncionario
        .get('endereco.cidade')
        .setValue(
          this.formFuncionario.get('endereco.cidade').value.toUpperCase()
        );
    }


    if (this.funcionario.endereco.estado) {
      this.formFuncionario
        .get('endereco.estado')
        .setValue(
          this.formFuncionario.get('endereco.estado').value.toUpperCase()
        );
    }


    if (this.funcionario.endereco.complemento) {
      this.formFuncionario
        .get('endereco.complemento')
        .setValue(
          this.formFuncionario.get('endereco.complemento').value.toUpperCase()
        );
    }



    if (
      this.dataInicio !== this.formFuncionario.controls.dataInicio.value
    ) {

    }

    this.funcionarioService
      .updateFuncionario(this.formFuncionario.value).subscribe(
        (data) => {
          this.isLoading = false;
          this.funcionario = data;
          this.formFuncionario.get('endereco.estado').disable();

          this.isEditing = false;
          this.buildMessage('Funcionário atualizado com sucesso!', 0);
          this.createForm();

        },
        (error) => {
          this.isLoading = false;
          this.buildMessage('Erro ao tentar atualizar os dados', 1);
        }
      );
  }

  delete() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this.isLoading = true;
        this.loadingDataMessage = 'Excluindo funcionário';
        this.funcionarioService.deleteFuncionario(this.funcionarioId).subscribe(
          (data) => {
            this.router.navigate(['funcionarios']);
            this.funcionarioService.message =
              'Funcionário(a) excluido(a) com sucesso!';


          },
          (error) => {
            this.isLoading = false;
            this.buildMessage('Erro ao tentar excluir o funcionário', 1);
          }
        );
      }
    });
  }

  listTiposConvenio() {
    const dialogRef = this.dialog.open(FuncionarioTipoConvenioListComponent, {
      height: '600px',
      width: '650px',
      data: { id: this.funcionarioId, nome: this.funcionario.nome },
    });
  }

  registerTiposConvenio() {
    const dialogRef = this.dialog.open(
      FuncionarioTipoConvenioRegisterComponent,
      {
        height: '600px',
        width: '650px',
        data: this.funcionarioId,
      }
    );
  }

  deleteTiposConvenio() {
    const dialogRef = this.dialog.open(FuncionarioTipoConvenioDeleteComponent, {
      height: '600px',
      width: '650px',
      data: this.funcionarioId,
    });
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      height: '600px',
      width: '650px',
      data: this.funcionario.id,
    });
  }

  /*Função para liberar os campos para edição */
  unblockFields() {
    this.formFuncionario.enable();
    this.isEditing = true;
  }


  cancelEditing() {
    this.isEditing = false;
    this.formFuncionario.get('endereco.estado').disable();
    this.getFuncionario();
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }


  onlyLetters(event) {
    if (
      event.charCode == 32 ||
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
}
