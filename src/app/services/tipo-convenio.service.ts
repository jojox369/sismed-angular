import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoConvenio } from '../models/tipo-convenio';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class TipoConvenioService {
  token = this.userService.token;
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  // Faz requisição a API, que retorna uma lista com todos os tipos convenio a partir de um convenio
  getAll(convenioId): Observable<TipoConvenio[]> {
    return this.http
      .get<TipoConvenio[]>(baseUrl + 'tiposConvenio/' + convenioId + '/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) =>
          data.map((data) => new TipoConvenio().deserializable(data))
        )
      );
  }

  // Faz requisição a API, que retorna um unico tipo de convenio
  getById(tipoConvenioId): Observable<TipoConvenio> {
    return this.http
      .get<TipoConvenio>(baseUrl + 'tiposConvenio/detalhes/' + tipoConvenioId + '/', {
        headers: this.httpHeaders,
      })
      .pipe(map((data) => new TipoConvenio().deserializable(data)));
  }

  // Faz requisição a API para salvar um tipo de convenio
  save(tipoConvenio): Observable<any> {
    return this.http.post(
      baseUrl + 'tiposConvenio/',
      tipoConvenio,
      { headers: this.httpHeaders }
    );
  }

  // Faz requisição a API para atualizar um tipo de convenio
  update(tipoConvenioDetail): Observable<any> {
    return this.http.put(baseUrl + 'tiposConvenio/', tipoConvenioDetail,
      { headers: this.httpHeaders }
    );
  }

  // Faz requisição a API para deletar um tipo de convenio
  delete(id) {
    return this.http.delete(baseUrl + 'tiposConvenio/' + id + '/', {
      headers: this.httpHeaders,
    });
  }

  // Função que faz a pesquisa em tipos a partir do nome
  getByName(convenioId, name): Observable<any> {
    return this.http.get(
      baseUrl + 'tiposConvenio/nome/' + name + '/convenio/' + convenioId + '/',
      { headers: this.httpHeaders }
    );
  }
}
