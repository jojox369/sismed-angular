import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Agenda, Agendar } from '../models/agenda';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  token = this.userService.token;
  baseUrl = 'https://sismed-api.herokuapp.com/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }


  // Faz requisição a API, que retorna uma lista com todos os agendamentos
  getAllAgendamentos(medicoId): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(this.baseUrl + 'agenda/' + medicoId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Agenda().deserializable(data)))
    );
  }

  // Retorna uma lista de agendamentos a partir de uma data e do id do medico
  getAgendamentos(medicoId, date): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(this.baseUrl + 'agendamentos/' + medicoId + '/' + date + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Agenda().deserializable(data)))
    );
  }

  // Faz requisição a API, que retorna um unico convenio
  getAgendamento(medicoId, agendamentoId): Observable<Agendar> {
    return this.http.get<Agendar>(this.baseUrl + 'agenda/' + medicoId + '/' + agendamentoId + '/', { headers: this.httpHeaders }).pipe(
      map(data => new Agendar().deserializable(data))
    );
  }

  updateAgendamento(agendamento: Agendar): Observable<any> {
    return this.http.put(this.baseUrl + 'agendar/' + agendamento.id + '/', agendamento, { headers: this.httpHeaders });
  }

  // Busca o ultimo agendamento do paciente
  lastAgendamento(protuario): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(this.baseUrl + 'agenda/last/' + protuario + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Agenda().deserializable(data)))
    );
  }

  // Metodo para agendar paciente ja cadastrado
  agendar(agendamento: Agendar): Observable<any> {
    return this.http.post(this.baseUrl + 'agendar/', agendamento, { headers: this.httpHeaders });
  }

  anteriores(pacienteId): Observable<any> {
    return this.http.get(this.baseUrl + 'agendamentos/anteriores/' + pacienteId + '/', { headers: this.httpHeaders });
  }

  // verefica se ja existe um agendamento para um medico
  verifyAgendamento(date, time, medicoId): Observable<any> {
    return this.http.get(this.baseUrl + 'verify/' + date + '/' + time + '/' + medicoId + '/', { headers: this.httpHeaders });
  }

  deleteAgendamento(agendamentoId): Observable<any> {
    return this.http.delete(this.baseUrl + 'agendar/' + agendamentoId + '/', { headers: this.httpHeaders });
  }

  getAgendamentoById(id: string) {
    return this.http.get(this.baseUrl + 'agendamento/' + id + '/', { headers: this.httpHeaders });
  }
}
