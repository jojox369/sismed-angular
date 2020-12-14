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
import { LogService } from 'src/app/services/log.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { UserLogged } from 'src/app/models/user';

@Component({
  selector: 'app-funcionario-details',
  templateUrl: './funcionario-details.component.html',
  styleUrls: ['./funcionario-details.component.css'],
})
export class FuncionarioDetailsComponent implements OnInit {
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

  // Icone de troca de senha
  faKey = faKey;

  /*Recupera o id do convenio para realizar a requisição a API */
  funcionarioId = this.route.snapshot.paramMap.get('funcionarioId');

  // faz o controle dos campos de funcionario
  formFuncionario: FormGroup;

  // Controla a exibição dos campos de CRM e Especialidade
  isADoctor = false;

  // Controla a edição do formulário
  isEditing = false;

  // Recebe os dados informados no formulario
  funcionario: Funcionario;

  dataInicio;

  dataTermino;

  log: LogSave;

  user: UserLogged = JSON.parse(sessionStorage.getItem('user'));

  @ViewChild('numberInput') numberInput: ElementRef;

  isLoading: boolean = true;

  loadingDataMessage: string = 'Carregando Dados ... ';

  constructor(
    private logService: LogService,
    private funcionarioService: FuncionarioService,
    private enderecoService: EnderecoService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getFuncionario();
  }

  // recupera os dados do funcionario;
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

  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
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
      telefone_fixo: [this.funcionario.telefone_fixo, Validators.required],
      celular: [this.funcionario.celular, Validators.required],
      email: [this.funcionario.email, Validators.required],
      sexo: [this.funcionario.sexo, Validators.required],
      estado_civil: [this.funcionario.estado_civil, Validators.required],
      escolaridade: [this.funcionario.escolaridade, Validators.required],
      perfil: [this.funcionario.perfil, Validators.required],
      especialidade: [this.funcionario.especialidade],
      crm: [this.funcionario.crm],
      endereco: this.fb.group({
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
    this.formFuncionario
      .get('endereco.logradouro')
      .setValue(
        this.formFuncionario.get('endereco.logradouro').value.toUpperCase()
      );
    this.formFuncionario
      .get('endereco.bairro')
      .setValue(
        this.formFuncionario.get('endereco.bairro').value.toUpperCase()
      );
    this.formFuncionario
      .get('endereco.cidade')
      .setValue(
        this.formFuncionario.get('endereco.cidade').value.toUpperCase()
      );
    this.formFuncionario
      .get('endereco.estado')
      .setValue(
        this.formFuncionario.get('endereco.estado').value.toUpperCase()
      );
    this.formFuncionario
      .get('endereco.complemento')
      .setValue(
        this.formFuncionario.get('endereco.complemento').value.toUpperCase()
      );

    this.funcionarioService
      .updateFuncionario(this.formFuncionario.value)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.funcionario = data;
          this.formFuncionario.get('endereco.estado').disable();
          this.createForm();
          this.isEditing = false;
          this.buildMessage('Funcionário atualizado com sucesso!', 0);
          if (
            this.dataInicio !== this.formFuncionario.controls.dataInicio.value
          ) {
            this.log = new LogSave();
            this.log.data = this.getDate();
            this.log.hora = new Date().toLocaleTimeString();
            this.log.funcionario = this.user.id;
            this.log.evento = 'EDIÇÃO';
            this.log.descricao =
              'ALTERAÇÃO NA DATA DE CONTRATAÇÃO DO FUNCIONÁRIO ' +
              this.funcionario.nome +
              '. DA DATA ' +
              this.formatDate(this.dataInicio) +
              ' PARA A DATA ' +
              this.formatDate(this.formFuncionario.controls.dataInicio.value);
            this.logService.save(this.log).subscribe(
              (data) => { },
              (error) => {
                this.buildMessage(
                  'Erro ao tentar salvar o registro de evento',
                  1
                );
              }
            );
          }

          if (
            this.dataTermino !==
            this.formFuncionario.controls.dataTermino.value
          ) {
            if (this.dataTermino !== null) {
              this.log = new LogSave();
              this.log.data = this.getDate();
              this.log.hora = new Date().toLocaleTimeString();
              this.log.funcionario = this.user.id;
              this.log.evento = 'EDIÇÃO';
              this.log.descricao =
                'ALTERAÇÃO NA DATA DE DISPENSA DO FUNCIONÁRIO ' +
                this.funcionario.nome +
                '. DA DATA ' +
                this.formatDate(this.dataTermino) +
                ' PARA A DATA ' +
                this.formatDate(
                  this.formFuncionario.controls.dataTermino.value
                );
              this.logService.save(this.log).subscribe((error) => {
                this.buildMessage(
                  'Erro ao tentar salvar o registro de evento',
                  1
                );
              });
            } else {
              this.log = new LogSave();
              this.log.data = this.getDate();
              this.log.hora = new Date().toLocaleTimeString();
              this.log.funcionario = this.user.id;
              this.log.evento = 'EDIÇÃO';
              this.log.descricao =
                'ALTERAÇÃO NA DATA DE DISPENSA DO FUNCIONÁRIO ' +
                this.funcionario.nome +
                '. DE DATA DE DISPENSA NÃO CADASTRADA PARA A DATA ' +
                this.formatDate(
                  this.formFuncionario.controls.dataTermino.value
                );
              this.logService.save(this.log).subscribe((error) => {
                this.buildMessage(
                  'Erro ao tentar salvar o registro de evento',
                  1
                );
              });
            }
          }
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
            this.log = new LogSave();
            this.log.data = this.getDate();
            this.log.hora = new Date().toLocaleTimeString();
            this.log.funcionario = this.user.id;
            this.log.evento = 'EXCLUSÃO';
            this.log.descricao =
              'EXCLUSÃO DO FUNCIONÁRIO ' + this.funcionario.nome;
            this.logService.save(this.log).subscribe(
              (data) => { },
              (error) => {
                this.buildMessage(
                  'Erro ao tentar salvar o registro de evento',
                  1
                );
              }
            );
            this.userService.getUsers().subscribe(
              (data) => {
                for (const user of data) {
                  if (user.username === this.funcionario.cpf) {
                    this.userService.deleteUser(user.id).subscribe(
                      (data) => {
                        this.funcionarioService.message =
                          'Funcionário(a) excluido(a) com sucesso!';
                        this.router.navigate(['funcionarios']);
                      },
                      (error) => {
                        this.buildMessage(
                          'Erro ao tentar excluir as credenciais do funcionario(a)',
                          1
                        );
                      }
                    );
                  }
                }
              },
              (error) => {
                this.buildMessage('Erro ao tentar excluir o funcionario', 1);
              }
            );
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
      data: this.funcionario.cpf,
    });
  }

  /*Função para liberar os campos para edição */
  unblockFields() {
    this.formFuncionario.enable();
    this.isEditing = true;
  }

  // função para bloquear os campos de edição
  cancelEditing() {
    this.isEditing = false;
    this.formFuncionario.get('endereco.estado').disable();
    this.getFuncionario();
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
