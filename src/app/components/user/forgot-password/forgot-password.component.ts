import { Component, OnInit } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Funcionario } from 'src/app/models/funcionario';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  faCheck = faCheck;
  userForm: FormGroup;
  changePasswordForm: FormGroup;
  showUserForm: boolean = true;
  loadingEmail: boolean;
  showChangePasswordForm: boolean;
  userLoginInformations;
  codeDataBase: string;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private funcionarioService: FuncionarioService,
    private userService: UserService,
    private router: Router,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.createform();
  }

  createform() {
    this.userForm = this.fb.group({
      cpf: ['', Validators.required],
    });

    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],

      code: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  verifyUser() {
    this.showUserForm = false;
    this.loadingEmail = true;
    this.funcionarioService
      .recoverPassword(this.userForm.controls.cpf.value)
      .subscribe((res) => {
        if (res.status === 204) {
          this.buildMessage('Esse CPF não possui acesso ao SISMED', 1);
          this.loadingEmail = false;
          this.showUserForm = true;
        } else if (res.status === 404) {
          this.buildMessage('Erro ao tentar verificar o CPF', 1);
          this.loadingEmail = false;
          this.showChangePasswordForm = true;
        } else {
          this.loadingEmail = false;
          this.showChangePasswordForm = true;

          this.userLoginInformations = {
            id: res.body['id'],
            username: res.body['username'],
          };
        }
      });
  }

  updatePassword() {
    this.funcionarioService
      .getVerificarionCode(this.userLoginInformations.username)
      .subscribe(
        (data) => {
          if (data.code === this.changePasswordForm.controls.code.value) {
            const user = {
              username: this.userLoginInformations.username,
              password: this.changePasswordForm.controls.password.value,
            };
            this.userService
              .updatePassword(this.userLoginInformations.id, user)
              .subscribe(
                (data) => {
                  this.buildMessage('senha atualizada com sucesso', 0);
                  setTimeout(() => {
                    this.appComponent.changePassword = false;
                    this.router.navigate(['/']);
                  }, 4000);
                },
                (error) => {
                  console.log(error);
                  this.buildMessage('Erro ao tentar redefinir a senha', 1);
                }
              );
          } else {
            this.buildMessage('Código informado inválido', 1);
          }
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar atualizar a senha', 1);
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
