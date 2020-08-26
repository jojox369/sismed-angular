import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { ExameService } from 'src/app/services/exame.service';
import { Exame } from 'src/app/models/exame';
import { faSearch, faPlus, faSortDown, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-exame-list',
  templateUrl: './exame-list.component.html',
  styleUrls: ['./exame-list.component.css']
})
export class ExameListComponent implements OnInit {
  faSearch = faSearch;

  // Icone de cadastro
  faPlus = faPlus;

  // Icone do dropdown
  faSortDown = faSortDown;

  faTimes = faTimes;

  exames: Exame[];

  // variavel que captura o que esta sendo digitado
  searchText = '';

  // Variavel que controla a mensagem de erro 
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;
  // Icone de pesquisa


  // Variavel que apresenta qual é o campo de pesquisa selecionado. Por padrão, ele já vai com o campo 'nome'
  placeholder = 'Buscar por Paciente';

  // Variavel que guarda o valor do campo de pesquisa selecionado
  input = 1;

  // Controla a progress spiner e a aparição da lista
  isLoading = true;

  // Variavel de controle da tabela para a exibição de dados
  isExameNotEmpty = true;

  // Guarda o nome do paciente no campo de pesquisa
  pacienteName = '';

  // Guarda o nome do exame no campo de pesquisa
  exameName = '';

  // Guarda a data de coleta
  dataColeta = '';

  inputType;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['paciente', 'exame', 'coleta', 'envio', 'retorno'];





  constructor(
    private snackBar: MatSnackBar,
    private exameService: ExameService,
  ) { }

  ngOnInit(): void {
    this.getAllExames();
    this.verifyMessage();
  }

  getAllExames() {
    this.exameService.getAll().subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.isExameNotEmpty = false;
          this.isLoading = false;
          this.showEmptyMessage = true;
        }
        else {
          this.isLoading = false;
          this.exames = data;
          this.buildTable();
        }
      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.buildMessage('Erro ao tentar listar os exames', 1);
      }
    );
  }

  // monta a lista de cfuncionarios
  buildTable() {
    this.dataSource = new MatTableDataSource(this.exames);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  /*Função que troca o campo de pesquisa de acordo com o valor recebido*/
  onChangeSearchSelector(value: number) {
    if (value === 1) {
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Nome';
      this.inputType = 'text';
      this.searchText = this.pacienteName;
    }
    else if (value === 2) {
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Exame';
      this.inputType = 'text';
      this.searchText = this.exameName;
    }
    else if (value === 3) {
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Data de Coleta';
      this.inputType = 'date';
      this.searchText = this.dataColeta;
    }
  }

  // função que escolhe qual metodo de pesquisa chamar baseado no valor da variavel input
  onChooseSearchMethod() {
    if (this.input === 1) {
      this.onSearchByPaciente();

    }
    else if (this.input === 2) {
      this.onSearchByExame();

    }
    else if (this.input === 3) {
      this.onSearchByDataColeta();

    }
  }

  onSearchByPaciente() {
    this.pacienteName = this.searchText;
    this.searchData();
  }

  onSearchByExame() {
    this.exameName = this.searchText;
    this.searchData();
  }

  onSearchByDataColeta() {
    this.dataColeta = this.searchText;
    this.searchData();
  }

  searchData() {
    // busca apenas por paciente
    if (this.searchText !== '' && this.exameName === '' && this.dataColeta === '') {
      this.exameService.getByPaciente(this.pacienteName).subscribe(
        data => {
          this.exames = data;
          this.buildTable();
        },
        error => {
          console.log(error);
        }
      );
    }
    // Busca apenas por nome de exame
    else if (this.searchText !== '' && this.pacienteName === '' && this.dataColeta === '') {
      this.exameService.getByName(this.exameName).subscribe(
        data => {
          this.exames = data;
          this.buildTable();
        },
        error => {
          console.log(error);
        }
      );
    }
    // Busca apenas por data de coleta
    else if (this.searchText !== '' && this.pacienteName === '' && this.exameName === '') {
      this.exameService.getByDataColeta(this.dataColeta).subscribe(
        data => {
          this.exames = data;
          this.buildTable();
        },
        error => {
          console.log(error);
        }
      );
    }
    // busca apenas por paciente e exame
    else if (this.searchText !== '' && this.dataColeta === '') {
      this.exameService.getByPacienteExame(this.pacienteName, this.exameName).subscribe(
        data => {
          this.exames = data;
          this.buildTable();
        },
        error => {
          console.log(error);
        }
      );
    }
    // busca por exame e data
    else if (this.searchText !== '' && this.pacienteName === '') {
      this.exameService.getByExameDataColeta(this.exameName, this.dataColeta).subscribe(
        data => {
          this.exames = data;
          this.buildTable();
        },
        error => {
          console.log(error);
        }
      );
    }


  }



  clearSearch() {
    this.getAllExames();
    this.searchText = '';
    this.exameName = '';
    this.pacienteName = '';
    this.dataColeta = '';
  }

  // Verifica no service se existe alguma mensagem para ser mostrada
  verifyMessage() {
    if (this.exameService.message !== undefined) {
      this.buildMessage(this.exameService.message, 0);
      setTimeout(() => {
        this.exameService.message = undefined;
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
