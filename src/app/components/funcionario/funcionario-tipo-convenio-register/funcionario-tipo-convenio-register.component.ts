import { Component, OnInit, Inject } from '@angular/core';
import { faBan, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Convenio } from 'src/app/models/convenio';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FuncionarioTipoConvenioService } from 'src/app/services/funcionario-tipo-convenio.service';

@Component({
  selector: 'app-funcionario-tipo-convenio-register',
  templateUrl: './funcionario-tipo-convenio-register.component.html',
  styleUrls: ['./funcionario-tipo-convenio-register.component.css']
})
export class FuncionarioTipoConvenioRegisterComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA) public funcionarioId: string,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private funcionarioTipoConvenioService: FuncionarioTipoConvenioService
  ) { }

  ngOnInit(): void {
    this.getConvenios();
  }

  getConvenios() {
    this.funcionarioTipoConvenioService.getUnAccpetedConvenios(this.funcionarioId).subscribe(
      data => {
        this.convenios = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getTipos() {
    this.funcionarioTipoConvenioService.getUnresgisteredTiposConveio(this.funcionarioId, this.convenioSelected).subscribe(
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

  save() {

    const tiposSelected = this.tipos.filter((ch) => {
      return ch.selected;
    }).map((ch) => {
      return ch.id;
    });



    const funcionarioTipos = { funcionario: this.funcionarioId, tipo_convenio: '' };

    for (const tipos of tiposSelected) {
      funcionarioTipos.tipo_convenio = tipos;

      this.funcionarioTipoConvenioService.saveTiposFuncionario(funcionarioTipos).subscribe(
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
