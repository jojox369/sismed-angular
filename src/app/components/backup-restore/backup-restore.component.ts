import { Component, OnInit } from '@angular/core';
import {
  faFileDownload,
  faFileUpload,
  faCheck,
  faTimes,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import { BackupService } from 'src/app/services/backup.service';
import { RestoreService } from 'src/app/services/restore.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { LogSave } from 'src/app/models/log';
import { LogService } from 'src/app/services/log.service';
import { Router } from '@angular/router';

interface Table {
  id: string;
  nome: string;
  hasError: boolean;
}

@Component({
  selector: 'app-backup-restore',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.css'],
})
export class BackupRestoreComponent implements OnInit {
  // guarda as informações da tabela
  tables = [];
  tablesSelectedNames = [];
  allSelected: boolean = false;
  showTables: boolean = false;
  showRestoreDate: boolean = false;
  showLoadingData: boolean = false;
  showOptions: boolean = true;
  awaitResponse: boolean = false;
  showNewOperationButton: boolean = false;
  faFileDownload = faFileDownload;
  faFileUpload = faFileUpload;
  restoreDateControl = new FormControl('', Validators.required);
  actionControl = new FormControl('', Validators.required);
  todayDate;
  faCheck = faCheck;
  faTimes = faTimes;
  faDataBase = faDatabase;
  log: LogSave;
  user = JSON.parse(sessionStorage.getItem('user'));
  action: string;

  constructor(
    private backupService: BackupService,
    private restoreService: RestoreService,
    private logService: LogService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.user.perfil === 3) {
      this.getTables();
    } else {
      this.router.navigate(['access-denied']);
    }
  }

  selectedAll() {
    if (this.allSelected) {
      this.allSelected = false;
      this.tables.forEach((element) => {
        element.selected = false;
      });
    } else {
      this.allSelected = true;
      this.tables.forEach((element) => {
        element.selected = true;
      });
    }
  }

  someComplete() {
    if (this.tables == null) {
      return false;
    }
    return (
      this.tables.filter((t) => t.selected).length > 0 && !this.allSelected
    );
  }

  getTables() {
    this.tables.push({ id: 'SismedAgenda', nome: 'Agenda', selected: false });
    this.tables.push({
      id: 'SismedPaciente',
      nome: 'Paciênte',
      selected: false,
    });
    this.tables.push({
      id: 'SismedFuncionario',
      nome: 'Funcionário',
      selected: false,
    });
    this.tables.push({
      id: 'SismedConvenio',
      nome: 'Convênio',
      selected: false,
    });
    this.tables.push({
      id: 'SismedTipoConvenio',
      nome: 'Tipo de Convenio',
      selected: false,
    });
    this.tables.push({
      id: 'SismedProcedimento',
      nome: 'Procedimento',
      selected: false,
    });
    this.tables.push({
      id: 'SismedRegistroClinico',
      nome: 'Registro Cliníco',
      selected: false,
    });
    this.tables.push({
      id: 'SismedLaboratorio',
      nome: 'Laboratorios',
      selected: false,
    });
    this.tables.push({ id: 'SismedExame', nome: 'Exame', selected: false });
    this.tables.push({
      id: 'SismedLog',
      nome: 'Registro de Evento',
      selected: false,
    });
  }

  selectedOpition() {
    this.showRestoreDate = false;
    if (this.actionControl.value === 1) {
      this.showTables = true;
      this.action = 'REALIZAR CÓPIA DE SEGURANÇA';
    } else {
      this.showTables = true;
      this.showRestoreDate = true;
      const todayDateArray = new Date().toLocaleDateString().split('/');
      this.todayDate =
        todayDateArray[2] + '-' + todayDateArray[1] + '-' + todayDateArray[0];
      this.restoreDateControl.setValue(this.todayDate);
      this.action = 'RESTAURAR DADOS';
    }
  }

  generate() {
    this.showOptions = false;
    this.showLoadingData = true;
    this.showTables = false;
    this.showRestoreDate = false;
    this.awaitResponse = true;
    this.allSelected = false;

    let count = 0;
    const tablesSelected = this.tables
      .filter((ch) => {
        return ch.selected;
      })
      .map((ch) => {
        return { id: ch.id, nome: ch.nome, hasError: false };
      });

    for (const table of tablesSelected) {
      this.tablesSelectedNames.push(table);
      if (this.actionControl.value === 1) {
        this.action = 'REALIZANDO CÓPIA DE SEGURANÇA';
        this.backupService.generateBackup(table.id).subscribe(
          (data) => {
            count++;
            this.awaitResponse = false;
            if (data['response'] === '1') {
              table.hasError = true;
            }
            if (count === tablesSelected.length) {
              this.showNewOperationButton = true;
              this.generateLog('BACKUP MANUAL', tablesSelected);
            }
          },
          (error) => {
            this.showNewOperationButton = true;
            this.buildMessage('Erro ao tentar realizar o backup', 1);
          }
        );
      } else {
        this.action = 'RESTAURANDO DADOS';
        this.restoreService
          .restoreTables(table.id, this.restoreDateControl.value)
          .subscribe(
            (data) => {
              count++;
              this.awaitResponse = false;
              if (data['response'] === '1') {
                table.hasError = true;
              }
              if (count === tablesSelected.length) {
                this.generateLog('BACKUP MANUAL', tablesSelected);
              }
            },
            (error) => {
              this.showNewOperationButton = true;
              this.buildMessage('Erro ao tentar realizar o restore', 1);
            }
          );
      }
    }
  }
  getDate(): string {
    const todayDate = new Date().toLocaleDateString().split('/');
    return todayDate[2] + '-' + todayDate[1] + '-' + todayDate[0];
  }

  generateLog(eventType: string, tablesSelected: Table[]) {
    const tablesSuccessful = tablesSelected
      .filter((t) => {
        return !t.hasError;
      })
      .map((table) => {
        return ' ' + table.nome.toUpperCase();
      });
    this.log = new LogSave();
    this.log.data = this.getDate();
    this.log.hora = new Date().toLocaleTimeString();
    this.log.funcionario = this.user.id;
    this.log.evento = eventType;
    this.log.descricao =
      'REALIZADO ' + eventType + ' DAS TABELAS ' + tablesSuccessful.toString();
    this.logService.save(this.log).subscribe(
      (data) => {
        this.showNewOperationButton = true;
      },
      (error) => {
        this.showNewOperationButton = true;

        this.buildMessage('Erro ao tentar salvar o registro de evento', 1);
      }
    );
  }

  resetPage() {
    this.showOptions = true;
    this.showRestoreDate = false;
    this.showNewOperationButton = false;
    this.showLoadingData = false;
    this.tablesSelectedNames = [];
    this.actionControl.reset();
    this.tables.forEach((element) => {
      element.selected = false;
    });
    this.action = 'REALIZAR CÓPIA DE SEGURANÇA | RESTAURAR DADOS';
  }

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
