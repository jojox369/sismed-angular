import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {

  formUser: FormGroup;



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
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // função responsavel por realizar o login;
  login() {

    this.userService.login(this.formUser.value).subscribe(
      data => {
        const token = data.token;
        // pega o token da resposta e coloca na variavel token do service
        sessionStorage.setItem('token', 'Token ' + token);
        this.userService.createSession(this.formUser.controls.username.value).subscribe(
          data => {
            const user = { id: data[0].id, perfil: data[0].perfil, nome: data[0].nome, cpf: data[0].cpf }
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('logged', 'true');
            this.appComponent.verifyLogged();
            this.router.navigate(['/']);

          },
          error => {
            console.log(error);
          }
        );
      },
      error => {
        this.buildMessage('Usuário e senha inválidos', 1);
      }
    )
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
