import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { PacienteService } from 'src/app/services/paciente.service';
import { ExameService } from 'src/app/services/exame.service';
import { Paciente } from 'src/app/models/paciente';
import { Exame } from 'src/app/models/exame';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Laboratorio } from 'src/app/models/laboratorio';
import { LaboratorioService } from 'src/app/services/laboratorio.service';
import { LaboratorioTipoConvenioService } from 'src/app/services/laboratorio-tipo-convenio.service';
import { TipoConvenio, TipoConvenioPaciente } from 'src/app/models/tipo-convenio';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Funcionario } from 'src/app/models/funcionario';
import { of } from 'rxjs';
@Component({
  selector: 'app-exame-register',
  templateUrl: './exame-register.component.html',
  styleUrls: ['./exame-register.component.css']
})
export class ExameRegisterComponent implements OnInit {
  // Icone de voltar a pagina
  faChevronLeft = faChevronLeft;

  // Icone do botão de salvar
  faCheck = faCheck;


  exameForm: FormGroup;

  pacientes: Paciente[];

  paciente: Paciente;

  laboratorios: Laboratorio[];

  laboratorio: Laboratorio;

  laboratorioTipos: TipoConvenioPaciente[];

  exame: Exame;

  filteredPacientes: Observable<any>;

  pacienteName = new FormControl();

  user = JSON.parse(sessionStorage.getItem('user'));

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private pacienteService: PacienteService,
    private exameService: ExameService,
    private laboratorioService: LaboratorioService,
    private laboratorioTipoConvenioService: LaboratorioTipoConvenioService,
    private userserivce: UserService
  ) { }


  ngOnInit(): void {
    this.paciente = new Paciente;
    this.laboratorio = new Laboratorio;
    this.filterPacientes();
    this.createForm();
  }
  createForm() {
    this.exame = new Exame();
    this.exame.tipoConvenio = new TipoConvenio();
    this.exame.funcionario = new Funcionario();
    this.exame.laboratorio = new Laboratorio();
    this.exame.paciente = new Paciente();

    this.exameForm = this.fb.group({
      nome: [this.exame.nome, Validators.required],
      descricao: [this.exame.descricao, Validators.required],
      dataColeta: [this.exame.dataColeta, Validators.required],
      dataEnvio: [this.exame.dataEnvio, Validators.required],
      funcionarioLaboratorio: [this.exame.funcionarioLaboratorio, Validators.required],
      valor: [this.exame.valor, Validators.required],
      funcionarioId: [this.exame.funcionario.id],
      tipoConvenioId: [this.exame.tipoConvenio.id, Validators.required],
      pacienteId: [this.exame.paciente.prontuario, Validators.required],
      laboratorioId: [this.exame.laboratorio.id, Validators.required]
    });

    this.exameForm.controls.funcionarioId.setValue(this.user.id);
    // this.getPacientes();
    this.exameForm.controls.laboratorioId.disable();
    this.exameForm.controls.tipoConvenioId.disable();



  }


  filterPacientes() {

    this.filteredPacientes = this.pacienteName.valueChanges
      .pipe(

        startWith(''),

        switchMap(value => {
          if (value !== '') {
            // lookup from github
            return this.filter(value);
          } else {
            // if no value is pressent, return null
            return of(null);
          }
        })
      )
  }

  filter(value: string): Observable<Paciente> {
    return this.pacienteService.getPacienteByName(value).pipe(
      map(results => results),
      catchError(_ => {
        return of(null);
      })
    )

  }


  getPacienteDetails(pacienteId) {

    this.exameForm.controls.pacienteId.setValue(pacienteId);
    this.pacienteService.getPaciente(pacienteId).subscribe(
      data => {
        this.paciente = data;
        this.getLaboratorios();

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informações do paciente', 1);
      }
    );
  }


  getLaboratorios() {
    this.laboratorioService.getByTipoConvenio(this.paciente.tipoConvenio.id).subscribe(
      data => {
        this.laboratorios = data;
        this.exameForm.controls.laboratorioId.enable();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar a lista de laboratórios', 1);
      }
    );

  }

  getLaboratorioDetails() {
    this.laboratorioService.getById(this.exameForm.controls.laboratorioId.value).subscribe(
      data => {
        this.laboratorio = data;
        this.exameForm.controls.tipoConvenioId.enable();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informaçõs do laboratório', 1);
      }
    );

    this.laboratorioTipoConvenioService.getAcceptedConveniosTipos(this.exameForm.controls.laboratorioId.value).subscribe(
      data => {
        this.laboratorioTipos = data.filter(tipo => tipo.id === 1 || tipo.id === this.paciente.tipoConvenio.id);

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar a lista de convenios aceitos pelo laboratório', 1);
      }
    )
  }




  save(frm: FormGroup) {
    this.exameForm.controls.nome.setValue(this.exameForm.controls.nome.value.toUpperCase());
    this.exameForm.controls.descricao.setValue(this.exameForm.controls.descricao.value.toUpperCase());
    this.exameForm.controls.funcionarioLaboratorio.setValue(this.exameForm.controls.funcionarioLaboratorio.value.toUpperCase());
    this.exameService.save(this.exameForm.value).subscribe(
      data => {
        this.router.navigate(['/exames']);
        this.exameService.message = 'Exame cadastrado com sucesso';
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar cadastrar o exame', 1);
      }
    )
  }


  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event) {
    return event.target.value = event.target.value.toUpperCase();
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
