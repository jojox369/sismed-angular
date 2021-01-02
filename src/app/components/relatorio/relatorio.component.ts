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
import { Observable, of } from 'rxjs';
import { startWith, map, switchMap, catchError } from 'rxjs/operators';
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
  relatorios: RelatorioList;
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


  hasError: boolean;


  showEmptyMessage: boolean;


  isLoading: boolean;

  showErrorMessage: boolean;

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
  ) { }

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
        this.showErrorMessage = true;
        this.isLoading = false;

        this.buildMessage('Erro ao tentar carregar lista de médicos', 1);
      }
    );


    this.convenioService.getAll().subscribe(
      (data) => {
        this.convenios = data;
        this.createForm();
      },
      (error) => {
        this.showErrorMessage = true;
        this.isLoading = false;

        this.buildMessage('Erro ao tentar carregar lista de convênios', 1);
      }
    );

    this.filterPacientes();
  }

  createForm() {
    this.relatorio = new Relatorio();
    this.relatorioForm = this.fb.group({
      convenioId: [this.relatorio.convenio],
      pacienteId: [this.relatorio.paciente],
      funcionarioId: [this.relatorio.funcionario],
      periodo: this.fb.group({
        inicio: [''],
        fim: ['']
      })

    });
  }

  filterPacientes() {
    this.filteredPacientes = this.pacienteName.valueChanges
      .pipe(

        startWith(''),

        switchMap(value => {
          if (value !== '') {

            return this.filter(value);
          } else {

            return of(null);
          }
        })
      )
  }

  filter(value: string) {
    return this.pacienteService.getPacienteByName(value).pipe(
      map(results => results),
      catchError(_ => {
        return of(null);
      })
    )
  }


  buildTable() {
    this.dataSource = new MatTableDataSource(this.relatorios.dados);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
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
    this.hasError = false;
    this.relatorioService.generate(this.relatorioForm.value).subscribe(
      data => {

        if (Object.keys(data).length == 0) {
          this.showEmptyMessage = true;
          this.relatorios = data;
          this.totalValue = 'Valor total: R$ 0,00';
        } else {

          this.relatorios = data;
          this.totalValue = `Valor total: R$ ${data.total}`
          this.buildTable();

        }
        this.isLoading = false;
        this.showTotalValueMessage = true;
      },
      error => {
        this.buildMessage('Erro ao tentar gerar o relatorios', 1);
        this.isLoading = false;
        this.hasError = true;
      }
    )
  }

  /*função que ao digitar, passa todas as letras para maiusculo*/
  toUpperCase(event) {
    return (event.target.value = event.target.value.toUpperCase());
  }


  onlyLetters(event) {
    if (
      event.charCode == 32 ||
      (event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      (event.charCode > 191 && event.charCode <= 255)
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
    this.relatorios = new RelatorioList();
    this.buildTable();
  }


  buildMessage(message: string, type: number) {


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
