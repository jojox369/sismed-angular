import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { Registroclinico } from '../models/registroclinico';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class RegistroclinicoService {
  token = this.userService.token;
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  getRegistros(): Observable<Registroclinico[]> {
    return this.http
      .get<Registroclinico[]>(baseUrl + 'registroClinico/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) =>
          data.map((data) => new Registroclinico().deserializable(data))
        )
      );
  }

  getRegistrosAnteriores(pacienteId: number): Observable<Registroclinico[]> {
    return this.http
      .get<Registroclinico[]>(
        baseUrl + 'registrosanteriores/' + pacienteId + '/',
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) =>
          data.map((data) => new Registroclinico().deserializable(data))
        )
      );
  }

  saveRegistroClinico(registroClinico: Registroclinico) {
    return this.http.post(baseUrl + 'registroclinico/', registroClinico, {
      headers: this.httpHeaders,
    });
  }

  getRegistrosPorPaciente(prontuario: number, medicoId: number): Observable<Registroclinico[]> {
    return this.http
      .get<Registroclinico[]>(
        `${baseUrl}registroClinico/paciente/${prontuario}/medico/${medicoId}`,
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) =>
          data.map((data) => new Registroclinico().deserializable(data))
        )
      );
  }

  getByNome(nome: string): Observable<Registroclinico[]> {
    return this.http
      .get<Registroclinico[]>(
        `${baseUrl}registroClinico/nome/${nome}`,
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) =>
          data.map((data) => new Registroclinico().deserializable(data))
        )
      );
  }

  getByProntuario(prontuario: number): Observable<Registroclinico[]> {
    return this.http
      .get<Registroclinico[]>(
        `${baseUrl}registroClinico/prontuario/${prontuario}`,
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) =>
          data.map((data) => new Registroclinico().deserializable(data))
        )
      );
  }

  getByData(data: string): Observable<Registroclinico[]> {
    return this.http
      .get<Registroclinico[]>(
        `${baseUrl}registroClinico/data/${data}`,
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) =>
          data.map((data) => new Registroclinico().deserializable(data))
        )
      );
  }

}
