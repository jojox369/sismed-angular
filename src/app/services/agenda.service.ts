import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Agenda, Agendar } from '../models/agenda';
import { map } from 'rxjs/operators';
import baseUrl from '../url';
import { TokenStorageService } from './token-storage-service.service';



@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  token = this.tokenStorage.getToken();

  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  // Faz requisição a API, que retorna uma lista com todos os agendamentos
  getAllAgendamentos(medicoId): Observable<Agenda[]> {
    return this.http
      .get<Agenda[]>(`${baseUrl}agenda/${medicoId}/`, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) => data.map((data) => new Agenda().deserializable(data)))
      );
  }

  // Retorna uma lista de agendamentos a partir de uma data e do id do medico
  getAgendamentos(medicoId, date): Observable<Agenda[]> {
    return this.http
      .get<Agenda[]>(`${baseUrl}agenda/${medicoId}/${date}/`,
        { headers: this.httpHeaders })
      .pipe(
        map((data) => data.map((data) => new Agenda().deserializable(data)))
      );
  }

  // Faz requisição a API, que retorna um unico convenio
  getAgendamento(agendamentoId): Observable<Agenda> {
    return this.http
      .get<Agenda>(
        `${baseUrl}agenda/agendamento/detalhes/${agendamentoId}/`,

        { headers: this.httpHeaders }
      )
      .pipe(map((data) => new Agenda().deserializable(data)));
  }

  updateAgendamento(agendamento: Agenda): Observable<any> {

    return this.http.put(
      `${baseUrl}agenda/`, agendamento, { headers: this.httpHeaders }
    );
  }

  // Busca o ultimo agendamento do paciente
  lastAgendamento(protuario): Observable<Agenda> {
    return this.http
      .get<Agenda>(`${baseUrl}agenda/paciente/ultimoAgendamento/` + protuario + '/', {

        headers: this.httpHeaders,
      })

  }

  // Metodo para agendar paciente ja cadastrado
  agendar(agendamento: Agendar): Observable<any> {
    return this.http.post(`${baseUrl}agenda/`, agendamento, {

      headers: this.httpHeaders,
    });
  }

  anteriores(pacienteId): Observable<any> {
    return this.http.get(
      `${baseUrl}agenda/agendamentos/anteriores/${pacienteId}/`,

      { headers: this.httpHeaders }
    );
  }

  deleteAgendamento(agendamentoId): Observable<any> {
    return this.http.delete(`${baseUrl}agenda/${agendamentoId}`, {

      headers: this.httpHeaders,
    });
  }



  agendamentoPreCadastro(agendamentoPreCadastro): Observable<any> {
    return this.http.post(`${baseUrl}agenda/preCadastro/`, agendamentoPreCadastro,
      { headers: this.httpHeaders }
    )
  }
}
