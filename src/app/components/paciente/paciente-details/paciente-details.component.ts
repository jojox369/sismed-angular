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
import { Paciente } from 'src/app/models/paciente';
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

@Component({
  selector: 'app-paciente-details',
  templateUrl: './paciente-details.component.html',
  styleUrls: ['./paciente-details.component.css'],
})
export class PacienteDetailsComponent implements OnInit {
  mask = '(00) 0000-0000';

  faTimes = faTimes;


  faCheck = faCheck;


  faChevronLeft = faChevronLeft;


  faPencilAlt = faPencilAlt;


  faBan = faBan;


  faPlus = faPlus;


  faList = faList;

  /*Recupera o id do convenio para realizar a requisição a API */
  pacienteId = this.route.snapshot.paramMap.get('id');


  formPaciente: FormGroup;


  isADoctor = false;


  isEditing = false;


  paciente: Paciente;


  convenios: Convenio[];

  //Recebe uma lista de tipos de convenio apos um convenio ser selecionado
  tiposConvenio: TipoConvenio[];


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
  ) { }

  ngOnInit(): void {
    this.convenioFormControl = new FormControl('', Validators.required);
    this.getPaciente();
    this.getConvenios();
  }

  getPaciente() {
    this.pacienteService.getPaciente(this.pacienteId).subscribe(
      (data) => {
        this.paciente = data;
        if (this.paciente.telefoneFixo) {
          if (this.paciente.telefoneFixo.length > 10) {
            this.mask = '(00) 0 0000-0000';
          }
        }

        this.convenioFormControl.setValue(this.paciente.tipoConvenio.convenio.id);
        this.createForm();
        this.isLoading = false;
        this.getTipos();

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




  createForm() {
    this.formPaciente = this.fb.group({

      prontuario: [this.paciente.prontuario],
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
      estado_civil: [this.paciente.estadoCivil],
      profissao: [this.paciente.profissao],
      recomendacao: [this.paciente.recomendacao],
      escolaridade: [this.paciente.escolaridade],
      carteira_convenio: [this.paciente.carteiraConvenio],
      situacao: [this.paciente.situacao],
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

    this.pacienteService.updatePaciente(this.formPaciente.value).subscribe(
      (data) => {
        this.paciente = data;
        this.isEditing = false;
        this.formPaciente.get('endereco.estado').disable();
        this.formPaciente.controls.nacionalidade.disable();
        this.formPaciente.controls.sexo.disable();
        this.formPaciente.controls.estado_civil.disable();
        this.formPaciente.controls.escolaridade.disable();
        this.formPaciente.controls.tipoConvenio.disable();
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
      if (result === 'true') {
        this.isLoading = true;
        this.loadingDataMessage = 'Excluindo paciente';
        this.pacienteService.deletePaciente(Number(this.pacienteId)).subscribe(
          (data) => {

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

  unblockFields() {
    this.formPaciente.enable();
    this.convenioFormControl.enable();
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    this.formPaciente.get('endereco.estado').disable();
    this.formPaciente.controls.nacionalidade.disable();
    this.formPaciente.controls.sexo.disable();
    this.formPaciente.controls.estado_civil.disable();
    this.formPaciente.controls.escolaridade.disable();
    this.formPaciente.controls.tipoConvenio.disable();
    this.formPaciente.controls.situacao.disable();
    this.convenioFormControl.disable();
    this.formPaciente.disable();
    //this.getPaciente();
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


  buildMessage(message: string, type: number) {

    let snackbarConfig: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };




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
