import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoConvenio } from '../models/tipo-convenio';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class TipoConvenioService {
  token = this.userService.token;
  baseUrl = 'https://sismed-api.herokuapp.com/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  // Faz requisição a API, que retorna uma lista com todos os tipos convenio a partir de um convenio
  getAll(convenioId): Observable<TipoConvenio[]> {
    return this.http.get<TipoConvenio[]>(this.baseUrl + 'tiposConvenio/' + convenioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new TipoConvenio().deserializable(data)))
    );
  }

  // Faz requisição a API, que retorna um unico tipo de convenio
  getById(tipoConvenioId): Observable<TipoConvenio> {
    return this.http.get<TipoConvenio>(this.baseUrl + 'tipoConvenio/' + tipoConvenioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => new TipoConvenio().deserializable(data)));
  }

  // Faz requisição a API para salvar um tipo de convenio
  save(tipoConvenio): Observable<any> {
    return this.http.post(this.baseUrl + 'tiposConvenio/' + tipoConvenio.convenio + '/', tipoConvenio, { headers: this.httpHeaders });
  }

  // Faz requisição a API para atualizar um tipo de convenio
  update(tipoConvenioDetail): Observable<any> {
    return this.http.put(this.baseUrl + 'tiposConvenio/' + tipoConvenioDetail.convenio + '/' + tipoConvenioDetail.id + '/', tipoConvenioDetail, { headers: this.httpHeaders });
  }

  // Faz requisição a API para deletar um tipo de convenio
  delete(id) {
    return this.http.delete(this.baseUrl + 'tipoConvenio/' + id + '/', { headers: this.httpHeaders });
  }

  // Função que faz a pesquisa em tipos a partir do nome
  getByName(convenioId, name): Observable<any> {
    return this.http.get(this.baseUrl + 'tiposConvenio/nome/' + convenioId + '/' + name + '/', { headers: this.httpHeaders });
  }


}
