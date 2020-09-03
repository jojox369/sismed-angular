import { Component, OnInit, Inject } from '@angular/core';
import { FuncionarioTipoConvenioService } from 'src/app/services/funcionario-tipo-convenio.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { faTimes, faList } from '@fortawesome/free-solid-svg-icons';
import { Convenio } from 'src/app/models/convenio';

@Component({
  selector: 'app-funcionario-tipo-convenio-list',
  templateUrl: './funcionario-tipo-convenio-list.component.html',
  styleUrls: ['./funcionario-tipo-convenio-list.component.css'],
})
export class FuncionarioTipoConvenioListComponent implements OnInit {
  faTimes = faTimes;

  faList = faList;

  convenios: Convenio[];

  tipos: [{ id: number; nome: string }];

  hasTipos: boolean;

  isLoading: boolean;

  loadingDataMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public funcionario: { id: string; nome: string },
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private funcionarioTipoConvenioService: FuncionarioTipoConvenioService
  ) {}

  ngOnInit(): void {
    this.getConvenios();
  }

  getConvenios() {
    this.funcionarioTipoConvenioService
      .getAcceptedConvenios(this.funcionario.id)
      .subscribe(
        (data) => {
          this.convenios = data;
        },
        (error) => {
          console.log(error);
          this.buildMessage(
            'Erro ao tentar recuperar a lista de convênios aceitos pelo médico',
            1
          );
        }
      );
  }

  getTipos(convenioId) {
    this.tipos = [{ id: 0, nome: '' }];
    this.isLoading = true;
    this.loadingDataMessage = 'Carregando dados ...';
    this.funcionarioTipoConvenioService
      .getAcceptedTipos(this.funcionario.id, convenioId)
      .subscribe(
        (data) => {
          this.tipos = data;
          this.hasTipos = true;
        },
        (error) => {
          console.log(error);
          this.buildMessage(
            'Erro ao tentar recuperar a lista de plano aceitos',
            1
          );
        }
      );
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
