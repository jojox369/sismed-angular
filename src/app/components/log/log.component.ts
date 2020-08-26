import { Component, OnInit, ViewChild } from '@angular/core';
import { Log } from 'src/app/models/log';
import { MatPaginator } from '@angular/material/paginator';
import { LogService } from 'src/app/services/log.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {


  // Controla a progress spiner e a aparição da lista
  isLoading = true;

  // Variavel de controle da tabela para a exibição de dados
  logIsEmpty = true;

  // Variavel que controla a mensagem de erro 
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  user = JSON.parse(sessionStorage.getItem('user'));

  logs: Log[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['data', 'hora', 'funcionario', 'evento', 'detalhes'];

  constructor(
    private logService: LogService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.user.perfil === 3) {
      this.getLogs();
    } else {
      this.router.navigate(['access-denied']);

    }
  }




  getLogs() {
    this.logService.getLogs().subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.isLoading = false;
          this.logIsEmpty = true;
          this.showEmptyMessage = true;
        }
        else {
          this.logs = data;
          this.buildTable();
          this.isLoading = false;
          this.convertTime();
          this.logIsEmpty = false;
        }

      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.hasError = true;
        this.buildMessage('Erro ao tentar carregar a lista', 1);
      }
    )
  }

  openDetailsDialog(details: string) {
    const dialogRef = this.dialog.open(DetailsDialogComponent, {
      height: '350px',
      width: '500px',
      data: details
    });
  }

  // monta a lista de convenio
  buildTable() {
    this.dataSource = new MatTableDataSource(this.logs);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }


  convertTime() {
    for (let log of this.logs) {
      let arrayTime = log.hora.split(":", 2)
      log.hora = arrayTime[0] + ":" + arrayTime[1];
    }
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
