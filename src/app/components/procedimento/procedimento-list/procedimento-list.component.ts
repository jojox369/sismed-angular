import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faSearch, faChevronLeft, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ProcedimentoService } from 'src/app/services/procedimento.service'
import { Procedimento } from 'src/app/models/procedimento';
import { ConvenioService } from 'src/app/services/convenio.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-procedimento-list',
  templateUrl: './procedimento-list.component.html',
  styleUrls: ['./procedimento-list.component.css']
})
export class ProcedimentoListComponent implements OnInit {

  // icone de pesquisa
  faSearch = faSearch;

  // icone do botão voltar
  faChevronLeft = faChevronLeft;

  // icone do menu dropdown
  faSortDown = faSortDown;

  // Variavel de controle da tabela para a exibição de dados
  procedimentoIsEmpty = true;

  // variavel que controla a exebição da tabela
  isLoading = true;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  // Variavel que controla a mensagem de erro
  hasError = false;

  // variavel que captura o que esta sendo digitado
  searchText = '';

  // Variavel que apresenta qual é o campo de pesquisa selecionado. Por padrão, ele já vai com o campo 'nome'
  placeholder = 'Buscar por Descrição';

  // Variavel que guarda o valor do campo de pesquisa selecionado
  input = 1;

  /* Recupera o id do convenio para a consulta na API*/
  convenioId = this.route.snapshot.paramMap.get('convenioId');

  // Recebe os dados da api
  procedimentos: Procedimento[];

  // Recebe o nome do convenio
  convenioNome: string;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['descricao'];

  constructor(
    private route: ActivatedRoute,
    private procedimentoService: ProcedimentoService,
    private convenioService: ConvenioService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProcedimentos();
    this.loadConvenio();
    this.verifyMessage();
  }

  // Função que a requisição ao service para retornar a lista de procedimentos de um convenio
  getProcedimentos() {
    this.procedimentoService.getAll(this.convenioId).subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.procedimentoIsEmpty = true;
          this.isLoading = false;
          this.showEmptyMessage = true;
        } else {
          this.procedimentoIsEmpty = false;
          this.isLoading = false;
          this.procedimentos = data;
          this.buildTable();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // Função que busca o nome do convenio para ser exibido na pagina
  loadConvenio() {
    this.convenioService.getById(this.convenioId).subscribe(
      data => {
        this.convenioNome = data.nome;
      }
    );
  }

  // monta a lista de convenio
  buildTable() {
    this.dataSource = new MatTableDataSource(this.procedimentos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  onChangeSearchSelector(value: number) {
    if (value === 1) {
      if (this.input !== value) {
        this.searchText = '';
        this.getProcedimentos();
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
      this.onSearchByDescription();
    }
  }

  onSearchByDescription() {
    if (this.searchText === '') {
      this.showEmptyMessage = false;
      this.getProcedimentos();
    } else {
      this.procedimentoService
        .getByDescription(this.convenioId, this.searchText)
        .subscribe(
          (data) => {
            if (Object.keys(data).length === 0) {
              this.procedimentoIsEmpty = true;
              this.showEmptyMessage = true;
            } else {
              this.showEmptyMessage = false;
              this.procedimentoIsEmpty = false;
              this.procedimentos = data;
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
    if (this.procedimentoService.message !== undefined) {
      this.buildMessage(this.procedimentoService.message, 0);
      setTimeout(() => {
        this.procedimentoService.message = undefined;
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
