import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Laboratorio } from '../models/laboratorio';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  token = this.userService.token;
  baseUrl = 'http://localhost:8000/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);
  constructor(private http: HttpClient, private userService: UserService) { }

  // Retorna uma lista com todos os laboratorios
  getAll(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.baseUrl + 'laboratorios/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Laboratorio().deserializable(data)))
    );
  }

  // retorna uma lista de laboratorio filtradas pelo nome
  getByName(name: string): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.baseUrl + 'laboratorios/name/' + name + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Laboratorio().deserializable(data)))
    );
  }

  // retorna uma lista de laboratorio filtradas pelo telefone
  getByPhone(phone: string): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.baseUrl + 'laboratorios/telefone/' + phone + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Laboratorio().deserializable(data)))
    );
  }

  // retorna uma lista de laboratorio filtradas pelo bairro
  getByBairro(bairro: string): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.baseUrl + 'laboratorios/bairro/' + bairro + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Laboratorio().deserializable(data)))
    );
  }

  // retorna uma lista de laboratorio filtradas pelo tipo de convenio
  getByTipoConvenio(tipoConvenioId: number): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.baseUrl + 'laboratorios/tipoConvenio/' + tipoConvenioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Laboratorio().deserializable(data)))
    );
  }

  // Salva o laboratorio
  save(laboratorio: Laboratorio): Observable<any> {
    return this.http.post(this.baseUrl + 'laboratorios/', laboratorio, { headers: this.httpHeaders });
  }

  // Atualiza o laboratorio
  update(laboratorio: Laboratorio): Observable<any> {
    return this.http.put(this.baseUrl + 'laboratorios/' + laboratorio.id + '/', laboratorio, { headers: this.httpHeaders });
  }

  delete(laboratorioId): Observable<any> {
    return this.http.delete(this.baseUrl + 'laboratorios/' + laboratorioId + '/', { headers: this.httpHeaders });
  }

  // recupera um laboratorio pelo id
  getById(id): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(this.baseUrl + 'laboratorios/' + id + '/', { headers: this.httpHeaders }).pipe(
      map(data => new Laboratorio().deserializable(data))
    );
  }
}
