import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  faSearch,
  faSortDown,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Paciente } from 'src/app/models/paciente';
import { PacienteService } from 'src/app/services/paciente.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css'],
})
export class SearchDialogComponent implements OnInit {
  faSearch = faSearch;

  faSortDown = faSortDown;

  faTimes = faTimes;

  // Variavel que guarda o valor do campo de pesquisa selecionado
  input = 1;

  // Variavel que apresenta qual é o campo de pesquisa selecionado. Por padrão, ele já vai com o campo 'nome'
  placeholder = 'Buscar por Nome';

  // Variavel que recebe o resultado da pesquisa
  pacientes: Paciente[];

  // Variavel que controla se o paciente ja é cadastrado ou não
  isPacientesNotEmpty = true;

  preCadastro = false;

  loading = true;

  myControl = new FormControl();
  options;
  filteredOptions: Observable<any>;

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.pacienteService.getAllPacientes().subscribe(
      (data) => {
        this.onGetPacienteList(data);
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGetPacienteList(data) {
    this.options = data;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        value.length >= 1 ? this.onChooseSearchMethod(value) : []
      )
    );
  }

  /*Função que troca o campo de pesquisa de acordo com o valor recebido*/
  onChangeSearchSelector(value: number) {
    if (value === 1) {
      if (this.input !== value) {
        this.clearSearchInput();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      //document.getElementById('txtBusca').setAttribute('maxlength', '45')
      this.placeholder = 'Buscar por Nome';
    } else if (value === 2) {
      if (this.input !== value) {
        this.clearSearchInput();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      this.placeholder = 'Buscar por Prontuario';
    } else if (value === 3) {
      if (this.input !== value) {
        this.clearSearchInput();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      //document.getElementById('txtBusca').setAttribute('maxlength', '14')
      this.placeholder = 'Buscar por CPF';
    } else {
      if (this.input !== value) {
        this.clearSearchInput();
      }
      this.searchInput.nativeElement.focus();
      this.input = value;
      //document.getElementById('txtBusca').setAttribute('maxlength', '14')
      this.placeholder = 'Buscar por Celular';
    }
  }

  // função que escolhe qual metodo de pesquisa chamar baseado no valor da variavel input
  onChooseSearchMethod(value: string) {
    // Pesquisa por nome
    if (this.input === 1) {
      const filterValue = value.toLowerCase();
      const results = this.options.filter((option) =>
        option.nome.toLowerCase().includes(filterValue)
      );

      if (results.length) {
        this.preCadastro = false;
      } else {
        this.preCadastro = true;
      }
      return results;
    }
    // pesquisa por prontuario
    else if (this.input === 2) {
      const filterValue = value;
      const results = this.options.filter((option) =>
        option.prontuario.toString().includes(filterValue)
      );
      if (results.length) {
        this.preCadastro = false;
      } else {
        this.preCadastro = true;
      }
      return results;
    }
    // pesquisa por cpf
    else if (this.input === 3) {
      const filterValue = value;

      const results = this.options.filter((option) => {
        if (option.cpf) {
          return option.cpf.includes(filterValue);
        }
      });
      if (results.length) {
        this.preCadastro = false;
      } else {
        this.preCadastro = true;
      }
      return results;
    }
    // pesquisa por telefone
    else {
      const filterValue = value;

      const results = this.options.filter((option) => {
        if (option.celular) {
          return option.celular.includes(filterValue);
        }
      });
      if (results.length !== 0) {
        this.preCadastro = false;
      } else {
        this.preCadastro = true;
      }
      return results;
    }
  }

  clearSearchInput() {
    this.myControl.setValue('');
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event) {
    return (event.target.value = event.target.value.toUpperCase());
  }

  // Varificação de caractere
  onlyLetters(event) {
    if (
      event.charCode == 32 || // espaço
      (event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      (event.charCode > 191 && event.charCode <= 255) // letras com acentos
    ) {
      return true;
    } else {
      this.buildMessage('Insira apenas letras', 1);
      return false;
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
