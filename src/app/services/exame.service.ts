import { ExameDetail } from './../models/exame';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Exame } from '../models/exame';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  token = this.userService.token;
  baseUrl = 'http://localhost:8000/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);
  constructor(private http: HttpClient, private userService: UserService) { }

  // Recupera todos os exames
  getAll(): Observable<Exame[]> {
    return this.http.get<Exame[]>(this.baseUrl + 'exames/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Exame().deserializable(data)))
    );
  }

  // Recupera detalhes do exame pelo seu id
  getById(exameId): Observable<ExameDetail> {
    return this.http.get<ExameDetail>(this.baseUrl + 'exames/' + exameId + '/', { headers: this.httpHeaders }).pipe(
      map(data => new ExameDetail().deserializable(data))
    );
  }

  // Solicita ao back que o exame seja atualizado
  update(exame: ExameDetail): Observable<any> {
    return this.http.put(this.baseUrl + 'exames/' + exame.id + '/', exame, { headers: this.httpHeaders });
  }

  // Solicita ao back-end que o exame seja excluido
  delete(id): Observable<any> {
    return this.http.delete(this.baseUrl + 'exames/' + id + '/', { headers: this.httpHeaders });
  }

  // Solicita ao back que um novo exame seja cadastrado
  save(exame: ExameDetail): Observable<any> {
    return this.http.post(this.baseUrl + 'exames/', exame, { headers: this.httpHeaders });
  }

  // Solicita ao back uma lista de exames pelo nome de paciente
  getByPaciente(pacienteName): Observable<Exame[]> {
    return this.http.get<Exame[]>(this.baseUrl + 'exames/paciente/' + pacienteName + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Exame().deserializable(data)))
    );
  }


  // Solicita ao back uma lista de exames pelo nome do exame
  getByName(exameName): Observable<Exame[]> {
    return this.http.get<Exame[]>(this.baseUrl + 'exames/name/' + exameName + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Exame().deserializable(data)))
    );
  }

  getByDataColeta(dataColeta): Observable<Exame[]> {
    return this.http.get<Exame[]>(this.baseUrl + 'exames/dataColeta/' + dataColeta + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Exame().deserializable(data)))
    );
  }

  // Solicita ao back uma lista de exames pelo nome de paciente e pelo nome do exame
  getByPacienteExame(pacienteName, exameName): Observable<Exame[]> {
    return this.http.get<Exame[]>(this.baseUrl + 'exames/paciente/' + pacienteName + '/exame/' + exameName + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Exame().deserializable(data)))
    );
  }

  // Solicita ao back uma lista de exames pelo nome de paciente e pela data de coleta
  getByExameDataColeta(exameName, dataColeta): Observable<Exame[]> {
    return this.http.get<Exame[]>(this.baseUrl + 'exames/name/' + exameName + '/dataColeta/' + dataColeta + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Exame().deserializable(data)))
    );
  }


}
