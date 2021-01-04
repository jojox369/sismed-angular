import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Exame } from '../models/exame';
import { map } from 'rxjs/operators';
import baseUrl from '../url';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class ExameService {
  token = this.tokenStorage.getToken();
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }


  getAll(): Observable<Exame[]> {
    return this.http
      .get<Exame[]>(`${baseUrl}exame`, { headers: this.httpHeaders })
      .pipe(
        map((data) => data.map((data) => new Exame().deserializable(data)))
      );
  }


  getById(exameId): Observable<Exame> {
    return this.http
      .get<Exame>(`${baseUrl}exame/${exameId}`, {
        headers: this.httpHeaders,
      })
      .pipe(map((data) => new Exame().deserializable(data)));
  }


  update(exame: Exame): Observable<any> {
    return this.http.put(`${baseUrl}exame/`, exame, {
      headers: this.httpHeaders,
    });
  }


  delete(id): Observable<any> {
    return this.http.delete(`${baseUrl}exame/${id}`, {
      headers: this.httpHeaders,
    });
  }


  save(exame: Exame): Observable<any> {
    return this.http.post(`${baseUrl}exame/`, exame, {
      headers: this.httpHeaders,
    });
  }


  search(pacienteName: string, dataColeta: string, exameName: string): Observable<Exame[]> {
    let url = `${baseUrl}exame/pesquisa/composta?`;
    if (pacienteName) {
      url += `pacienteNome=${pacienteName}`;
    }
    if (dataColeta) {
      if (pacienteName) {
        url += `&dataColeta=${dataColeta}`;
      } else {
        url += `dataColeta=${dataColeta}`
      }
    }
    if (exameName) {
      if (pacienteName || dataColeta) {
        url += `&exame=${exameName}`;
      } else {
        url += `exame=${exameName}`
      }
    }
    return this.http.get<Exame[]>(url, { headers: this.httpHeaders }).pipe(
      map((data) => data.map((data) => new Exame().deserializable(data)))
    );
  }
}
