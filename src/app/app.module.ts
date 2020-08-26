/* Modulos*/
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/* Componentes */
import { AppComponent } from './app.component';
import { ConvenioListComponent } from './components/convenio/convenio-list/convenio-list.component';
import { ConvenioRegisterComponent } from './components/convenio/convenio-register/convenio-register.component';
import { ConvenioDetailsComponent } from './components/convenio/convenio-details/convenio-details.component';
import { AgendaListComponent } from './components/agenda/agenda-list/agenda-list.component';
import { AgendaDetailsComponent } from './components/agenda/agenda-details/agenda-details.component';
import { AgendaPreRegisterComponent } from './components/agenda/agenda-pre-register/agenda-pre-register.component';
import { ExameListComponent } from './components/exame/exame-list/exame-list.component';
import { ExameDetailsComponent } from './components/exame/exame-details/exame-details.component';
import { ExameRegisterComponent } from './components/exame/exame-register/exame-register.component';
import { FuncionarioDetailsComponent } from './components/funcionario/funcionario-details/funcionario-details.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { FuncionarioRegisterComponent } from './components/funcionario/funcionario-register/funcionario-register.component';
import { HomeComponent } from './components/home/home.component';
import { LaboratorioDetailsComponent } from './components/laboratorio/laboratorio-details/laboratorio-details.component';
import { LaboratorioListComponent } from './components/laboratorio/laboratorio-list/laboratorio-list.component';
import { LaboratorioRegisterComponent } from './components/laboratorio/laboratorio-register/laboratorio-register.component';
import { LogComponent } from './components/log/log.component';
import { PacienteListComponent } from './components/paciente/paciente-list/paciente-list.component';
import { PacienteRegisterComponent } from './components/paciente/paciente-register/paciente-register.component';
import { PacienteDetailsComponent } from './components/paciente/paciente-details/paciente-details.component';
import { ProcedimentoListComponent } from './components/procedimento/procedimento-list/procedimento-list.component';
import { ProcedimentoDetailsComponent } from './components/procedimento/procedimento-details/procedimento-details.component';
import { ProcedimentoRegisterComponent } from './components/procedimento/procedimento-register/procedimento-register.component';
import { RegistroClinicoListComponent } from './components/registro-clinico/registro-clinico-list/registro-clinico-list.component';
import { RegistroClinicoRegisterComponent } from './components/registro-clinico/registro-clinico-register/registro-clinico-register.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { TipoConvenioListComponent } from './components/tipo-convenio/tipo-convenio-list/tipo-convenio-list.component';
import { TipoConvenioDetailsComponent } from './components/tipo-convenio/tipo-convenio-details/tipo-convenio-details.component';
import { TipoConvenioRegisterComponent } from './components/tipo-convenio/tipo-convenio-register/tipo-convenio-register.component';
import { LoginComponent } from './components/user/login/login.component';
import { AgendaRegisterComponent } from './components/agenda/agenda-register/agenda-register.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DeleteDialogComponent } from './components/shared/delete-dialog/delete-dialog.component';
import { CPFPipe } from './pipes/cpf.pipe';
import { CNPJPipe } from './pipes/cnpj.pipe';
import { TelefonePipe } from './pipes/telefone.pipe';
import { CelularPipe } from './pipes/celular.pipe';
import { SearchDialogComponent } from './components/agenda/search-dialog/search-dialog.component';
import { AgendaObservacaoComponent } from './components/agenda/agenda-observacao/agenda-observacao.component';
import { AgendaAnterioresComponent } from './components/agenda/agenda-anteriores/agenda-anteriores.component';
import { AgendaAttendanceComponent } from './components/agenda/agenda-attendance/agenda-attendance.component';
import { TipoConvenioRegisterDialogComponent } from './components/laboratorio/tipo-convenio-register-dialog/tipo-convenio-register-dialog.component';
import { TipoConvenioDeleteDialogComponent } from './components/laboratorio/tipo-convenio-delete-dialog/tipo-convenio-delete-dialog.component';
import { FuncionarioTipoConvenioListComponent } from './components/funcionario/funcionario-tipo-convenio-list/funcionario-tipo-convenio-list.component';
import { FuncionarioTipoConvenioRegisterComponent } from './components/funcionario/funcionario-tipo-convenio-register/funcionario-tipo-convenio-register.component';
import { FuncionarioTipoConvenioDeleteComponent } from './components/funcionario/funcionario-tipo-convenio-delete/funcionario-tipo-convenio-delete.component';
import { UserDialogComponent } from './components/user/user-dialog/user-dialog.component';
import { BackupRestoreComponent } from './components/backup-restore/backup-restore.component';
import { DetailsDialogComponent } from './components/log/details-dialog/details-dialog.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { AccessDeniedComponent } from './components/shared/access-denied/access-denied.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ConvenioListComponent,
    ConvenioRegisterComponent,
    ConvenioDetailsComponent,
    AgendaListComponent,
    AgendaDetailsComponent,
    AgendaPreRegisterComponent,
    ExameListComponent,
    ExameDetailsComponent,
    ExameRegisterComponent,
    FuncionarioDetailsComponent,
    FuncionarioListComponent,
    FuncionarioRegisterComponent,
    HomeComponent,
    LaboratorioDetailsComponent,
    LaboratorioListComponent,
    LaboratorioRegisterComponent,
    LogComponent,
    PacienteListComponent,
    PacienteRegisterComponent,
    PacienteDetailsComponent,
    ProcedimentoListComponent,
    ProcedimentoDetailsComponent,
    ProcedimentoRegisterComponent,
    RegistroClinicoListComponent,
    RegistroClinicoRegisterComponent,
    RelatorioComponent,
    TipoConvenioListComponent,
    TipoConvenioDetailsComponent,
    TipoConvenioRegisterComponent,
    LoginComponent,
    AgendaRegisterComponent,
    PagenotfoundComponent,
    DeleteDialogComponent,
    CPFPipe,
    CNPJPipe,
    TelefonePipe,
    CelularPipe,
    SearchDialogComponent,
    AgendaObservacaoComponent,
    AgendaAnterioresComponent,
    AgendaAttendanceComponent,
    TipoConvenioRegisterDialogComponent,
    TipoConvenioDeleteDialogComponent,
    FuncionarioTipoConvenioListComponent,
    FuncionarioTipoConvenioRegisterComponent,
    FuncionarioTipoConvenioDeleteComponent,
    UserDialogComponent,
    BackupRestoreComponent,
    DetailsDialogComponent,
    ForgotPasswordComponent,
    AccessDeniedComponent
  ],
  entryComponents: [DeleteDialogComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    FontAwesomeModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatGridListModule,
    NgxMaskModule.forRoot(),
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatListModule,
    MatRadioModule,
    MatAutocompleteModule,
    TextFieldModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
