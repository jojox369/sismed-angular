import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private appComponent: AppComponent,
    private router: Router,
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
        this.buildMessage('Usuário e senha inválidos', 1);
        this.isLoading = false;
      }
    );
  }

  changePassword() {
    this.appComponent.changePassword = true;
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
