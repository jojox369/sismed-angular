import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/services/paciente.service';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Convenio } from 'src/app/models/convenio';
import { Paciente } from 'src/app/models/paciente';
import { Funcionario } from 'src/app/models/funcionario';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Relatorio, RelatorioList } from 'src/app/models/relatorio';
import { faCheck, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
})
export class RelatorioComponent implements OnInit {
  faCheck = faCheck;
  faPencilAlt = faPencilAlt;
  convenios: Convenio[];
  funcionarios: Funcionario[];
  pacientes: Paciente[];
  relatorios: RelatorioList[];
  relatorio: Relatorio;
  relatorioForm: FormGroup;
  total: number;
  relatorioIsEmpty: boolean;
  hasReport: boolean;
  showTotalValueMessage: boolean;
  showNewReportButton: boolean;
  showFirstMessage: boolean = true;
  totalValue;

  pacienteSelectedName;
  convenioSelectedName;
  funcionarioSelectedName;

  // Variavel que controla a mensagem de erro
  hasError: boolean = false;

  // Variavel que controla a mensagem de dado não encontrado
  showEmptyMessage: boolean = false;

  // Controla a progress spiner e a aparição da lista
  isLoading: boolean = false;

  filteredPacientes: Observable<any>;

  pacienteName = new FormControl();

  user = JSON.parse(sessionStorage.getItem('user'));

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = [
    'paciente',
    'convenio',
    'funcionario',
    'data',
    'valor',
  ];

  constructor(
    private funcionarioService: FuncionarioService,
    private convenioService: ConvenioService,
    private pacienteService: PacienteService,
    private relatorioService: RelatorioService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.user.perfil === 3) {
      this.getAllData();
    } else {
      this.router.navigate(['access-denied']);
    }
  }

  getAllData() {
    this.funcionarioService.getMedicos().subscribe(
      (data) => {
        this.funcionarios = data;
      },
      (error) => {
        console.log(error);
        this.buildMessage('Erro ao tentar carregar lista de médicos', 1);
      }
    );

    this.pacienteService.getAllPacientes().subscribe(
      (data) => {
        this.pacientes = data;
        this.filterPacientes();
      },
      (error) => {
        console.log(error);
        this.buildMessage('Erro ao tentar carregar lista de pacientes', 1);
      }
    );

    this.convenioService.getAll().subscribe(
      (data) => {
        this.convenios = data;
        this.createForm();
      },
      (error) => {
        console.log(error);
        this.buildMessage('Erro ao tentar carregar lista de convênios', 1);
      }
    );
  }

  createForm() {
    this.relatorio = new Relatorio();
    this.relatorioForm = this.fb.group({
      convenio: [this.relatorio.convenio],
      paciente: [this.relatorio.paciente],
      funcionario: [this.relatorio.funcionario],
      data_inicio: [''],
      data_fim: [''],
    });
  }

  filterPacientes() {
    this.filteredPacientes = this.pacienteName.valueChanges.pipe(
      startWith(''),
      map((value) => (value.length >= 1 ? this.filter(value) : []))
    );
  }

  filter(value: string) {
    const filterValue = value.toLowerCase();
    const results = this.pacientes.filter((option) =>
      option.nome.toLowerCase().includes(filterValue)
    );
    return results;
  }

  // monta a lista de cfuncionarios
  buildTable() {
    this.dataSource = new MatTableDataSource(this.relatorios);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  calculateYield(): number {
    let total = 0;
    for (const report of this.relatorios) {
      total = Number(total) + Number(report.valor);
    }
    return total;
  }

  formatDate(date: string): string {
    const arrayDate = date.split('-');
    const dateFormat = arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0];
    return dateFormat;
  }

  generate() {
    this.isLoading = true;
    this.showFirstMessage = false;
    this.showNewReportButton = true;
    let query = 'SELECT * FROM sismed_custos ';

    if (
      this.relatorioForm.controls.data_inicio.value !== '' &&
      this.relatorioForm.controls.data_fim.value === ''
    ) {
      this.buildMessage(
        'Insira a data final do periodo para gerar o relatorio',
        1
      );
    } else if (
      this.relatorioForm.controls.data_inicio.value === '' &&
      this.relatorioForm.controls.data_fim.value !== ''
    ) {
      this.buildMessage(
        'Insira a data inicial do periodo para gerar o relatorio',
        1
      );
    } else if (
      this.relatorioForm.controls.funcionario.value === null &&
      this.relatorioForm.controls.convenio.value === null &&
      this.relatorioForm.controls.data_inicio.value === '' &&
      this.relatorioForm.controls.data_fim.value === '' &&
      this.relatorioForm.controls.paciente.value === null
    ) {
      this.buildMessage('Selecione algum campo para  gerar o relatorio', 1);
    } else if (
      this.relatorioForm.controls.convenio.value === null &&
      this.relatorioForm.controls.data_inicio.value === '' &&
      this.relatorioForm.controls.data_fim.value === '' &&
      this.relatorioForm.controls.funcionario.value === null
    ) {
      // busca so por paciente

      query += 'WHERE paciente = ' + this.relatorioForm.controls.paciente.value;

      this.relatorioService.getAllReport(query).subscribe(
        (data) => {
          this.relatorios = data;
          if (Object.keys(data).length === 0) {
            this.totalValue =
              'O paciente ' +
              this.pacienteSelectedName +
              ' não gerou nenhum rendimento';
            this.totalValue = this.totalValue.toUpperCase();
            this.hasReport = false;
            this.showEmptyMessage = true;
            this.showTotalValueMessage = true;
            this.isLoading = false;
          } else {
            this.totalValue =
              'O paciente ' +
              this.pacienteSelectedName +
              ' gerou um rendimento de R$ ' +
              this.calculateYield();
            this.totalValue = this.totalValue.toUpperCase();
            this.hasReport = true;
            this.isLoading = false;
            this.showTotalValueMessage = true;
            this.buildTable();
          }
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar gerar o relatorio', 1);
        }
      );
    } else if (
      this.relatorioForm.controls.paciente.value === null &&
      this.relatorioForm.controls.data_inicio.value === '' &&
      this.relatorioForm.controls.data_fim.value === '' &&
      this.relatorioForm.controls.funcionario.value === null
    ) {
      // busca só por convenio
      if (this.relatorioForm.controls.convenio.value === 0) {
        // Todos os convenios
        query += 'ORDER BY convenio';
        this.relatorioService.getAllReport(query).subscribe(
          (data) => {
            this.relatorios = data;
            if (Object.keys(data).length === 0) {
              this.totalValue = 'Os convenios não geraram nenhum rendimento';
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = false;
              this.showEmptyMessage = true;
              this.showTotalValueMessage = true;
              this.isLoading = false;
            } else {
              this.totalValue =
                'Os convenios geraram um rendimento de R$ ' +
                this.calculateYield();
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = true;
              this.isLoading = false;
              this.showTotalValueMessage = true;
              this.buildTable();
            }
          },
          (error) => {
            console.log(error);
            this.buildMessage('Erro ao tentar gerar o relatório', 1);
          }
        );
      } else {
        // um convenio especifico
        query +=
          'WHERE convenio = ' + this.relatorioForm.controls.convenio.value;

        this.relatorioService.getAllReport(query).subscribe(
          (data) => {
            this.relatorios = data;
            if (Object.keys(data).length == 0) {
              this.totalValue =
                'O convenio ' +
                this.convenioSelectedName +
                ' não gerou nenhum rendimento';
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = false;
              this.showEmptyMessage = true;
              this.showTotalValueMessage = true;
              this.isLoading = false;
            } else {
              this.totalValue =
                'O convenio ' +
                this.convenioSelectedName +
                ' gerou um rendimento de R$ ' +
                this.calculateYield();
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = true;
              this.isLoading = false;
              this.showTotalValueMessage = true;
              this.buildTable();
            }
          },
          (error) => {
            console.log(error);
            this.buildMessage('Erro ao tentar gerar o relatório', 1);
          }
        );
      }
    } else if (
      this.relatorioForm.controls.paciente.value === null &&
      this.relatorioForm.controls.data_inicio.value === '' &&
      this.relatorioForm.controls.data_fim.value === '' &&
      this.relatorioForm.controls.convenio.value === null
    ) {
      // só por funcionario
      query +=
        'WHERE funcionario = ' + this.relatorioForm.controls.funcionario.value;
      this.relatorioService.getAllReport(query).subscribe(
        (data) => {
          this.relatorios = data;
          if (Object.keys(data).length === 0) {
            this.totalValue =
              'O funcionario ' +
              this.funcionarioSelectedName +
              ' não gerou nenhum rendimento';
            this.totalValue = this.totalValue.toUpperCase();
            this.hasReport = false;
            this.showEmptyMessage = true;
            this.showTotalValueMessage = true;
            this.isLoading = false;
          } else {
            this.totalValue =
              'O funcionario ' +
              this.funcionarioSelectedName +
              ' gerou um rendimento de R$ ' +
              this.calculateYield();
            this.totalValue = this.totalValue.toUpperCase();
            this.hasReport = true;
            this.isLoading = false;
            this.showTotalValueMessage = true;
            this.buildTable();
          }
        },
        (error) => {
          console.log(error);
          this.buildMessage('Erro ao tentar gerar o relatório', 1);
        }
      );
    } else if (
      this.relatorioForm.controls.paciente.value === null &&
      this.relatorioForm.controls.convenio.value === null &&
      this.relatorioForm.controls.funcionario.value === null
    ) {
      // periodo
      this.relatorioService
        .getAllReportByPeriodo(
          this.relatorioForm.controls.data_inicio.value,
          this.relatorioForm.controls.data_fim.value
        )
        .subscribe(
          (data) => {
            this.relatorios = data;
            if (Object.keys(data).length === 0) {
              this.totalValue =
                'Entre as datas ' +
                this.formatDate(this.relatorioForm.controls.data_inicio.value) +
                ' e ' +
                this.formatDate(this.relatorioForm.controls.data_fim.value) +
                ' não foi gerado nenhum rendimento';
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = false;
              this.showEmptyMessage = true;
              this.showTotalValueMessage = true;
              this.isLoading = false;
            } else {
              this.totalValue =
                'Entre as datas ' +
                this.formatDate(this.relatorioForm.controls.data_inicio.value) +
                ' e ' +
                this.formatDate(this.relatorioForm.controls.data_fim.value) +
                ' foi gerado um rendimento de R$ ' +
                this.calculateYield();
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = true;
              this.isLoading = false;
              this.showTotalValueMessage = true;
              this.buildTable();
            }
          },
          (error) => {
            console.log(error);
            this.buildMessage('Erro ao tentar gerar o relatório', 1);
          }
        );
    } else if (
      this.relatorioForm.controls.convenio.value === null &&
      this.relatorioForm.controls.funcionario.value === null
    ) {
      // Paciente e periodo

      this.relatorioService
        .getAllReportByPeriodEPaciente(
          this.relatorioForm.controls.data_inicio.value,
          this.relatorioForm.controls.data_fim.value,
          this.relatorioForm.controls.paciente.value
        )
        .subscribe(
          (data) => {
            this.relatorios = data;
            if (Object.keys(data).length == 0) {
              this.totalValue =
                'Entre as datas ' +
                this.formatDate(this.relatorioForm.controls.data_inicio.value) +
                ' e ' +
                this.formatDate(this.relatorioForm.controls.data_fim.value) +
                ' o paciente ' +
                this.pacienteName +
                ' não gerou nenhum rendimento';
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = false;
              this.showEmptyMessage = true;
              this.showTotalValueMessage = true;
              this.isLoading = false;
            } else {
              this.totalValue =
                'O paciente ' +
                this.pacienteName +
                ' entre as datas ' +
                this.formatDate(this.relatorioForm.controls.data_inicio.value) +
                ' e ' +
                this.formatDate(this.relatorioForm.controls.data_fim.value) +
                ' gerou uma receita de R$ ' +
                this.calculateYield();
              this.totalValue = this.totalValue.toUpperCase();
              this.hasReport = true;
              this.isLoading = false;
              this.showTotalValueMessage = true;
              this.buildTable();
            }
          },
          (error) => {
            console.log(error);
            this.buildMessage('Erro ao tentar gerar relatório', 1);
          }
        );
    } else if (
      this.relatorioForm.controls.funcionario.value === null &&
      this.relatorioForm.controls.paciente.value === null
    ) {
      // convenio e periodo
      if (this.relatorioForm.controls.convenio.value === 0) {
        // todos os convenios
        this.relatorioService
          .getAllReportByPeriodo(
            this.relatorioForm.controls.data_inicio.value,
            this.relatorioForm.controls.data_fim.value
          )
          .subscribe(
            (data) => {
              this.relatorios = data;
              if (Object.keys(data).length === 0) {
                this.totalValue =
                  'Entre as datas ' +
                  this.formatDate(
                    this.relatorioForm.controls.data_inicio.value
                  ) +
                  ' e ';
                this.totalValue = this.totalValue.toUpperCase();
                +this.formatDate(this.relatorioForm.controls.data_fim.value) +
                  ' os convenios não geraram nenhum rendimento';
                this.hasReport = false;
                this.showEmptyMessage = true;
                this.showTotalValueMessage = true;
                this.isLoading = false;
              } else {
                this.totalValue =
                  'Entre as datas ' +
                  this.formatDate(
                    this.relatorioForm.controls.data_inicio.value
                  ) +
                  ' e ';
                this.totalValue = this.totalValue.toUpperCase();
                +this.formatDate(this.relatorioForm.controls.data_fim.value) +
                  ' os convenios geraram um rendimento de R$ ' +
                  this.calculateYield();
                this.hasReport = true;
                this.isLoading = false;
                this.showTotalValueMessage = true;
                this.buildTable();
              }
            },
            (error) => {
              console.log(error);
              this.buildMessage('Erro ao tentar gerar o relatorio', 1);
            }
          );
      } else {
        // um convenio especifico

        this.relatorioService
          .getAllReportByPeriodEConvenio(
            this.relatorioForm.controls.data_inicio.value,
            this.relatorioForm.controls.data_fim.value,
            this.relatorioForm.controls.convenio.value
          )
          .subscribe(
            (data) => {
              this.relatorios = data;
              if (Object.keys(data).length === 0) {
                this.totalValue =
                  'Entre as datas ' +
                  this.formatDate(
                    this.relatorioForm.controls.data_inicio.value
                  ) +
                  ' e ';
                this.totalValue = this.totalValue.toUpperCase();
                +this.formatDate(this.relatorioForm.controls.data_fim.value) +
                  ' o convenio ' +
                  this.convenioSelectedName +
                  ' não gerou nenhum rendimento';
                this.hasReport = false;
                this.showEmptyMessage = true;
                this.showTotalValueMessage = true;
                this.isLoading = false;
              } else {
                this.totalValue =
                  'Entre as datas ' +
                  this.formatDate(
                    this.relatorioForm.controls.data_inicio.value
                  ) +
                  ' e ';
                this.totalValue = this.totalValue.toUpperCase();
                +this.formatDate(this.relatorioForm.controls.data_fim.value) +
                  ' o convenio ' +
                  this.convenioSelectedName +
                  ' gerou um rendimento de R$ ' +
                  this.calculateYield();
                this.hasReport = true;
                this.isLoading = false;
                this.showTotalValueMessage = true;
                this.buildTable();
              }
            },
            (error) => {
              console.log(error);
              this.buildMessage('Erro ao tentar gerar relatorio', 1);
            }
          );
      }
    } else if (
      this.relatorioForm.controls.paciente.value === null &&
      this.relatorioForm.controls.convenio.value === null
    ) {
      // funcionario e periodo

      this.relatorioService
        .getAllReportByPeriodoEFuncinario(
          this.relatorioForm.controls.data_inicio.value,
          this.relatorioForm.controls.data_fim.value,
          this.relatorioForm.controls.funcionario.value
        )
        .subscribe(
          (data) => {
            this.relatorios = data;
            if (Object.keys(data).length === 0) {
              this.totalValue =
                'Entre as datas ' +
                this.formatDate(this.relatorioForm.controls.data_inicio.value) +
                ' e ';
              this.totalValue = this.totalValue.toUpperCase();
              +this.formatDate(this.relatorioForm.controls.data_fim.value) +
                ' o funcionario ' +
                this.funcionarioSelectedName +
                ' não gerou nenhum rendimento';
              this.hasReport = false;
              this.showEmptyMessage = true;
              this.showTotalValueMessage = true;
              this.isLoading = false;
            } else {
              this.totalValue =
                'Entre as datas ' +
                this.formatDate(this.relatorioForm.controls.data_inicio.value) +
                ' e ';
              this.totalValue = this.totalValue.toUpperCase();
              +this.formatDate(this.relatorioForm.controls.data_fim.value) +
                ' o funcionario ' +
                this.funcionarioSelectedName +
                ' gerou um rendimento de R$ ' +
                this.calculateYield();
              this.hasReport = true;
              this.isLoading = false;
              this.showTotalValueMessage = true;
              this.buildTable();
            }
          },
          (error) => {
            console.log(error);
            this.buildMessage('Erro ao tentar gerar o relatorio', 1);
          }
        );
    }
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

  resetForm() {
    this.createForm();
    this.pacienteName.setValue('');

    this.showNewReportButton = false;
    this.showTotalValueMessage = false;
    this.showFirstMessage = true;
    this.isLoading = false;
    this.relatorios = [];
    this.buildTable();
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
