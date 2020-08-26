import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Funcionario } from 'src/app/models/funcionario';
import { faSearch, faPlus, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-funcionario-list',
  templateUrl: './funcionario-list.component.html',
  styleUrls: ['./funcionario-list.component.css']
})
export class FuncionarioListComponent implements OnInit, AfterViewInit {

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
  isFuncionarioNotEmpty = true;

  // variavel que captura o que esta sendo digitado
  searchText = '';

  // Variavel que controla a mensagem de erro 
  hasError = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage = false;

  // Recebe os dados da api
  funcionarios: Funcionario[];

  user = JSON.parse(sessionStorage.getItem('user'));

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'crm', 'especialidade', 'telefone_fixo', 'celular', 'email'];

  constructor(
    private funcionarioService: FuncionarioService,
    private snackBar: MatSnackBar
  ) { }
  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  ngOnInit(): void {
    this.getAllFuncionarios();
    this.verifyMessage();
  }


  // requisita a lista de funcionarios
  getAllFuncionarios() {
    this.funcionarioService.getAllFuncionarios().subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.isFuncionarioNotEmpty = false;
          this.isLoading = false;
          this.showEmptyMessage = true;
        }
        else {
          this.isLoading = false;
          this.funcionarios = data;
          this.buildTable();
        }
      },
      error => {
        console.log(error);
        this.isLoading = false;
        this.buildMessage('Erro ao tentar listar os funcionarios', 1);
      }
    );
  }

  // monta a lista de cfuncionarios
  buildTable() {
    this.dataSource = new MatTableDataSource(this.funcionarios);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  // Varificação de caractere
  onlyLetters(event) {
    if (event.charCode == 32 || // espaço
      (event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      (event.charCode > 191 && event.charCode <= 255) // letras com acentos
    ) {
      return true;
    } else {
      alert('Apenas Letras');
      return false;
    }

  }

  // função para verificar se o que foi digitado é um numero ou não
  onlyNumbers(event) {
    /**
     0 = 48;
     1 = 49;
     2 = 50;
     3 = 51;
     4 = 52;
     5 = 53;
     6 = 54;
     7 = 55;
     8 = 56;
     9 = 57;
     */
    if (event.charCode > 47 && event.charCode < 58) {
      return true;
    } else {
      this.buildMessage('Insira apenas numeros', 0);
      return false;
    }
  }



  /*Função que troca o campo de pesquisa de acordo com o valor recebido*/
  onChangeSearchSelector(value: number) {
    if (value === 1) {
      if (this.input !== value) {
        this.searchText = '';
        this.getAllFuncionarios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.searchInput.nativeElement.setAttribute('maxlength', '45');
      this.placeholder = 'Buscar por Nome';
    }
    else if (value === 2) {
      if (this.input !== value) {
        this.searchText = '';
        this.getAllFuncionarios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.searchInput.nativeElement.setAttribute('maxlength', '11');
      this.placeholder = 'Buscar por CPF';
    }
    else if (value === 3) {
      if (this.input !== value) {
        this.searchText = '';
        this.getAllFuncionarios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.searchInput.nativeElement.setAttribute('maxlength', '11');
      this.placeholder = 'Buscar por CRM';
    }
    else if (value === 4) {
      if (this.input !== value) {
        this.searchText = '';
        this.getAllFuncionarios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.searchInput.nativeElement.setAttribute('maxlength', '11');
      this.placeholder = 'Buscar por Celular';
    }
    else if (value === 5) {
      if (this.input !== value) {
        this.searchText = '';
        this.getAllFuncionarios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Matricula';
    }
    else {
      if (this.input !== value) {
        this.searchText = '';
        this.getAllFuncionarios();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Especialidade';
    }
  }

  // função que escolhe qual metodo de pesquisa chamar baseado no valor da variavel input
  onChooseSearchMethod() {
    // pesquisa por nome
    if (this.input === 1) {
      this.onSearchByName();
    }
    // pesquisa por cpf
    else if (this.input === 2) {

      this.onSearchByCPF();

    }
    // pesquisa por crm
    else if (this.input === 3) {
      this.onSearchByCRM();
    }
    else if (this.input === 4) {

      this.onSearchByCelular();
    }
    // pesquisa por matricula
    else if (this.input === 5) {
      this.onSearchByMatricula();
    }
    // pesquisa por especialidade
    else {
      this.onSearchByEspecialidade();
    }
  }

  // Requisita a lista de funcionarios pelo nome
  onSearchByName() {
    if (this.searchText !== '') {
      this.funcionarioService.findByName(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isFuncionarioNotEmpty = false;
            this.showEmptyMessage = true;
          }
          else {
            this.funcionarios = data;
            this.buildTable();
            this.isFuncionarioNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 1);
        }
      );
    } else {
      this.getAllFuncionarios();
      this.showEmptyMessage = false;
    }
  }

  // Requisita a lista de funcionarios pelo cpf
  onSearchByCPF() {

    if (this.searchText !== '') {
      this.funcionarioService.findByCPF(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isFuncionarioNotEmpty = false;
            this.showEmptyMessage = true;
          }
          else {
            this.funcionarios = data;
            this.buildTable();
            this.isFuncionarioNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 1);
        }
      );
    } else {
      this.getAllFuncionarios();
      this.showEmptyMessage = false;
    }
  }

  // Requisita a lista de funcionarios pelo crm
  onSearchByCRM() {

    if (this.searchText !== '') {
      this.funcionarioService.findByCRM(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isFuncionarioNotEmpty = false;
            this.showEmptyMessage = true;
          }
          else {
            this.funcionarios = data;
            this.buildTable();
            this.isFuncionarioNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 1);
        }
      );
    } else {
      this.getAllFuncionarios();
      this.showEmptyMessage = false;
    }
  }

  // Requisita a lista de funcionarios pelo celular
  onSearchByCelular() {

    if (this.searchText !== '') {
      this.funcionarioService.findByCelular(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isFuncionarioNotEmpty = false;
            this.showEmptyMessage = true;
          }
          else {
            this.funcionarios = data;
            this.buildTable();
            this.isFuncionarioNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 1);
        }
      );
    } else {
      this.getAllFuncionarios();
      this.showEmptyMessage = false;
    }
  }

  // Requisita a lista de funcionarios pela matricula
  onSearchByMatricula() {

    if (this.searchText !== '') {
      this.funcionarioService.findByMatricula(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isFuncionarioNotEmpty = false;

          }
          else {
            this.funcionarios = data;
            this.buildTable();
            this.isFuncionarioNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 1);

        }
      );
    } else {
      this.getAllFuncionarios();
      this.showEmptyMessage = false;
    }
  }

  // Requisita a lista de funcionarios pela especialidade
  onSearchByEspecialidade() {
    this.showEmptyMessage = false;
    if (this.searchText !== '') {
      this.funcionarioService.findByEspecialidade(this.searchText).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            this.isFuncionarioNotEmpty = false;

          }
          else {
            this.funcionarios = data;
            this.buildTable();
            this.isFuncionarioNotEmpty = true;
            this.showEmptyMessage = false;
          }
        },
        error => {
          console.log(error);
          this.buildMessage('Erro ao tentar pesquisar', 1);
        }
      );
    } else {
      this.getAllFuncionarios();
      this.showEmptyMessage = false;
    }
  }


  // Verifica no service se existe alguma mensagem para ser mostrada
  verifyMessage() {
    if (this.funcionarioService.message !== undefined) {
      this.buildMessage(this.funcionarioService.message, 0);
      setTimeout(() => {
        this.funcionarioService.message = undefined;
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
