import { Component, OnInit, ViewChild } from '@angular/core';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Registroclinico } from 'src/app/models/registroclinico';
import { PacienteService } from 'src/app/services/paciente.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/models/paciente';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';

import { RegistroclinicoService } from 'src/app/services/registroclinico.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { Convenio } from 'src/app/models/convenio';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserLogged } from 'src/app/models/user';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';



@Component({
  selector: 'app-registro-clinico-register',
  templateUrl: './registro-clinico-register.component.html',
  styleUrls: ['./registro-clinico-register.component.css']
})
export class RegistroClinicoRegisterComponent implements OnInit {
  faChevronLeft = faChevronLeft;
  faCheck = faCheck;

  isLoading: boolean;

  prontuario = this.route.snapshot.paramMap.get('prontuario');

  paciente: Paciente;



  registroClinico: Registroclinico;

  formRegistroClinico: FormGroup;

  registrosAnteriores: Registroclinico[];

  dataSource: any;

  user: UserLogged = JSON.parse(sessionStorage.getItem('user'));


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = ['prontuario', 'descricao', 'func_nome', 'especialidade', 'data', 'hora'];


  constructor(
    private fb: FormBuilder,
    private registroClinicoService: RegistroclinicoService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.registroClinico = new Registroclinico();
    this.paciente = new Paciente();
    this.paciente.tipoConvenio = new TipoConvenio();
    this.paciente.tipoConvenio.convenio = new Convenio();
    this.getPaciente();
  }


  createForm() {
    this.formRegistroClinico = this.fb.group({
      data: [this.registroClinico.data],
      hora: [this.registroClinico.hora],
      funcionarioId: [this.registroClinico.funcionario],
      agendamentoId: [this.registroClinico.agendamento],
      pacienteId: [this.registroClinico.prontuario],
      descricao: [this.registroClinico.descricao, Validators.required]
    });

  }

  buildTable() {
    this.dataSource = new MatTableDataSource(this.registrosAnteriores);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  onSubmit() {

    this.getHours();
    this.getDate();
    this.formRegistroClinico.controls.agendamentoId.setValue(null);
    this.formRegistroClinico.controls.pacienteId.setValue(+this.prontuario);
    this.formRegistroClinico.controls.funcionarioId.setValue(this.user.id);
    this.formRegistroClinico.controls.descricao.setValue(this.formRegistroClinico.controls.descricao.value.toUpperCase());


    this.registroClinicoService.saveRegistroClinico(this.formRegistroClinico.value).subscribe(
      data => {
        this.buildMessage('Registro cadastrado com sucesso', 0);
        this.formRegistroClinico.reset();
      },
      error => {

      }
    );

  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  /* getRegistroAnteriores() {
    this.registroClinicoService.getRegistrosAnteriores(this.pacienteId).subscribe(
      data => {
        this.registrosAnteriores = data;
        this.buildTable();
      },
      error => {

      }
    )
  } */

  getPaciente() {
    this.pacienteService.getPaciente(this.prontuario).subscribe(
      data => {

        this.isLoading = false;
        this.paciente = data;
        this.createForm();

      },
      error => {
        this.buildMessage('Erro ao tentar recuperar as informações do paciente', 1);
      }
    );
  }





  getHours() {
    const todayDate = new Date();
    let hora;
    let minutos;
    let seconds;
    if (todayDate.getHours() < 10) {
      hora = '0' + todayDate.getHours();
    } else {
      hora = todayDate.getHours();
    }
    if (todayDate.getMinutes() < 10) {
      minutos = '0' + todayDate.getMinutes();
    } else {
      minutos = todayDate.getMinutes();
    }
    if (todayDate.getSeconds() < 10) {
      seconds = '0' + todayDate.getSeconds();
    } else {
      seconds = todayDate.getSeconds();
    }
    this.formRegistroClinico.controls.hora.setValue(hora + ':' + minutos + ':' + seconds);
  }

  getDate() {
    const todayDate = new Date();
    const todayArray = todayDate.toLocaleDateString().split('/');

    var todayYear = todayArray[2];
    var todayMonth = todayArray[1];
    var todayDay = todayArray[0];

    this.formRegistroClinico.controls.data.setValue(todayYear + '-' + todayMonth + '-' + todayDay);
  }



  buildMessage(message: string, type: number) {
    // configurações da mensagem de confirmação
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
