import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  faSearch,
  faPlus,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ConvenioService } from 'src/app/services/convenio.service';
import { Convenio } from 'src/app/models/convenio';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-convenio-list',
  templateUrl: './convenio-list.component.html',
  styleUrls: ['./convenio-list.component.css'],
})
export class ConvenioListComponent implements OnInit, AfterViewInit {
  // Icone de pesquisa
  faSearch = faSearch;

  // Icone de cadastro
  faPlus = faPlus;

  // Icone do dropdown
  faSortDown = faSortDown;

  /*Modelo que recebe os dados da API*/
  convenios: Convenio[];

  // Variavel que apresenta qual é o campo de pesquisa selecionado. Por padrão, ele já vai com o campo 'nome'
  placeholder = 'Buscar por Nome';

  // Variavel que guarda o valor do campo de pesquisa selecionado
  input = 1;

  // Controla a progress spiner e a aparição da lista
  isLoading = true;

  // Variavel de controle da tabela para a exibição de dados
  convenioIsEmpty = true;

  // variavel que captura o que esta sendo digitado
  searchText = '';

  // Variavel que controla a mensagem de erro
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  @ViewChild('searchInput') searchInput: ElementRef;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['nome', 'cnpj', 'adesao'];

  constructor(
    private convenioService: ConvenioService,
    private route: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getConvenios();
    this.verifyMessage();
  }

  ngAfterViewInit() {}

  /* Função que faz a requisição dos dados para a api.
  Caso ele consiga os dados, o modelo recebe esses dados para serem apresentados;
  */
  getConvenios() {
    this.convenioService.getAll().subscribe(
      (data) => {
        if (Object.keys(data).length === 0) {
          this.isLoading = false;
          this.convenioIsEmpty = true;
          this.showEmptyMessage = true;
        } else {
          this.convenios = data;
          this.buildTable();
          this.isLoading = false;
          this.convenioIsEmpty = false;
        }
      },
      (error) => {
        console.log('Erro ao carregar dados');
        this.isLoading = false;
        this.hasError = true;
        this.buildMessage('Erro ao tentar carregar a lista', 1);
      }
    );
  }

  // monta a lista de convenio
  buildTable() {
    this.dataSource = new MatTableDataSource(this.convenios);
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
        this.getConvenios();
      }
      this.searchInput.nativeElement.focus();
      document.getElementById('txtBusca').setAttribute('maxlength', '45');
      this.input = value;
      this.placeholder = 'Buscar por Nome';
    } else if (value === 2) {
      if (this.input !== value) {
        this.searchText = '';
        this.getConvenios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      document.getElementById('txtBusca').setAttribute('maxlength', '18');

      this.placeholder = 'Buscar por CNPJ';
    } else {
      if (this.input !== value) {
        this.searchText = '';
        this.getConvenios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      document.getElementById('txtBusca').setAttribute('maxlength', '9');
      this.placeholder = 'Buscar por ANS';
    }
  }

  // função que escolhe qual metodo de pesquisa chamar baseado no valor da variavel input
  onChooseSearchMethod() {
    if (this.input === 1) {
      this.onSearchByName();
    } else if (this.input === 2) {
      this.onSearchByCNPJ();
    } else {
      this.onSearchByANS();
    }
  }

  // Pesquisa por nome
  onSearchByName() {
    if (this.searchText !== '') {
      this.convenioService.getByNome(this.searchText).subscribe(
        (data) => {
          // Verificação para saber se a consulta retornou nula
          if (Object.keys(data).length === 0) {
            this.convenioIsEmpty = true;
            this.showEmptyMessage = true;
          } else {
            this.showEmptyMessage = false;
            this.convenioIsEmpty = false;
            this.convenios = data;
            this.buildTable();
          }
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 0);
        }
      );
    } else {
      this.showEmptyMessage = false;
      this.getConvenios();
    }
  }

  // Pesquisa por cnpj
  onSearchByCNPJ() {
    if (this.searchText !== '') {
      this.convenioService.getByCnpj(this.searchText).subscribe(
        (data) => {
          // Verificação para saber se a consulta retornou nula
          if (Object.keys(data).length === 0) {
            this.convenioIsEmpty = true;
            this.showEmptyMessage = true;
          } else {
            this.showEmptyMessage = false;
            this.convenioIsEmpty = false;
            this.convenios = data;
            this.buildTable();
          }
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 0);
        }
      );
    } else {
      this.showEmptyMessage = false;
      this.getConvenios();
    }
  }

  // Pesquisa por ans
  onSearchByANS() {
    if (this.searchText !== '') {
      this.convenioService.getByAns(this.searchText).subscribe(
        (data) => {
          // Verificação para saber se a consulta retornou nula
          if (Object.keys(data).length === 0) {
            this.convenioIsEmpty = true;
            this.showEmptyMessage = true;
          } else {
            this.showEmptyMessage = false;
            this.convenioIsEmpty = false;
            this.convenios = data;
            this.buildTable();
          }
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 0);
        }
      );
    } else {
      this.showEmptyMessage = false;
      this.getConvenios();
    }
  }

  // Verifica no service se existe alguma mensagem para ser mostrada
  verifyMessage() {
    if (this.convenioService.message !== undefined) {
      this.buildMessage(this.convenioService.message, 0);
      setTimeout(() => {
        this.convenioService.message = undefined;
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
