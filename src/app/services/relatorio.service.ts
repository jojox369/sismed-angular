import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Relatorio } from '../models/relatorio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  token = this.userService.token;
  baseUrl = 'http://localhost:8000/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  /*Metodo que salva relatorio de acordo com as informações do agendamento */
  saveReport(relatorio: Relatorio): Observable<any> {
    return this.http.post(this.baseUrl + "report/save/", relatorio, { headers: this.httpHeaders });
  }

  //Pega agenda de custos para saber se o agendamento ja foi finalizado
  getReport(date: String): Observable<any> {
    return this.http.get(this.baseUrl + "report/" + date + "/", { headers: this.httpHeaders });
  }

  //retorna lista de acordo com a consulta passada
  getAllReport(query: String): Observable<any> {
    return this.http.get(this.baseUrl + "report/list/" + query + "/", { headers: this.httpHeaders });
  }

  //Retorna lista de relatorio entre um periodo de datas e pelo id do paciente
  getAllReportByPeriodEPaciente(dataIni, dataFim, prontuario): Observable<any> {
    return this.http.get(this.baseUrl + "report/periodo/" + dataIni + "/" + dataFim + "/paciente/" + prontuario + "/", { headers: this.httpHeaders });
  }

  //Retorna lista de relatorio entre um periodo de datas
  getAllReportByPeriodo(dataIni, dataFim): Observable<any> {
    return this.http.get(this.baseUrl + "report/" + dataIni + "/" + dataFim + "/", { headers: this.httpHeaders });
  }

  //Retorna lista de relatorio entre um periodo de datas e pelo id do convenio
  getAllReportByPeriodEConvenio(dataIni, dataFim, convenioId): Observable<any> {
    return this.http.get(this.baseUrl + "report/periodo/" + dataIni + "/" + dataFim + "/convenio/" + convenioId + "/", { headers: this.httpHeaders });
  }

  //Retorna lista de relatorio entre um periodo de datas e pelo id do funcionario
  getAllReportByPeriodoEFuncinario(dataIni, dataFim, funcionarioId): Observable<any> {
    return this.http.get(this.baseUrl + "report/periodo/" + dataIni + "/" + dataFim + "/funcionario/" + funcionarioId + "/", { headers: this.httpHeaders });
  }

}
