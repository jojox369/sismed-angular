import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Registroclinico } from 'src/app/models/registroclinico';
import { UserLogged } from 'src/app/models/user';
import { RegistroclinicoService } from 'src/app/services/registroclinico.service';
import { CompareDates } from 'src/app/function';

@Component({
  selector: 'app-registro-clinico-paciente-list-all',
  templateUrl: './registro-clinico-paciente-list-all.component.html',
  styleUrls: ['./registro-clinico-paciente-list-all.component.css']
})
export class RegistroClinicoPacienteListAllComponent implements OnInit {

  faTimes = faTimes;


  isRegistrosNotEmpty = true;



  hasError = false;


  showEmptyMessage = false;


  isLoading = true;

  user: UserLogged = JSON.parse(sessionStorage.getItem('user'));

  registros: Registroclinico[]

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['data', 'hora', 'descricao'];

  constructor(@Inject(MAT_DIALOG_DATA) public paciente: { prontuario: number, nome: string }, private registroClinicoService: RegistroclinicoService) { }

  ngOnInit(): void {
    this.getAllRegisters();

  }

  getAllRegisters() {
    this.registroClinicoService.getRegistrosPorPaciente(this.paciente.prontuario, this.user.id).subscribe(
      data => {
        if (Object.keys(data).length === 0) {
          this.isRegistrosNotEmpty = false;
          this.isLoading = false;
          this.showEmptyMessage = true;
          this.registros = data;
          this.buildTable();
        } else {
          this.isLoading = false;
          this.registros = data;
          this.convertTime();
          this.buildTable();
        }
      },

    );
  }


  buildTable() {

    this.dataSource = new MatTableDataSource(this.registros);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }





  convertTime() {
    for (const registro of this.registros) {
      const hora = registro.hora.split(':', 2);
      registro.hora = hora[0] + ':' + hora[1];
    }
  }

  CompareDates(registerDate: string): boolean {
    const todayDate = new Date();
    const registerDateArray = registerDate.split('-');
    const todayArray = todayDate.toLocaleDateString().split('/');

    // Informações sobre a data atual
    const todayYear = Number(todayArray[2]);
    const todayMonth = Number(todayArray[1]);
    const todayDay = Number(todayArray[0]);

    // Informações da data do agendamento
    const registerYear = Number(registerDateArray[0]);
    const registerMonth = Number(registerDateArray[1]);
    const registerDay = Number(registerDateArray[2]);

    // Caso seja ano diferente, não é editavel
    if (registerYear < todayYear) {
      return false;
    }
    // Caso seja mes diferente, não é editavel
    else if (registerMonth < todayMonth) {
      return false;
    }
    // Caso seja dia diferente, não é editavel
    else if (
      registerDay < todayDay &&
      registerMonth === todayMonth &&
      registerYear === todayYear
    ) {
      return false;
    } else {
      /*Se cair nessa condição, isso quer dizer que a data do agendamento é igual ou maior que a data atual
      ou seja, o agendamento é editavel
    */
      return true;
    }
  }

}
