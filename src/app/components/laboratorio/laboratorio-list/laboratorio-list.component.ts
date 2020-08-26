import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faSearch, faPlus, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { Laboratorio } from 'src/app/models/laboratorio';
import { LaboratorioService } from 'src/app/services/laboratorio.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-laboratorio-list',
  templateUrl: './laboratorio-list.component.html',
  styleUrls: ['./laboratorio-list.component.css']
})
export class LaboratorioListComponent implements OnInit {

  // Icone de pesquisa
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
  isLaboratoriosNotEmpty = true;

  // variavel que captura o que esta sendo digitado
  searchText = '';

  // Variavel que controla a mensagem de erro 
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  // Recebe os dados da api
  laboratorios: Laboratorio[];

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['nome', 'responsavel', 'telefone', 'bairro', 'cidade'];

  constructor(
    private laboratorioService: LaboratorioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getLaboratorios();
    this.verifyMessage();
  }

  // Metodo para recuperar a lista de laboratorios
  getLaboratorios() {
    this.laboratorioService.getAll().subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.isLaboratoriosNotEmpty = false;
        } else {
          this.laboratorios = data;
          this.buildTable();
          this.isLoading = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // monta a lista de convenio
  buildTable() {
    this.dataSource = new MatTableDataSource(this.laboratorios);
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
      if (this.input !== value) {
        this.searchText = '';
        this.getLaboratorios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Nome';
    }
    else if (value === 2) {
      if (this.input !== value) {
        this.searchText = '';
        this.getLaboratorios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Telefone';
    }
    else {
      if (this.input !== value) {
        this.searchText = '';
        this.getLaboratorios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Bairro';
    }
  }

  // função que escolhe qual metodo de pesquisa chamar baseado no valor da variavel input
  onChooseSearchMethod() {

    if (this.input === 1) {
      this.onSearchByName();
    }
    else if (this.input === 2) {
      this.onSearchByTelefone();
    }
    else {
      this.onSearchByBairro();
    }
  }

  onSearchByName() {

    if (this.searchText !== '') {
      this.laboratorioService.getByName(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isLaboratoriosNotEmpty = false;
            this.isLoading = false;
            this.showEmptyMessage = true;
          }
          else {
            this.laboratorios = data;
            this.buildTable();
            this.isLaboratoriosNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          this.buildMessage('Erro ao tentar pesquisar', 1);
          console.log(error);
        }
      );
    }
    else {
      this.getLaboratorios();
      this.showEmptyMessage = false;
    }

  }

  onSearchByTelefone() {

    if (this.searchText !== '') {
      this.laboratorioService.getByPhone(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isLaboratoriosNotEmpty = false;
            this.isLoading = false;
            this.showEmptyMessage = true;
          }
          else {
            this.laboratorios = data;
            this.buildTable();
            this.isLaboratoriosNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          this.buildMessage('Erro ao tentar pesquisar', 1);
          console.log(error);
        }
      );
    }
    else {
      this.getLaboratorios();
      this.showEmptyMessage = false;
    }
  }

  onSearchByBairro() {
    if (this.searchText !== '') {
      this.laboratorioService.getByBairro(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isLaboratoriosNotEmpty = false;
            this.isLoading = false;
            this.showEmptyMessage = true;
          }
          else {
            this.laboratorios = data;
            this.buildTable();
            this.isLaboratoriosNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          this.buildMessage('Erro ao tentar pesquisar', 1);
          console.log(error);
        }
      );
    } else {
      this.getLaboratorios();
      this.showEmptyMessage = false;
    }
  }

  // Verifica no service se existe alguma mensagem para ser mostrada
  verifyMessage() {
    if (this.laboratorioService.message !== undefined) {
      this.buildMessage(this.laboratorioService.message, 0);
      setTimeout(() => {
        this.laboratorioService.message = undefined;
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
