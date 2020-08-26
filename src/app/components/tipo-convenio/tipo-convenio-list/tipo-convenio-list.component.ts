import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';
import { ActivatedRoute } from '@angular/router';
import { ConvenioService } from 'src/app/services/convenio.service';
import { TipoConvenio } from 'src/app/models//tipo-convenio';
import {
  faSearch,
  faChevronLeft,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBarConfig } from '@angular/material/snack-bar/snack-bar-config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tipo-convenio-list',
  templateUrl: './tipo-convenio-list.component.html',
  styleUrls: ['./tipo-convenio-list.component.css'],
})
export class TipoConvenioListComponent implements OnInit {


  // icone de pesquisa
  faSearch = faSearch;

  // icone do botão voltar
  faChevronLeft = faChevronLeft;

  // icone do menu dropdown
  faSortDown = faSortDown;

  isLoading = true;

  // Variavel de controle da tabela para a exibição de dados
  tiposConvenioIsEmpty = true;

  // variavel que captura o que esta sendo digitado
  searchText = '';

  /* Recupera o id do convenio para a consulta na API*/
  convenioId = this.route.snapshot.paramMap.get('convenioId');

  // Variavel que guarda o valor do campo de pesquisa selecionado
  input = 1;

  /*Variavel que recebe os dados das funções */
  tiposConvenio: TipoConvenio[];

  /*Variavel que recebera o nome do convenio para ser exebido */
  convenioNome: string;

  // Variavel que apresenta qual é o campo de pesquisa selecionado. Por padrão, ele já vai com o campo 'nome'
  placeholder = 'Buscar por Nome';

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  // Variavel que controla a mensagem de erro
  hasError = false;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['nome'];

  constructor(
    private tipoConvenioService: TipoConvenioService,
    private route: ActivatedRoute,
    private convenioService: ConvenioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getTiposConvenio();
    this.getConvenio();
    this.verifyMessage();
  }

  /*Função que faz requisição ao service para obter os tipos de convenio a partir do convenio*/
  getTiposConvenio() {
    this.tipoConvenioService.getAll(this.convenioId).subscribe(
      (data) => {
        if (Object.keys(data).length === 0) {
          this.tiposConvenioIsEmpty = true;
          this.isLoading = false;
          this.showEmptyMessage = true;
        } else {
          this.tiposConvenio = data;
          this.buildTable();
          this.isLoading = false;
          this.tiposConvenioIsEmpty = false;
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
    this.dataSource = new MatTableDataSource(this.tiposConvenio);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  // função para resgatar o nome do convenio
  getConvenio() {
    this.convenioService.getById(this.convenioId).subscribe(
      (data) => {
        this.convenioNome = data.nome;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChangeSearchSelector(value: number) {
    if (value === 1) {
      if (this.input !== value) {
        this.searchText = '';
        this.getTiposConvenio();
      }
      this.searchInput.nativeElement.focus();
      document.getElementById('txtBusca').setAttribute('maxlength', '45');
      this.input = value;
      this.placeholder = 'Buscar por Nome';
    }
  }

  /*Função que troca o campo de pesquisa de acordo com o valor recebido*/
  onChooseSearchMethod() {
    if (this.input === 1) {
      this.onSearchByName();
    }
  }

  onSearchByName() {
    if (this.searchText === '') {
      this.showEmptyMessage = false;
      this.getTiposConvenio();
    } else {
      this.tipoConvenioService
        .getByName(this.convenioId, this.searchText)
        .subscribe(
          (data) => {
            if (Object.keys(data).length === 0) {
              this.tiposConvenioIsEmpty = true;
              this.showEmptyMessage = true;
            } else {
              this.showEmptyMessage = false;
              this.tiposConvenioIsEmpty = false;
              this.tiposConvenio = data;
              this.buildTable();
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  // Verifica no service se existe alguma mensagem para ser mostrada
  verifyMessage() {
    if (this.tipoConvenioService.message !== undefined) {
      this.buildMessage(this.tipoConvenioService.message, 0);
      setTimeout(() => {
        this.tipoConvenioService.message = undefined;
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
