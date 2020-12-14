import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    private snackBar: MatSnackBar
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
        console.log(data);
        const token = data.token;
        // pega o token da resposta e coloca na variavel token do service
        sessionStorage.setItem('token', token);
        const user = {
          id: data.id,
          perfil: data.perfil,
          nome: data.nome,
          cpf: data.cpf,
        };
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('logged', 'true');
        this.appComponent.verifyLogged();
        this.router.navigate(['/home']);

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
