import { Component, OnInit, Inject } from '@angular/core';
import { faBan, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Convenio } from 'src/app/models/convenio';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FuncionarioTipoConvenioService } from 'src/app/services/funcionario-tipo-convenio.service';

@Component({
  selector: 'app-funcionario-tipo-convenio-delete',
  templateUrl: './funcionario-tipo-convenio-delete.component.html',
  styleUrls: ['./funcionario-tipo-convenio-delete.component.css']
})
export class FuncionarioTipoConvenioDeleteComponent implements OnInit {
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
    this.funcionarioTipoConvenioService.getAcceptedConvenios(this.funcionarioId).subscribe(
      data => {
        this.convenios = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getTipos() {
    this.funcionarioTipoConvenioService.getAcceptedTipos(this.funcionarioId, this.convenioSelected).subscribe(
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

  updateAllComplete() {
    this.allSelected = this.tipos.every(e => e.selected);
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

    /*
      Como não consegui sobresvecer o metodo delete no django, eu criei uma url e uma view que me retornasse o objeto que eu quero excluir
      Assim, eu recupero os id's dos tipos de convenio dentro do for, dai passo o id do funcionario e o id do tipo para o metodo que me
      retorna uma lista
      com o objeto que eu quero excluir dentro(não consegui fazer retornar o objeto puro)
      Então, para cada id na variavel tiposSelected, eu tenho que fazer uma requisição para buscar o objeto,
      para eu poder ter o id do objeto,para entãopassar para o metodo de exclusao de tipo*/

    for (const tipo of tiposSelected) {
      this.funcionarioTipoConvenioService.getFuncionarioTipoDetail(this.funcionarioId, tipo).subscribe(
        data => {
          const id = data[0].id;
          this.funcionarioTipoConvenioService.deleteTiposFuncionario(id).subscribe(
            data => {
              this.buildMessage('Tipos de Convenio excluido com sucesso', 0);
              this.dialog.closeAll();
            },
            error => {
              this.buildMessage('Erro ao tentar excluir tipo de convenio', 1);
            }
          );
        },
        error => {
          console.log(error);
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

  /*
  deleteTipos() {
    const tiposSelected = this.acceptedTipos.filter((ch) => {
      return ch.selected;
    }).map((ch) => {
      return ch.id;
    });

    const funcionarioTipos = { funcionario: this.funcionarioId, tipo_convenio: '' };
    /*
      Como não consegui sobresvecer o metodo delete no django, eu criei uma url e uma view que me retornasse o objeto que eu quero excluir
      Assim, eu recupero os id's dos tipos de convenio dentro do for, dai passo o id do funcionario e o id do tipo para o metodo que me
      retorna uma lista
      com o objeto que eu quero excluir dentro(não consegui fazer retornar o objeto puro)
      Então, para cada id na variavel tiposSelected, eu tenho que fazer uma requisição para buscar o objeto,
      para eu poder ter o id do objeto,para entãopassar para o metodo de exclusao de tipo
    
   for (const tipos of tiposSelected) {
    this.funcionarioTipoConvenioService.getFuncionarioTipoDetail(this.funcionarioId, tipos).subscribe(
      data => {
        const id = data[0].id;
        this.funcionarioTipoConvenioService.deleteTiposFuncionario(id).subscribe(
          data => {
            this.buildMessage('Tipos de Convenio excluido com sucesso', 1);

          },
          error => {
            this.buildMessage('Erro ao tentar excluir tipo de convenio', 0);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }
}*/
}
