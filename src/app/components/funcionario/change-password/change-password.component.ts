import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  passwordControl;

  repeatPasswordControl;

  faCheck = faCheck;

  faTimes = faTimes;

  isLoading: boolean;

  loadingDataMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public cpf: string,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  changePassword() {
    this.isLoading = true;
    this.loadingDataMessage = 'Atualizando sua senha';
    if (this.passwordControl !== this.repeatPasswordControl) {
      this.buildMessage('Senha não são iguais', 1);
      this.isLoading = false;
    } else {
      this.userService.getUsers().subscribe(
        (data) => {
          for (const user of data) {
            if (user.username === this.cpf) {
              const userUpdated = {
                username: this.cpf,
                password: this.passwordControl,
              };
              this.userService.updatePassword(user.id, userUpdated).subscribe(
                (data) => {
                  this.buildMessage('Senha atualizada com sucesso', 0);
                  this.dialog.closeAll();
                },
                (error) => {
                  this.buildMessage('Erro ao tentar atualizar a senha', 1);
                }
              );
            }
          }
        },
        (error) => {
          this.buildMessage('Erro ao tentar atualizar a senha', 1);
        }
      );
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
