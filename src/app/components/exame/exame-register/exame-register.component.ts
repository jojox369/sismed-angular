import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { PacienteService } from 'src/app/services/paciente.service';
import { ExameService } from 'src/app/services/exame.service';
import { Paciente } from 'src/app/models/paciente';
import { ExameDetail } from 'src/app/models/exame';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Laboratorio } from 'src/app/models/laboratorio';
import { LaboratorioService } from 'src/app/services/laboratorio.service';
import { LaboratorioTipoConvenioService } from 'src/app/services/laboratorio-tipo-convenio.service';
import { TipoConvenioPaciente } from 'src/app/models/tipo-convenio';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
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

  exame: ExameDetail;

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
    this.createForm();
  }
  createForm() {
    this.exame = new ExameDetail();

    this.exameForm = this.fb.group({
      nome: [this.exame.nome, Validators.required],
      descricao: [this.exame.descricao, Validators.required],
      data_coleta: [this.exame.data_coleta, Validators.required],
      data_envio: [this.exame.data_envio, Validators.required],
      funcionario_laboratorio: [this.exame.funcionario_laboratorio, Validators.required],
      funcionario: [this.exame.funcionario],
      valor: [this.exame.valor, Validators.required],
      tipo_convenio: [this.exame.tipo_convenio, Validators.required],
      paciente: [this.exame.paciente, Validators.required],
      laboratorio: [this.exame.laboratorio, Validators.required]
    });

    this.exameForm.controls.funcionario.setValue(this.user.id);
    this.getPacientes();
    this.exameForm.controls.laboratorio.disable();
    this.exameForm.controls.tipo_convenio.disable();



  }

  getPacientes() {
    this.pacienteService.getAllPacientes().subscribe(
      data => {
        this.pacientes = data;
        this.filterPacientes();

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar a lista de pacientes', 1);
      }
    );
  }

  filterPacientes() {

    this.filteredPacientes = this.pacienteName.valueChanges
      .pipe(
        startWith(''),
        map(value => value.length >= 1 ? this.filter(value) : [])
      )
  }

  filter(value: string) {

    const filterValue = value.toLowerCase();
    const results = this.pacientes.filter(option => option.nome.toLowerCase().includes(filterValue));
    return results;
  }


  getPacienteDetails(pacienteId) {

    this.exameForm.controls.paciente.setValue(pacienteId);
    this.pacienteService.getPacienteDetails(pacienteId).subscribe(
      data => {
        this.paciente = data[0];
        this.getLaboratorios();

      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informações do paciente', 1);
      }
    );
  }


  getLaboratorios() {
    this.laboratorioService.getByTipoConvenio(this.paciente.tipo_convenio.id).subscribe(
      data => {
        this.laboratorios = data;
        this.exameForm.controls.laboratorio.enable();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar a lista de laboratórios', 1);
      }
    );

  }

  getLaboratorioDetails() {
    this.laboratorioService.getById(this.exameForm.controls.laboratorio.value).subscribe(
      data => {
        this.laboratorio = data;
        this.exameForm.controls.tipo_convenio.enable();
      },
      error => {
        console.log(error);
        this.buildMessage('Erro ao tentar recuperar as informaçõs do laboratório', 1);
      }
    );

    this.laboratorioTipoConvenioService.getAcceptedConveniosTipos(this.exameForm.controls.laboratorio.value).subscribe(
      data => {
        this.laboratorioTipos = data.filter(tipo => tipo.id === 1 || tipo.id === this.paciente.tipo_convenio.id);

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
    this.exameForm.controls.funcionario_laboratorio.setValue(this.exameForm.controls.funcionario_laboratorio.value.toUpperCase());
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
