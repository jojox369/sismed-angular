import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faPlus, faSortDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { Paciente } from 'src/app/models/paciente';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { PacienteService } from 'src/app/services/paciente.service';
@Component({
  selector: 'app-paciente-list',
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css']
})
export class PacienteListComponent implements OnInit {

  faSearch = faSearch;

  // Icone de cadastro
  faPlus = faPlus;

  // Icone do dropdown
  faSortDown = faSortDown;

  // Variavel que apresenta qual é o campo de pesquisa selecionado. Por padrão, ele já vai com o campo 'nome'
  placeholder = 'Buscar por Nome';

  // Variavel que guarda o valor do campo de pesquisa selecionado
  input = 1;

  // Controla a progress spiner e a aparição da lista
  isLoading = true;

  // Variavel de controle da tabela para a exibição de dados
  isPacienteNotEmpty = true;

  // variavel que captura o que esta sendo digitado
  searchText = '';

  // Variavel que controla a mensagem de erro
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  // Recebe os dados da api
  pacientes: Paciente[];

  isPacientesEmpty: boolean;
  isPacientesNotFound: boolean;
  numberText: number;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['prontuario', 'nome', 'rg', 'cpf', 'convenio', 'plano', 'telefoneFixo', 'celular'];

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.verifyMessage();
    this.getAllPacientes();
  }

  getAllPacientes() {
    this.pacienteService.getAllPacientes().subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.isPacientesEmpty = true;
        } else {
          this.isLoading = false;
          this.isPacientesEmpty = false;
          this.pacientes = data;
          this.buildTable()
        }
      },
      error => {

        this.buildMessage('Erro ao tentar carregar a lista de pacientes', 1)
      }
    );
  }

  // monta a lista de cfuncionarios
  buildTable() {
    this.dataSource = new MatTableDataSource(this.pacientes);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  onChangeSearchSelector(value: number) {
    if (value === 1) {
      if (this.input != value && this.searchText != "") {
        this.searchText = "";
        this.getAllPacientes();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por nome';
    }
    else if (value === 2) {
      if (this.input != value && this.searchText != "") {
        this.searchText = "";
        this.getAllPacientes();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Prontuário';
    }
    else if (value === 3) {
      if (this.input != value && this.searchText != "") {
        this.searchText = "";
        this.getAllPacientes();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por CPF';
    }
    else {
      if (this.input != value && this.searchText != "") {
        this.searchText = "";
        this.getAllPacientes();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Celular';
    }
  }

  onChooseSearchMethod() {
    if (this.input === 1) this.onSearchByName();
    else if (this.input === 2) this.onSearchByProntuario();
    else if (this.input === 3) this.onSearchByCpf();
    else this.onSearchByCelular();
  }

  onSearchByName() {
    if (this.searchText != "") {
      this.pacienteService.getPacienteByName(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) this.isPacientesNotFound = true;
          else {
            this.pacientes = data;
            this.buildTable();
            this.isPacientesNotFound = false;
          }
        },
        error => {
          this.buildMessage('Erro ao tentar pesquisar', 1);

        }
      );
    }
    else {
      this.getAllPacientes();
    }
  }

  onSearchByProntuario() {
    this.numberText = +this.searchText;
    if (this.searchText != "") {
      this.pacienteService.getPacienteByProntuario(this.numberText).subscribe(
        data => {
          if (Object.keys(data).length === 0) this.isPacientesNotFound = true;
          else {
            this.pacientes = data;
            this.buildTable();
            this.isPacientesNotFound = false;
          }
        },
        error => {
          this.buildMessage('Erro ao tentar pesquisar', 1);

        }
      );
    }
    else {
      this.getAllPacientes();
    }
  }

  onSearchByCpf() {
    if (this.searchText != "") {
      this.pacienteService.getPacienteByCpf(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) this.isPacientesNotFound = true;
          else {
            this.pacientes = data;
            this.buildTable();
            this.isPacientesNotFound = false;
          }
        },
        error => {
          this.buildMessage('Erro ao tentar pesquisar', 1);

        }
      );
    }
    else {
      this.getAllPacientes();
    }
  }

  onSearchByCelular() {
    if (this.searchText != "") {
      this.pacienteService.getPacienteByCelular(this.searchText).subscribe(
        data => {
          if (data.length === 0) this.isPacientesNotFound = true;
          else {
            this.pacientes = data;
            this.buildTable();
            this.isPacientesNotFound = false;
          }
        },
        error => {
          this.buildMessage('Erro ao tentar pesquisar', 1);

        }
      );
    }
    else {
      this.getAllPacientes();
    }
  }


  // Verifica no service se existe alguma mensagem para ser mostrada
  verifyMessage() {
    if (this.pacienteService.message !== undefined) {
      this.buildMessage(this.pacienteService.message, 0);
      setTimeout(() => {
        this.pacienteService.message = undefined;
      }, 5000);
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
