import { Component, OnInit, Inject } from '@angular/core';
import {
  faBan,
  faCheck,
  faTimes,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Convenio } from 'src/app/models/convenio';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FuncionarioTipoConvenioService } from 'src/app/services/funcionario-tipo-convenio.service';

interface TiposConvenio {
  id: number;
  nome: string;
  selected: boolean;
}

@Component({
  selector: 'app-funcionario-tipo-convenio-register',
  templateUrl: './funcionario-tipo-convenio-register.component.html',
  styleUrls: ['./funcionario-tipo-convenio-register.component.css'],
})
export class FuncionarioTipoConvenioRegisterComponent implements OnInit {
  faBan = faBan;

  faCheck = faCheck;

  faTimes = faTimes;

  faPlus = faPlus;

  convenios: Convenio[];

  convenioSelected: number = 0;

  allSelected: boolean = false;

  showSelect: boolean = true;

  responseError = true;

  isLoading: boolean;

  loadingDataMessage: string;

  awaitResponse: boolean;

  showLoadingData: boolean;

  showNewOperationButton: boolean;

  // Recebe as informações dos tipos de convenio
  tipos: TiposConvenio[];

  hasData = false;

  tablesSelectedNames = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public funcionarioId: string,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private funcionarioTipoConvenioService: FuncionarioTipoConvenioService
  ) { }

  ngOnInit(): void {
    this.getConvenios();
  }

  getConvenios() {
    this.funcionarioTipoConvenioService
      .getUnAccpetedConvenios(this.funcionarioId)
      .subscribe(
        (data) => {
          this.convenios = data;
        },
        (error) => {
          this.buildMessage('Erro ao tentar carregar a lista de convênios', 1);
        }
      );
  }

  getTipos() {
    this.isLoading = true;
    if (this.hasData) {
      this.hasData = false;
    }
    this.loadingDataMessage = 'Carregando os planos disponíveis';
    this.funcionarioTipoConvenioService
      .getUnresgisteredTiposConveio(this.funcionarioId, this.convenioSelected)
      .subscribe(
        (data) => {
          this.tipos = data;
          this.hasData = true;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.buildMessage('Erro ao tentar recuperar a lista de planos', 1);
        }
      );
  }

  selectedAll() {
    if (this.allSelected) {
      this.allSelected = false;
      this.tipos.forEach((element) => {
        element.selected = false;
      });
    } else {
      this.allSelected = true;
      this.tipos.forEach((element) => {
        element.selected = true;
      });
    }
  }

  someComplete() {
    if (this.tipos == null) {
      return false;
    }
    return this.tipos.filter((t) => t.selected).length > 0 && !this.allSelected;
  }

  save() {
    this.awaitResponse = true;
    this.showLoadingData = true;
    this.hasData = false;
    this.showSelect = false;
    this.loadingDataMessage = 'Cadastrando planos';

    const tiposSelected = this.tipos
      .filter((tipo) => {
        return tipo.selected;
      })
      .map((tipo) => {
        return { tipoConvenioId: tipo.id, funcionarioId: parseInt(this.funcionarioId) };
      });

    this.funcionarioTipoConvenioService
      .saveTiposFuncionario(tiposSelected)
      .subscribe(
        (data) => {
          this.awaitResponse = false;
          this.showNewOperationButton = true;
          this.responseError = false;
        },
        (error) => {
          this.responseError = true;
          this.showNewOperationButton = true;
        }
      );


  }

  newOperation() {
    this.getConvenios();
    this.tablesSelectedNames = [];
    this.tipos = undefined;
    this.showSelect = true;
    this.allSelected = false;
    this.showLoadingData = false;
    this.convenioSelected = 0;
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
