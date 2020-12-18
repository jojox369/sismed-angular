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
  constructor(private http: HttpClient, private userService: UserService) { }

  // Retorna uma lista de convenios aceitos pelo medico
  getAcceptedConvenios(funcionarioId): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(
      baseUrl + 'funcionarioTConvenio/conveniosAceitos/' + funcionarioId + '/',
      { headers: this.httpHeaders }
    );
  }

  // Função que retorna a lista de tipos de convenios aceitos pelo medico
  getAcceptedTipos(funcionarioId, convenioId): Observable<any> {
    return this.http.get(
      baseUrl + 'funcionarioTConvenio/' + funcionarioId + '/tiposAceitos/' + convenioId + '/',
      { headers: this.httpHeaders }
    );
  }

  // Retorna uma lista de convenios não aceitos pelo medico
  getUnAccpetedConvenios(funcionarioId): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(
      baseUrl + 'funcionarioTConvenio/conveniosNaoAceitos/' + funcionarioId + '/',
      { headers: this.httpHeaders }
    );
  }

  // função para buscar os tipos de convenios não aceitos pelo medico
  getUnresgisteredTiposConveio(funcionarioId, convenioId): Observable<any> {
    return this.http.get(
      baseUrl +
      'funcionarioTConvenio/tiposNaoAceitos/' +
      funcionarioId +
      '/' +
      convenioId +
      '/',
      { headers: this.httpHeaders }
    );
  }

  // Função que salva os novos tipos de convenio aceitos pelo medico
  saveTiposFuncionario(funcionarioTConvenio): Observable<any> {
    return this.http.post(baseUrl + 'funcionarioTConvenio/', funcionarioTConvenio, {
      headers: this.httpHeaders,
    });
  }


  // deleta os tipos selecionados
  deleteTiposFuncionario(funcionarioTipo): Observable<any> {
    const options = {
      headers: this.httpHeaders,
      body: funcionarioTipo,
    };
    console.log(funcionarioTipo)
    return this.http.delete(
      baseUrl + 'funcionarioTConvenio/', options
    );
  }
}
