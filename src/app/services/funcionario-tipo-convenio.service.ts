import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { Convenio } from '../models/convenio';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioTipoConvenioService {
  token = this.userService.token;

  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);
  constructor(private http: HttpClient, private userService: UserService) {}

  // Retorna uma lista de convenios aceitos pelo medico
  getAcceptedConvenios(funcionarioId): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(
      baseUrl + 'convenios/accepted/' + funcionarioId + '/',
      { headers: this.httpHeaders }
    );
  }

  // Retorna uma lista de convenios não aceitos pelo medico
  getUnAccpetedConvenios(funcionarioId): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(
      baseUrl + 'convenios/unaccepted/' + funcionarioId + '/',
      { headers: this.httpHeaders }
    );
  }

  // função para buscar os tipos de convenios não aceitos pelo medico
  getUnresgisteredTiposConveio(funcionarioId, convenioId): Observable<any> {
    return this.http.get(
      baseUrl +
        'tiposUnregistered/funcionario/' +
        funcionarioId +
        '/' +
        convenioId +
        '/',
      { headers: this.httpHeaders }
    );
  }

  // Função que salva os novos tipos de convenio aceitos pelo medico
  saveTiposFuncionario(funcionarioTipos): Observable<any> {
    return this.http.post(baseUrl + 'funcionarioTipos/', funcionarioTipos, {
      headers: this.httpHeaders,
    });
  }

  // Função que retorna a lista de tipos de convenios aceitos pelo medico
  getAcceptedTipos(funcionarioId, convenioId): Observable<any> {
    return this.http.get(
      baseUrl + 'tiposAccepted/' + funcionarioId + '/' + convenioId + '/',
      { headers: this.httpHeaders }
    );
  }

  // recupera a lista de tipos a ser excluida
  getFuncionarioTipoDetail(funcionarioId, tipoConvenioId): Observable<any> {
    return this.http.get(
      baseUrl + 'funcionarioTipo/' + funcionarioId + '/' + tipoConvenioId + '/',
      { headers: this.httpHeaders }
    );
  }

  // deleta os tipos selecionados
  deleteTiposFuncionario(funcionarioTipoId): Observable<any> {
    return this.http.delete(
      baseUrl + 'funcionarioTipos/' + funcionarioTipoId + '/',
      { headers: this.httpHeaders }
    );
  }
}
