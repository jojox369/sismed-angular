import { Component, OnInit, ViewChild } from '@angular/core';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Registroclinico } from 'src/app/models/registroclinico';
import { PacienteService } from 'src/app/services/paciente.service';
import { AgendaService } from 'src/app/services/agenda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente, PacientePost } from 'src/app/models/paciente';
import { TipoConvenio } from 'src/app/models/tipo-convenio';
import { TipoConvenioService } from 'src/app/services/tipo-convenio.service';
import { Agenda } from 'src/app/models/agenda';
import { UserService } from 'src/app/services/user.service';
import { RegistroclinicoService } from 'src/app/services/registroclinico.service';
import { ConvenioService } from 'src/app/services/convenio.service';
import { Convenio } from 'src/app/models/convenio';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

var user = JSON.parse(sessionStorage.getItem('user'));

@Component({
  selector: 'app-registro-clinico-register',
  templateUrl: './registro-clinico-register.component.html',
  styleUrls: ['./registro-clinico-register.component.css']
})
export class RegistroClinicoRegisterComponent implements OnInit {
  faChevronLeft = faChevronLeft;
  faCheck = faCheck;

  isLoading: boolean;
  direcionador = this.route.snapshot.paramMap.get('direc');
  pacienteId;
  paciente: PacientePost;
  agendamentoId;
  agendamento: any;
  tipoConvenio: TipoConvenio;
  convenio: Convenio;

  registroClinico: Registroclinico;

  formRegistroClinico: FormGroup;

  registrosAnteriores: Registroclinico[];
  dataSource: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['prontuario', 'descricao', 'func_nome', 'especialidade', 'data', 'hora'];


  constructor(
    private fb: FormBuilder,
    private registroClinicoService: RegistroclinicoService,
    private pacienteService: PacienteService,
    private agendamentoService: AgendaService,
    private tipoConvenioService: TipoConvenioService,
    private convenioService: ConvenioService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registroClinico = new Registroclinico();
    if (this.direcionador === "paciente") {
      this.pacienteId = this.route.snapshot.paramMap.get('id');
      //this.getPaciente()
    } else {
      this.agendamentoId = this.route.snapshot.paramMap.get('id');
      this.getAgendamento();
    }
    this.getRegistroAnteriores();
  }

  createForm() {
    this.formRegistroClinico = this.fb.group({
      prontuario: [this.paciente.prontuario],
      nome: [this.paciente.nome],
      convenio: [this.tipoConvenio.nome],
      tipoConvenio: [this.convenio.nome],
      descricao: [this.registroClinico.descricao]
    });
    this.formRegistroClinico.controls.prontuario.disable();
    this.formRegistroClinico.controls.nome.disable()
    this.formRegistroClinico.controls.convenio.disable()
    this.formRegistroClinico.controls.tipoConvenio.disable()
  }

  buildTable() {
    this.dataSource = new MatTableDataSource(this.registrosAnteriores);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
  }

  onSubmit() {
    if (this.agendamento != null) {
      this.registroClinico.agendamento = this.agendamento.id
    }
    this.registroClinico.descricao = this.formRegistroClinico.get('descricao').value;
    this.registroClinico.prontuario = this.paciente.prontuario;
    this.registroClinico.funcionario = user.id;
    this.getHours();
    this.getDate();
    this.registroClinicoService.saveRegistroClinico(this.registroClinico).subscribe(
      data => {
        this.router.navigate(['registroclinico']);
      },
      error => {
        console.log("erro ao salvar dados");
      }
    );

  }

  getRegistroAnteriores() {
    this.registroClinicoService.getRegistrosAnteriores(this.pacienteId).subscribe(
      data => {
        this.registrosAnteriores = data;
        this.buildTable();
      },
      error => {
        console.log("erro ao carregar dados");
      }
    )
  }

  /* getPaciente() {
    this.pacienteService.getPaciente(this.pacienteId).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        this.paciente = data;
        this.getTipoConvenios(this.paciente.tipo_convenio);

      },
      error => {
        console.log("erro ao carregar dados");
      }
    );
  } */

  getAgendamento() {
    this.agendamentoService.getAgendamentoById(this.agendamentoId).subscribe(
      data => {
        this.isLoading = false;
        this.agendamento = data;
        //this.getPaciente();
      },
      error => {
        console.log("erro ao carregar dados");
      }
    );
  }

  getTipoConvenios(tipoConvenioId: Number) {
    this.tipoConvenioService.getById(tipoConvenioId).subscribe(
      data => {
        this.tipoConvenio = data;
        //this.getConvenio(this.tipoConvenio.convenio);
      },
      error => {
        console.log("erro ao carregar dados");
      }
    );
  }

  getConvenio(convenioId: Number) {
    this.convenioService.getById(convenioId).subscribe(
      data => {
        this.convenio = data;
        this.createForm();
      },
      error => {
        console.log("erro ao carregar dados");
      }
    )
  }

  getHours() {
    const todayDate = new Date();
    let hora;
    let minutos;
    let seconds;
    if (todayDate.getHours() < 10) {
      hora = '0' + todayDate.getHours();
    } else {
      hora = todayDate.getHours();
    }
    if (todayDate.getMinutes() < 10) {
      minutos = '0' + todayDate.getMinutes();
    } else {
      minutos = todayDate.getMinutes();
    }
    if (todayDate.getSeconds() < 10) {
      seconds = '0' + todayDate.getSeconds();
    } else {
      seconds = todayDate.getSeconds();
    }
    this.registroClinico.hora = hora + ':' + minutos + ':' + seconds;
  }

  getDate() {
    const todayDate = new Date();
    const todayArray = todayDate.toLocaleDateString().split('/');

    var todayYear = todayArray[2];
    var todayMonth = todayArray[1];
    var todayDay = todayArray[0];

    this.registroClinico.data = todayYear + '-' + todayMonth + '-' + todayDay;
  }

}
