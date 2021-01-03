import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FuncionarioService } from 'src/app/services/funcionario.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  passwordControl = new FormControl();

  repeatPasswordControl = new FormControl();

  faCheck = faCheck;

  faTimes = faTimes;

  isLoading: boolean;

  buttonDislabed = true;

  loadingDataMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private snackBar: MatSnackBar,
    private funcionarioService: FuncionarioService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  verifyPasswords() {
    if (this.passwordControl.value && this.repeatPasswordControl.value) {
      this.buttonDislabed = false;
    }
    if (this.passwordControl.value != this.repeatPasswordControl.value || !this.passwordControl.value || !this.repeatPasswordControl.value) {
      this.buttonDislabed = true;
    } else {
      this.buttonDislabed = false;
    }

  }
  onChooseSearchMethod(value: any): any {
    throw new Error('Method not implemented.');
  }

  changePassword() {
    this.isLoading = true;
    this.loadingDataMessage = 'Atualizando sua senha';
    const data = { id: this.id, senha: this.passwordControl.value }

    this.funcionarioService.updatePassword(data).subscribe(
      data => {
        this.buildMessage('Senha atualizada com sucesso', 0);
        this.dialog.closeAll();
      },
      error => {
        this.buildMessage('Erro ao tentar atualizar a senha', 1);

      }
    )

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
