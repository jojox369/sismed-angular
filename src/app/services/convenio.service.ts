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
  constructor(private http: HttpClient, private userService: UserService) { }


  getAll(): Observable<Convenio[]> {
    return this.http
      .get<Convenio[]>(baseUrl + 'convenio/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) => data.map((data) => new Convenio().deserializable(data)))
      );
  }


  getById(id): Observable<Convenio> {
    return this.http
      .get<Convenio>(baseUrl + 'convenio/' + id + '/', {
        headers: this.httpHeaders,
      })
      .pipe(map((data) => new Convenio().deserializable(data)));
  }


  update(convenio): Observable<any> {
    return this.http.put(baseUrl + 'convenio/', convenio, {
      headers: this.httpHeaders,
    });
  }


  save(convenio) {
    return this.http.post(baseUrl + 'convenio/', convenio, {
      headers: this.httpHeaders,
    });
  }


  delete(id) {
    return this.http.delete(baseUrl + 'convenio/' + id + '/', {
      headers: this.httpHeaders,
    });
  }


  getByNome(nome): Observable<any> {
    return this.http.get(baseUrl + 'convenio/nome/' + nome + '/', {
      headers: this.httpHeaders,
    });
  }


  getByCnpj(cnpj): Observable<any> {
    return this.http.get(baseUrl + 'convenio/cnpj/' + cnpj + '/', {
      headers: this.httpHeaders,
    });
  }


  getByAns(ans): Observable<any> {
    return this.http.get(baseUrl + 'convenio/ans/' + ans + '/', {
      headers: this.httpHeaders,
    });
  }
}
