import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Convenio } from '../models/convenio';
import { UserService } from './user.service';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class ConvenioService {
  token = this.userService.token;

  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);
  constructor(private http: HttpClient, private userService: UserService) {}

  // Faz requisição a API, que retorna uma lista com todos os convenios
  getAll(): Observable<Convenio[]> {
    return this.http
      .get<Convenio[]>(baseUrl + 'convenios/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) => data.map((data) => new Convenio().deserializable(data)))
      );
  }

  // Faz requisição a API, que retorna um unico convenio
  getById(id): Observable<Convenio> {
    return this.http
      .get<Convenio>(baseUrl + 'convenios/' + id + '/', {
        headers: this.httpHeaders,
      })
      .pipe(map((data) => new Convenio().deserializable(data)));
  }

  // Faz requisição a API para atualizar um convenio
  update(convenio): Observable<any> {
    return this.http.put(baseUrl + 'convenios/' + convenio.id + '/', convenio, {
      headers: this.httpHeaders,
    });
  }

  // Faz requisição a API para salvar um convenio
  save(convenio) {
    return this.http.post(baseUrl + 'convenios/', convenio, {
      headers: this.httpHeaders,
    });
  }

  // Faz requisição a API para deletar um convenio
  delete(id) {
    return this.http.delete(baseUrl + 'convenios/' + id + '/', {
      headers: this.httpHeaders,
    });
  }

  // Faz requisição a API, que retorna uma lista de convenio a partir do nome
  getByNome(nome): Observable<any> {
    return this.http.get(baseUrl + 'convenio/nome/' + nome + '/', {
      headers: this.httpHeaders,
    });
  }

  // Faz requisição a API, que retorna uma lista de convenio a partir do cnpj
  getByCnpj(cnpj): Observable<any> {
    return this.http.get(baseUrl + 'convenio/cnpj/' + cnpj + '/', {
      headers: this.httpHeaders,
    });
  }

  // Faz requisição a API, que retorna uma lista de convenio a partir do ans
  getByAns(ans): Observable<any> {
    return this.http.get(baseUrl + 'convenio/ans/' + ans + '/', {
      headers: this.httpHeaders,
    });
  }
}
