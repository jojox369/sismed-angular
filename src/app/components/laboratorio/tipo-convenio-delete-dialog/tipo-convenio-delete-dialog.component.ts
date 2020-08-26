import { Component, OnInit, Inject } from '@angular/core';
import { LaboratorioTipoConvenioService } from 'src/app/services/laboratorio-tipo-convenio.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Convenio } from 'src/app/models/convenio';
import { faBan, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tipo-convenio-delete-dialog',
  templateUrl: './tipo-convenio-delete-dialog.component.html',
  styleUrls: ['./tipo-convenio-delete-dialog.component.css']
})
export class TipoConvenioDeleteDialogComponent implements OnInit {

  faBan = faBan;

  faCheck = faCheck;

  faTimes = faTimes;

  convenios: Convenio[];

  convenioSelected;

  allSelected: boolean = false;

  // Recebe as informações dos tipos de convenio
  tipos = [{ id: '', nome: '', selected: false }];

  hasData = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public laboratorioId: string,
    private laboratorioTipoConvenioService: LaboratorioTipoConvenioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }



  ngOnInit(): void {
    this.getConvenios();

  }

  getConvenios() {
    this.laboratorioTipoConvenioService.getAcceptedConvenios(this.laboratorioId).subscribe(
      data => {
        this.convenios = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getTipos() {
    this.laboratorioTipoConvenioService.getTiposAccepted(this.laboratorioId, this.convenioSelected).subscribe(
      data => {
        this.tipos = data;
        this.hasData = true;
      },
      error => {
        console.log(error);
      }
    );
  }

  selectedAll() {
    if (this.allSelected) {
      this.allSelected = false;
      this.tipos.forEach(element => {
        element.selected = false;
      });

    } else {
      this.allSelected = true;
      this.tipos.forEach(element => {
        element.selected = true;
      });
    }
  }

  someComplete() {
    if (this.tipos == null) {
      return false;
    }
    return this.tipos.filter(t => t.selected).length > 0 && !this.allSelected;
  }

  delete() {
    const tiposSelected = this.tipos.filter((ch) => {
      return ch.selected;
    }).map((ch) => {
      return ch.id;
    });

    for (const tipo of tiposSelected) {
      this.laboratorioTipoConvenioService.getLabTaconvenioDetails(this.laboratorioId, tipo).subscribe(
        data => {
          const id = data[0].id;
          this.laboratorioTipoConvenioService.delete(id).subscribe(
            data => {
              this.buildMessage('Convênio cadastrado com sucesso', 0);
              this.dialog.closeAll();

            },
            error => {
              console.log(error);
              this.buildMessage('Erro ao tentar cadastrar o convênio', 1)
            }
          );
        }
      );
    }
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
