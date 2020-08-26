import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import {
  faCalendarAlt, faUser, faUserMd, faNotesMedical, faVial, faBriefcaseMedical, faStream, faScroll, faFileDownload,
  faFileUpload, faHome, faFileMedical
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SISMED';
  faHome = faHome;
  faCalendarAlt = faCalendarAlt;
  faUser = faUser;
  faUserMd = faUserMd;
  faNotesMedical = faNotesMedical;
  faVial = faVial;
  faBriefcaseMedical = faBriefcaseMedical;
  faStream = faStream;
  faScroll = faScroll;
  faFileDownload = faFileDownload;
  faFileUpload = faFileUpload;
  faFileMedical = faFileMedical;

  // Variavel que informa se tem um usuario logado ou não;
  logged: boolean;

  changePassword: boolean;


  public showOverlay: boolean = true;

  constructor(
  ) {

  }
  ngOnInit(): void {
    this.verifyLogged();
  }


  destroySession() {

    this.verifyLogged();
  }

  verifyLogged() {
    const logged = sessionStorage.getItem('logged');
    if (logged === 'true') {
      this.logged = true;
    } else {
      this.logged = false;
    }
  }





}
