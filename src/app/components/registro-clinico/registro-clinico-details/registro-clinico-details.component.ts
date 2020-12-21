import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Registroclinico, RegistroclinicoDetails } from 'src/app/models/registroclinico';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/models/paciente';

import { RegistroclinicoService } from 'src/app/services/registroclinico.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import {
  faTimes,
  faCheck,
  faChevronLeft,
  faPencilAlt,
  faBan,
  faPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { UserLogged } from 'src/app/models/user';


@Component({
  selector: 'app-registro-clinico-details',
  templateUrl: './registro-clinico-details.component.html',
  styleUrls: ['./registro-clinico-details.component.css']
})
export class RegistroClinicoDetailsComponent implements OnInit {

  faTimes = faTimes;


  faCheck = faCheck;


  faChevronLeft = faChevronLeft;


  faPencilAlt = faPencilAlt;


  faBan = faBan;


  faPlus = faPlus;


  faList = faList;

  isLoading: boolean;

  registroId = this.route.snapshot.paramMap.get('id');

  paciente: Paciente;

  isEditing = false;


  registroClinico: RegistroclinicoDetails;

  formRegistroClinico: FormGroup;

  registrosAnteriores: Registroclinico[];

  dataSource: any;

  user: UserLogged = JSON.parse(sessionStorage.getItem('user'));



  constructor(
    private fb: FormBuilder,
    private registroClinicoService: RegistroclinicoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.getRegistro();

  }


  createForm() {
    this.formRegistroClinico = this.fb.group({
      id: [this.registroClinico.id],
      data: [this.registroClinico.data],
      hora: [this.registroClinico.hora],
      funcionarioId: [this.registroClinico.funcionario.id],
      agendamentoId: [this.registroClinico.agendamento],
      pacienteId: [this.registroClinico.paciente.prontuario],
      descricao: [this.registroClinico.descricao, Validators.required]
    });

  }


  onSubmit() {

    this.getHours();
    this.getDate();

    this.formRegistroClinico.controls.descricao.setValue(this.formRegistroClinico.controls.descricao.value.toUpperCase());


    this.registroClinicoService.atualizarRegistroClinico(this.formRegistroClinico.value).subscribe(
      data => {
        this.buildMessage('Registro atualizado com sucesso', 0);
        this.getRegistro();
      },
      error => {
        this.buildMessage('Erro ao tentar atualizar registro clínico', 1)
      }
    );

  }

  getRegistro() {
    this.registroClinicoService.getRegistro(+this.registroId).subscribe(
      data => {
        this.registroClinico = data;
        this.createForm();
      },
      error => {
        this.buildMessage('erro ao tentar recuperar os dados do registro clínico', 1);
      }
    )
  }


  deleteRegistro() {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.registroClinicoService.delete(this.registroId).subscribe(
          (data) => {
            this.registroClinicoService.message = 'Registro Clínico excluido com sucesso!';
            this.router.navigate(['registroclinico']);
          },
          (error) => {
            this.buildMessage('Erro ao tentar excluir o convenio', 1);
          }
        );
      }
    });
  }




  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event: any) {
    event.target.value = event.target.value.toUpperCase();
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
