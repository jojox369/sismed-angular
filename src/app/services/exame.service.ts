import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Exame } from '../models/exame';
import { map } from 'rxjs/operators';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class ExameService {
  token = this.userService.token;
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);
  constructor(private http: HttpClient, private userService: UserService) { }


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


  getByPaciente(pacienteName): Observable<Exame[]> {
    return this.http
      .get<Exame[]>(baseUrl + 'exames/paciente/' + pacienteName + '/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) => data.map((data) => new Exame().deserializable(data)))
      );
  }


  getByName(exameName): Observable<Exame[]> {
    return this.http
      .get<Exame[]>(baseUrl + 'exames/name/' + exameName + '/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) => data.map((data) => new Exame().deserializable(data)))
      );
  }

  getByDataColeta(dataColeta): Observable<Exame[]> {
    return this.http
      .get<Exame[]>(baseUrl + 'exames/dataColeta/' + dataColeta + '/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) => data.map((data) => new Exame().deserializable(data)))
      );
  }


  getByPacienteExame(pacienteName, exameName): Observable<Exame[]> {
    return this.http
      .get<Exame[]>(
        baseUrl +
        'exames/paciente/' +
        pacienteName +
        '/exame/' +
        exameName +
        '/',
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) => data.map((data) => new Exame().deserializable(data)))
      );
  }


  getByExameDataColeta(exameName, dataColeta): Observable<Exame[]> {
    return this.http
      .get<Exame[]>(
        baseUrl +
        'exames/name/' +
        exameName +
        '/dataColeta/' +
        dataColeta +
        '/',
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) => data.map((data) => new Exame().deserializable(data)))
      );
  }
}
