import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { faSearch, faPlus, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Registroclinico } from 'src/app/models/registroclinico';
import { RegistroclinicoService } from 'src/app/services/registroclinico.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RegistroClinicoPacienteListAllComponent } from '../registro-clinico-paciente-list-all/registro-clinico-paciente-list-all.component';

@Component({
  selector: 'app-registro-clinico-list',
  templateUrl: './registro-clinico-list.component.html',
  styleUrls: ['./registro-clinico-list.component.css']
})
export class RegistroClinicoListComponent implements OnInit {
  faSearch = faSearch;

  faPlus = faPlus;

  faSortDown = faSortDown;

  registros: Registroclinico[];



  paginaAtual = 1;

  searchText: string = "";

  placeholder: string = "Buscar por nome";

  input: number = 1;

  @ViewChild("searchInput") searchInput: ElementRef;

  itemsPerPage: number = 10;



  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  dataSource: any;

  displayedColumns: string[] = ['prontuario', 'nome', 'registros'];

  registerNotFound = true;

  inputType = 'text';


  constructor(private registroClinicoService: RegistroclinicoService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.verifyMessage();
    this.getRegistros();
  }

  buildTable() {
    this.dataSource = new MatTableDataSource(this.registros);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  getRegistros() {
    this.registroClinicoService.getRegistros().subscribe(
      data => {
        this.registros = data;


        this.buildTable();
      },
      error => {
        this.buildMessage('Erro ao carregar os registros', 1);
      }
    );
  }

  onChangeSearchSelector(value: number) {
    if (value === 1) {
      this.inputType = 'text';
      if (this.input != value && this.searchText != "") {
        this.searchText = "";
        this.dataSource = this.registros;
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por nome';
    }
    else if (value === 2) {
      this.inputType = 'text';
      if (this.input != value && this.searchText != "") {
        this.searchText = "";
        this.dataSource = this.registros;
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por prontuário';
    }
    else {
      this.inputType = 'date';
      if (this.input != value && this.searchText != "") {
        this.searchText = "";
        this.dataSource = this.registros;
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por data';
    }
  }

  onSearch() {

    if (this.input === 1) {
      if (this.searchText === "") {
        this.getRegistros();
      } else {
        this.registroClinicoService.getByNome(this.searchText).subscribe(
          data => {
            if (Object.keys(data).length !== 0) {
              this.registros = data;
              this.buildTable();
              this.registerNotFound = false;
            }

          },
          error => {
            this.buildMessage('Erro ao tentar pesquisar', 1);

          }
        );
      }
    }
    else if (this.input === 2) {
      if (this.searchText === "") {
        this.getRegistros();
      } else {
        this.registroClinicoService.getByProntuario(+this.searchText).subscribe(
          data => {
            if (Object.keys(data).length !== 0) {
              this.registros = data;
              this.buildTable();
              this.registerNotFound = false;
            }

          },
          error => {
            this.buildMessage('Erro ao tentar pesquisar', 1);

          }
        );
      }
    }
    else {
      if (this.searchText === "") {
        this.getRegistros();
      } else {
        this.registroClinicoService.getByData(this.searchText).subscribe(
          data => {
            if (Object.keys(data).length !== 0) {
              this.registros = data;
              this.buildTable();
              this.registerNotFound = false;
            }

          },
          error => {
            this.buildMessage('Erro ao tentar pesquisar', 1);

          }
        );
      }
    }
  }

  openClinicalRegister(prontuario: number, nome: string) {
    const dialogRef = this.dialog.open(RegistroClinicoPacienteListAllComponent, {
      height: '500px',
      width: '9000px',
      data: { prontuario, nome },
    });
  }

  verifyMessage() {
    if (this.registroClinicoService.message !== undefined) {
      this.buildMessage(this.registroClinicoService.message, 0);
      setTimeout(() => {
        this.registroClinicoService.message = undefined;
      }, 5000);
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
