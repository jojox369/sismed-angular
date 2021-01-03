import { Component, OnInit } from '@angular/core';
import { faUserCircle, faIdCard, faScroll, faStream, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { TokenStorageService } from 'src/app/services/token-storage-service.service';

interface User {
  id: number;
  perfil: number;
  nome: string;
  cpf: string;
}


@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {

  faUserCircle = faUserCircle;

  faIdCard = faIdCard;

  faScroll = faScroll;

  faStream = faStream

  faDataBase = faDatabase;

  user: User = JSON.parse(sessionStorage.getItem('user'));

  userName;

  userFunction;
  constructor(
    private tokenStorage: TokenStorageService

  ) { }

  ngOnInit(): void {
    this.formatName();
    this.verifyFunction();
  }

  verifyFunction() {
    if (this.user.perfil === 1) {
      this.userFunction = 'Médico';
    } else if (this.user.perfil === 2) {
      this.userFunction = 'Funcionário';
    } else {
      this.userFunction = 'Administrador'
    }
  }

  formatName() {
    const arrayName = this.user.nome.split(' ', 2);
    this.userName = arrayName[0] + ' ' + arrayName[1];
  }

  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }

}
