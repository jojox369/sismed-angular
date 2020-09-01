import { Component, OnInit } from '@angular/core';
import {
  faHome,
  faCalendarAlt,
  faUser,
  faUserMd,
  faNotesMedical,
  faVial,
  faBriefcaseMedical,
  faFileMedical,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { UserDialogComponent } from '../../user/user-dialog/user-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  navLinks = [];

  user = JSON.parse(sessionStorage.getItem('user'));
  activeLink;
  date: String;
  clock: string;
  faUserCircle = faUserCircle;
  currentUrl;
  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDate();
    this.getTime();
    this.getUrl();
    this.pushData();
  }

  pushData() {
    this.navLinks.push(
      {
        path: '/home',
        label: 'Inicio',
        icon: faHome,
        title: 'Pagina Inicial',
      },
      {
        path: '/agenda',
        label: 'Agenda',
        icon: faCalendarAlt,
        title: 'Abrir Agenda',
      },
      {
        path: '/pacientes',
        label: 'Pacientes',
        icon: faUser,
        title: 'Listar Pacientes',
      },
      {
        path: '/funcionarios',
        label: 'Funcionarios',
        icon: faUserMd,
        title: 'Listar Funcionarios',
      },
      {
        path: '/convenios',
        label: 'Convenios',
        icon: faNotesMedical,
        title: 'Listar Convenios',
        routers: ['convenio', 'convenios'],
      }
    );

    if (this.user.perfil !== 2) {
      this.navLinks.push({
        path: '/registroclinico',
        label: 'Regsitros Clínicos',
        icon: faFileMedical,
        title: 'Listar Registros Clinícos',
      });
    }

    this.navLinks.push(
      {
        path: '/laboratorios',
        label: 'Laboratórios',
        icon: faVial,
        title: 'Listar Laboratórios',
      },
      {
        path: '/exames',
        label: 'Exames',
        icon: faBriefcaseMedical,
        title: 'Listar exames',
      }
    );
  }

  // função para montar a data
  getDate() {
    const currentDate = new Date();
    const currentDay = currentDate.getUTCDate();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentYear = currentDate.getUTCFullYear();
    let month;
    let day;
    if (currentMonth === 1) {
      month = 'Janeiro';
    }
    if (currentMonth === 2) {
      month = 'Fevereiro';
    }
    if (currentMonth === 3) {
      month = 'Março';
    }
    if (currentMonth === 4) {
      month = 'Abril';
    }
    if (currentMonth === 5) {
      month = 'Maio';
    }
    if (currentMonth === 6) {
      month = 'Junho';
    }
    if (currentMonth === 7) {
      month = 'Julho';
    }
    if (currentMonth === 8) {
      month = 'Agosto';
    }
    if (currentMonth === 9) {
      month = 'Setembro';
    }
    if (currentMonth === 10) {
      month = 'Outubro';
    }
    if (currentMonth === 11) {
      month = 'Novembro';
    }
    if (currentMonth === 12) {
      month = 'Dezembro';
    }

    if (currentDay < 10) {
      day = '0' + currentDay;
    } else {
      day = currentDay;
    }
    this.date = day + ' de ' + month + ' de ' + currentYear;
  }

  // função para montar o relogio
  getTime() {
    setInterval(() => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();
      let hour;
      let minutes;
      let seconds;

      if (currentHour < 10) {
        hour = '0' + currentHour;
      } else {
        hour = currentHour;
      }

      if (currentMinutes < 10) {
        minutes = '0' + currentMinutes;
      } else {
        minutes = currentMinutes;
      }

      if (currentSeconds < 10) {
        seconds = '0' + currentSeconds;
      } else {
        seconds = currentSeconds;
      }

      this.clock = hour + ':' + minutes + ':' + seconds;
    }, 1000);
  }

  // função pra saber qual url está ativa
  getUrl() {
    this.router.events.subscribe((url: any) => {
      if (url.url !== undefined) {
        this.currentUrl = url.url;
      }
      for (const link of this.navLinks) {
        /*FAZER ISSO PARA TODAS AS ROTAS!
          TENTAR USAR REGEX
        */
        if (
          this.currentUrl.includes('/agenda') ||
          this.currentUrl.includes('agenda/')
        ) {
          this.activeLink = this.navLinks[1];
        } else if (
          this.currentUrl.includes('/pacientes') ||
          this.currentUrl.includes('paciente/')
        ) {
          this.activeLink = this.navLinks[2];
        } else if (
          this.currentUrl.includes('/funcionarios') ||
          this.currentUrl.includes('funcionario/')
        ) {
          this.activeLink = this.navLinks[3];
        } else if (
          this.currentUrl.includes('/convenios') ||
          this.currentUrl.includes('convenio/') ||
          this.currentUrl.includes('tiposConvenio/') ||
          this.currentUrl.includes('tipoConvenio/') ||
          this.currentUrl.includes('procedimento/') ||
          this.currentUrl.includes('procedimentos/')
        ) {
          this.activeLink = this.navLinks[4];
        } else if (
          this.currentUrl.includes('/registroclinico') ||
          this.currentUrl.includes('registroclinico/')
        ) {
          if (this.user.perfil === 2) {
            this.router.navigate(['access-denied']);
          } else {
            this.activeLink = this.navLinks[5];
          }
        } else if (
          this.currentUrl.includes('/laboratorios') ||
          this.currentUrl.includes('laboratorio/')
        ) {
          this.activeLink = this.navLinks[6];
        } else if (
          this.currentUrl.includes('/exames') ||
          this.currentUrl.includes('exame/')
        ) {
          this.activeLink = this.navLinks[7];
        } else if (
          this.currentUrl.includes('/backup') ||
          this.currentUrl.includes('/relatorio') ||
          this.currentUrl.includes('/log') ||
          this.currentUrl.includes('/access-denied') ||
          this.currentUrl.includes('/error')
        ) {
          this.activeLink = undefined;
        } else {
          this.activeLink = this.navLinks[0];
        }
      }
    });
  }

  openUserDialog() {
    const dialogPosition: DialogPosition = {
      top: '75px',
      right: '0',
    };

    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '550px',
      position: dialogPosition,
    });
  }
}
