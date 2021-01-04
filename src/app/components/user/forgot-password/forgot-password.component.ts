import { Component, OnInit } from '@angular/core';
import { faCheck, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  faCheck = faCheck;
  faTimes = faTimes;
  faExclamationTriangle = faExclamationTriangle;
  userForm: FormGroup;
  changePasswordForm: FormGroup;
  showUserForm: boolean = true;
  loadingEmail: boolean;
  showChangePasswordForm: boolean;
  user: User;
  codeDataBase: string;
  buttonDisabled = true;
  showHeader = true;
  showWrongCodeHeader = false
  isLoading;
  loadingDataMessage;
  showSuccessUpdatedMessage = false;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService,

  ) { }

  logIn(): void {
    window.location.reload()
  }

  ngOnInit(): void {
    this.createform();
  }

  createform(): void {
    this.userForm = this.fb.group({
      cpf: ['', Validators.required],
    });

    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],

      code: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  verifyPasswords() {
    if (this.changePasswordForm.controls.password.value && this.changePasswordForm.controls.repeatPassword.value) {
      this.buttonDisabled = false;
    }
    if (
      this.changePasswordForm.controls.password.value != this.changePasswordForm.controls.repeatPassword.value
      || !this.changePasswordForm.controls.password.value
      || !this.changePasswordForm.controls.repeatPassword.value
      || !this.changePasswordForm.controls.code.value
    ) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }

  }

  resendEmail() {
    this.showChangePasswordForm = false;
    this.showWrongCodeHeader = false;
    this.verifyUser()
  }


  verifyUser() {
    this.showUserForm = false;
    this.loadingEmail = true;
    this.userService
      .verifyUsername(this.userForm.controls.cpf.value).subscribe(
        data => {
          this.loadingEmail = false;
          this.showChangePasswordForm = true;
          this.user = data;
          this.isLoading = false;

        },
        error => {
          if (error.status === 401) {
            this.buildMessage('Esse CPF não possui acesso ao SISMED', 1);
          } else {
            this.buildMessage('Erro ao tentar verificar o CPF', 1);
          }
          this.isLoading = false;
          this.showUserForm = true;
          this.loadingEmail = false;
        }
      )
  }

  updatePassword() {
    this.showChangePasswordForm = false;
    this.showWrongCodeHeader = false;
    this.isLoading = true;

    this.loadingDataMessage = 'Atualizando sua senha';
    const updatePassword = {
      id: this.user.id,
      senha: this.changePasswordForm.controls.password.value,
      codigo: this.changePasswordForm.controls.code.value

    };

    this.userService.updatePassword(updatePassword).subscribe(
      data => {
        this.showSuccessUpdatedMessage = true;
        this.isLoading = false;
        setTimeout(() => {
          window.location.reload()
        }, 4000);

      },
      err => {

        if (err.error) {
          this.buildMessage('Código inválido', 1);
        }
        this.showHeader = false;
        this.isLoading = false;
        this.showChangePasswordForm = true;
        this.showWrongCodeHeader = true;
      }
    )
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
