import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/token-storage-service.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formUser: FormGroup;

  isLoading: boolean;

  loadingDataMessage: string;

  isLogin = true;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formUser = this.fb.group({
      cpf: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  // função responsavel por realizar o login;
  login() {
    this.isLoading = true;
    this.loadingDataMessage = 'Verificando credenciais';
    this.userService.login(this.formUser.value).subscribe(
      (data) => {
        const user = {
          id: data.id,
          perfil: data.perfil,
          nome: data.nome,
          cpf: data.cpf,
        };
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(user);
        this.reloadPage();

      },
      (error) => {
        if (error.status === 401) {
          this.buildMessage('Esse CPF não possui acesso ao SISMED', 1);
        } else {
          this.buildMessage('Erro ao tentar verificar o CPF', 1);
        }
        this.isLoading = false;
      }
    );
  }

  changePassword() {
    this.isLogin = false;

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

  reloadPage(): void {
    window.location.reload();
  }
}
