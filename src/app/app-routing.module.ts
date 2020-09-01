import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConvenioListComponent } from './components/convenio/convenio-list/convenio-list.component';
import { ConvenioRegisterComponent } from './components/convenio/convenio-register/convenio-register.component';
import { TipoConvenioListComponent } from './components/tipo-convenio/tipo-convenio-list/tipo-convenio-list.component';
import { TipoConvenioRegisterComponent } from './components/tipo-convenio/tipo-convenio-register/tipo-convenio-register.component';
import { ProcedimentoListComponent } from './components/procedimento/procedimento-list/procedimento-list.component';
import { ProcedimentoRegisterComponent } from './components/procedimento/procedimento-register/procedimento-register.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { FuncionarioRegisterComponent } from './components/funcionario/funcionario-register/funcionario-register.component';
import { AgendaListComponent } from './components/agenda/agenda-list/agenda-list.component';
import { AgendaPreRegisterComponent } from './components/agenda/agenda-pre-register/agenda-pre-register.component';
import { AgendaDetailsComponent } from './components/agenda/agenda-details/agenda-details.component';
import { LogComponent } from './components/log/log.component';
import { LaboratorioListComponent } from './components/laboratorio/laboratorio-list/laboratorio-list.component';
import { LaboratorioDetailsComponent } from './components/laboratorio/laboratorio-details/laboratorio-details.component';
import { LaboratorioRegisterComponent } from './components/laboratorio/laboratorio-register/laboratorio-register.component';
import { ExameListComponent } from './components/exame/exame-list/exame-list.component';
import { ExameRegisterComponent } from './components/exame/exame-register/exame-register.component';
import { RegistroClinicoListComponent } from './components/registro-clinico/registro-clinico-list/registro-clinico-list.component';
import { RegistroClinicoRegisterComponent } from './components/registro-clinico/registro-clinico-register/registro-clinico-register.component';
import { HomeComponent } from './components/home/home.component';
import { PacienteListComponent } from './components/paciente/paciente-list/paciente-list.component';
import { PacienteRegisterComponent } from './components/paciente/paciente-register/paciente-register.component';
import { ConvenioDetailsComponent } from './components/convenio/convenio-details/convenio-details.component';
import { TipoConvenioDetailsComponent } from './components/tipo-convenio/tipo-convenio-details/tipo-convenio-details.component';
import { ProcedimentoDetailsComponent } from './components/procedimento/procedimento-details/procedimento-details.component';
import { FuncionarioDetailsComponent } from './components/funcionario/funcionario-details/funcionario-details.component';
import { AgendaRegisterComponent } from './components/agenda/agenda-register/agenda-register.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { ExameDetailsComponent } from './components/exame/exame-details/exame-details.component';
import { PacienteDetailsComponent } from './components/paciente/paciente-details/paciente-details.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AgendaAttendanceComponent } from './components/agenda/agenda-attendance/agenda-attendance.component';
import { BackupRestoreComponent } from './components/backup-restore/backup-restore.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { AccessDeniedComponent } from './components/shared/access-denied/access-denied.component';
import { ErrorPageComponent } from './components/shared/error-page/error-page.component';

const routes: Routes = [
  // Abre a pagina de listagem de convenio
  { path: 'convenios', component: ConvenioListComponent },

  // abre a pagina de cadastro de convenio
  { path: 'convenio/register', component: ConvenioRegisterComponent },

  // abre a pagina de detalhes de convenio
  { path: 'convenio/:convenioId', component: ConvenioDetailsComponent },

  // abre a pagina de listagem de tipos de convenio
  { path: 'tiposConvenio/:convenioId', component: TipoConvenioListComponent },

  // abre a pagina de listagem de tipos de convenio
  {
    path: 'tiposConvenio/register/:convenioId',
    component: TipoConvenioRegisterComponent,
  },

  // abre a pagina de detalhes de tipos de convenio
  {
    path: 'tipoConvenio/details/:tipoConvenioId',
    component: TipoConvenioDetailsComponent,
  },

  // abre a pagina de listagem dos procedimentos de um convenio
  { path: 'procedimentos/:convenioId', component: ProcedimentoListComponent },

  // abre a pagina de detalhes do procedimento
  {
    path: 'procedimento/details/:procedimentoId',
    component: ProcedimentoDetailsComponent,
  },

  // abre a pagina de cadastro de procedimento
  {
    path: 'procedimento/register/:convenioId',
    component: ProcedimentoRegisterComponent,
  },

  // abre a pagina de listagem de funcionarios
  { path: 'funcionarios', component: FuncionarioListComponent },

  // abre a pagina de detalhes do funcionario
  {
    path: 'funcionario/:funcionarioId',
    component: FuncionarioDetailsComponent,
  },

  // abre a pagina de cadastro de funcionarios
  { path: 'funcionarios/register', component: FuncionarioRegisterComponent },

  // abre a pagina de agendamentos
  { path: 'agenda', component: AgendaListComponent },

  // abre a pagina de agendamento de um paciente
  { path: 'agenda/agendar/:pacienteId', component: AgendaRegisterComponent },

  // abre a pagina de pre cadastro
  { path: 'agenda/preCadastro', component: AgendaPreRegisterComponent },

  // abre a pagina de pre cadastro
  {
    path: 'agendamento/details/:medicoId/:agendamentoId',
    component: AgendaDetailsComponent,
  },

  // abre a pagina de pre cadastro
  { path: 'agenda/attendence/:medicoId', component: AgendaAttendanceComponent },

  // abre a pagina de log
  { path: 'log', component: LogComponent },

  // abre a pagina de log
  { path: 'relatorio', component: RelatorioComponent },

  // abre a listagem de laboratorios
  { path: 'laboratorios', component: LaboratorioListComponent },

  // abre a pagina de detalhes do laboratorio
  {
    path: 'laboratorio/:laboratorioId',
    component: LaboratorioDetailsComponent,
  },

  // abre a pagina de cadastro do laboratorio
  { path: 'laboratorios/register', component: LaboratorioRegisterComponent },

  // abre a listagem de exames
  { path: 'exames', component: ExameListComponent },

  // abre a pagina de detalhes do exame
  { path: 'exame/:exameId', component: ExameDetailsComponent },

  // abre a pagina de cadastro do exame
  { path: 'exames/register', component: ExameRegisterComponent },

  // abre a pagina de backup e restore
  { path: 'backup-restore', component: BackupRestoreComponent },

  { path: 'registroclinico', component: RegistroClinicoListComponent },

  {
    path: 'registroclinico/:direc/:id',
    component: RegistroClinicoRegisterComponent,
  },

  // abre a pagina inicial
  { path: 'home', component: HomeComponent },

  // abre a pagina de listagem de paciente
  { path: 'pacientes', component: PacienteListComponent },

  // abre  a pagine de cadastro de paciente
  { path: 'pacientes/register', component: PacienteRegisterComponent },

  // abre a pagina de detalhes do paciente
  { path: 'paciente/:id', component: PacienteDetailsComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'access-denied', component: AccessDeniedComponent },

  { path: 'error', component: ErrorPageComponent },

  // abre a pagina home com a url raiz é chamada
  { path: '', component: HomeComponent },

  // Abre a pagina de pagina não encontrada quando uma url invalida é requisitada
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
