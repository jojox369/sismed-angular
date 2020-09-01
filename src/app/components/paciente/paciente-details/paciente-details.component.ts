import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  faTimes,
  faCheck,
  faChevronLeft,
  faPencilAlt,
  faBan,
  faPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { PacientePost } from 'src/app/models/paciente';
import { Convenio } from 'src/app/models/convenio';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { PacienteService } from 'src/app/services/paciente.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';
import { EnderecoService } from 'src/app/services/endereco.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { LogSave } from 'src/app/models/log';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-paciente-details',
  templateUrl: './paciente-details.component.html',
  styleUrls: ['./paciente-details.component.css'],
})
export class PacienteDetailsComponent implements OnInit {
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

  /*Recupera o id do convenio para realizar a requisição a API */
  pacienteId = this.route.snapshot.paramMap.get('id');

  // faz o controle dos campos de funcionario
  formPaciente: FormGroup;

  // Controla a exibição dos campos de CRM e Especialidade
  isADoctor = false;

  // Controla a edição do formulário
  isEditing = false;

  // Recebe os dados informados no formulario
  paciente: PacientePost;

  // Recebe a lista de convenios para serem listadas no formulário
  convenios: Convenio[];

  //Recebe uma lista de tipos de convenio apos um convenio ser selecionado
  tiposConvenio: TipoConvenio[];

  // controla o select de convenio
  convenioFormControl: FormControl;

  user = JSON.parse(sessionStorage.getItem('user'));

  @ViewChild('numberInput') numberInput: ElementRef;

  loadingDataMessage: string = 'Carregando Dados ...';

  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private pacienteService: PacienteService,
    private convenioService: ConvenioService,
    private tipoConvenioService: TipoConvenioService,
    private enderecoService: EnderecoService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.convenioFormControl = new FormControl('', Validators.required);
    this.getPaciente();
    this.getConvenios();
  }

  getPaciente() {
    this.pacienteService.getPaciente(this.pacienteId).subscribe(
      (data) => {
        this.paciente = data;
        this.getTipoConvenioDetails();
      },
      (error) => {
        this.buildMessage(
          'Erro ao tentar carregar as informações do paciente',
          1
        );
        this.router.navigate(['/error']);
      }
    );
  }

  getTipoConvenioDetails() {
    this.tipoConvenioService.getById(this.paciente.tipo_convenio).subscribe(
      (data) => {
        this.convenioFormControl.setValue(data.convenio);
        this.createForm();
        this.isLoading = false;
        this.getTipos();
      },
      (error) => {
        this.buildMessage(
          'Erro ao tentar recuperar as informações do plano',
          1
        );
      }
    );
  }

  // Controla o formulario pegando ou setando valores nos campos e também fazendo validações
  createForm() {
    this.formPaciente = this.fb.group({
      id: [this.paciente.id],
      prontuario: [this.paciente.prontuario],
      nome: [this.paciente.nome, Validators.required],
      cpf: [this.paciente.cpf, Validators.required],
      rg: [this.paciente.rg],
      orgao_emissor: [this.paciente.orgao_emissor],
      data_emissao: [this.paciente.data_emissao],
      data_nascimento: [this.paciente.data_nascimento],
      naturalidade: [this.paciente.naturalidade],
      nacionalidade: [this.paciente.nacionalidade],
      telefone_fixo: [this.paciente.telefone_fixo],
      telefone_trabalho: [this.paciente.telefone_trabalho],
      celular: [this.paciente.celular, Validators.required],
      email: [this.paciente.email],
      sexo: [this.paciente.sexo],
      estado_civil: [this.paciente.estado_civil],
      profissao: [this.paciente.profissao],
      recomendacao: [this.paciente.recomendacao],
      escolaridade: [this.paciente.escolaridade],
      carteira_convenio: [this.paciente.carteira_convenio],
      situacao: [this.paciente.situacao],
      validade: [this.paciente.validade],
      tipo_convenio: [this.paciente.tipo_convenio, Validators.required],
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

    this.formPaciente.disable();
    this.convenioFormControl.disable();
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

  update(frm: FormGroup) {
    this.isLoading = true;
    this.loadingDataMessage = 'Atualizando as informações do paciente';
    this.formPaciente.controls.nome.setValue(
      this.formPaciente.controls.nome.value.toUpperCase()
    );

    if (this.formPaciente.value.naturalidade !== null) {
      this.formPaciente.value.naturalidade = this.formPaciente.value.naturalidade.toUpperCase();
    }

    if (this.formPaciente.value.orgao_emissor !== null) {
      this.formPaciente.value.orgao_emissor = this.formPaciente.value.orgao_emissor.toUpperCase();
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

    this.pacienteService.upadatePaciente(this.formPaciente.value).subscribe(
      (data) => {
        this.paciente = data;
        this.isEditing = false;
        this.formPaciente.get('endereco.estado').disable();
        this.formPaciente.controls.nacionalidade.disable();
        this.formPaciente.controls.sexo.disable();
        this.formPaciente.controls.estado_civil.disable();
        this.formPaciente.controls.escolaridade.disable();
        this.formPaciente.controls.tipo_convenio.disable();
        this.formPaciente.controls.situacao.disable();
        this.convenioFormControl.disable();
        this.formPaciente.disable();
        this.isLoading = false;
        this.buildMessage('Dados do paciente atualizados com sucesso!', 0);
      },
      (error) => {
        this.buildMessage('Erro ao tentar atualizar dados paciente', 1);
      }
    );
  }

  getDate(): string {
    const todayDate = new Date().toLocaleDateString().split('/');
    return todayDate[2] + '-' + todayDate[1] + '-' + todayDate[0];
  }

  delete() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.isLoading = true;
      this.loadingDataMessage = 'Excluindo paciente';
      if (result === 'true') {
        this.pacienteService.deletePaciente(Number(this.pacienteId)).subscribe(
          (data) => {
            let log = new LogSave();
            log.data = this.getDate();
            log.hora = new Date().toLocaleTimeString();
            log.funcionario = this.user.id;
            log.evento = 'EXCLUSÃO';
            log.descricao = 'EXCLUSÃO DO paciente ' + this.paciente.nome;
            this.logService.save(log).subscribe(
              (data) => {},
              (error) => {
                this.buildMessage(
                  'Erro ao tentar salvar o registro de evento',
                  1
                );
              }
            );
            this.pacienteService.message = 'Paciente excluido com sucesso!';
            this.router.navigate(['/pacientes']);
          },
          (error) => {
            this.buildMessage('Erro ao tentar excluir o paciente', 1);
            this.isLoading = false;
          }
        );
      }
    });
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

  /*Função para liberar os campos para edição */
  unblockFields() {
    this.formPaciente.enable();
    this.convenioFormControl.enable();
    this.isEditing = true;
  }

  // função para bloquear os campos de edição
  cancelEditing() {
    this.isEditing = false;
    this.formPaciente.get('endereco.estado').disable();
    this.formPaciente.controls.nacionalidade.disable();
    this.formPaciente.controls.sexo.disable();
    this.formPaciente.controls.estado_civil.disable();
    this.formPaciente.controls.escolaridade.disable();
    this.formPaciente.controls.tipo_convenio.disable();
    this.formPaciente.controls.situacao.disable();
    this.convenioFormControl.disable();
    this.formPaciente.disable();
    this.getPaciente();
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
