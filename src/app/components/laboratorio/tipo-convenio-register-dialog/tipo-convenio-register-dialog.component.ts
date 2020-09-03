import { Component, OnInit, Inject } from '@angular/core';
import { LaboratorioTipoConvenioService } from 'src/app/services/laboratorio-tipo-convenio.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Convenio } from 'src/app/models/convenio';
import {
  faBan,
  faCheck,
  faTimes,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tipo-convenio-register-dialog',
  templateUrl: './tipo-convenio-register-dialog.component.html',
  styleUrls: ['./tipo-convenio-register-dialog.component.css'],
})
export class TipoConvenioRegisterDialogComponent implements OnInit {
  faBan = faBan;

  faCheck = faCheck;

  faTimes = faTimes;

  faPlus = faPlus;

  convenios: Convenio[];

  convenioSelected;

  allSelected: boolean = false;

  // Recebe as informações dos tipos de convenio
  tipos = [{ id: '', nome: '', selected: false }];

  hasData = false;

  isLoading: boolean;

  loadingDataMessage: string;

  awaitResponse: boolean;

  showLoadingData: boolean;

  showNewOperationButton: boolean;

  showSelect: boolean = true;

  tablesSelectedNames = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public laboratorioId: string,
    private laboratorioTipoConvenioService: LaboratorioTipoConvenioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getConvenios();
  }

  getConvenios() {
    this.laboratorioTipoConvenioService
      .getUnAcceptedConvenios(this.laboratorioId)
      .subscribe(
        (data) => {
          this.convenios = data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getTipos() {
    this.isLoading = true;
    if (this.hasData) {
      this.hasData = false;
    }
    this.loadingDataMessage = 'Carregando os planos disponíveis';
    this.laboratorioTipoConvenioService
      .getTiposUnAccepted(this.laboratorioId, this.convenioSelected)
      .subscribe(
        (data) => {
          this.tipos = data;
          this.hasData = true;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
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

    const tiposSelected = this.tipos
      .filter((tipo) => {
        return tipo.selected;
      })
      .map((tipo) => {
        return { id: tipo.id, nome: tipo.nome, hasError: false };
      });

    const laboratorioTipos = {
      laboratorio: this.laboratorioId,
      tipo_convenio: '',
    };

    let count = 0;

    for (const tipo of tiposSelected) {
      this.tablesSelectedNames.push(tipo);
      laboratorioTipos.tipo_convenio = tipo.id;
      this.laboratorioTipoConvenioService.save(laboratorioTipos).subscribe(
        (data) => {
          count++;
          this.awaitResponse = false;
          if (count === tiposSelected.length) {
            this.showNewOperationButton = true;
          }
        },
        (error) => {
          tipo.hasError = true;
          this.showNewOperationButton = true;
        }
      );
    }
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
