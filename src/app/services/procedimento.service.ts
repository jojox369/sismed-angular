import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procedimento } from 'src/app/models/procedimento';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService {

  constructor(private http: HttpClient, private userService: UserService) { }

  token = this.userService.token;
  baseUrl = 'https://sismed-api.herokuapp.com/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  // Função que retorna uma de procedimentos
  getAll(convenioId): Observable<Procedimento[]> {
    return this.http.get<Procedimento[]>(this.baseUrl + 'procedimentos/' + convenioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Procedimento().deserializable(data)))
    );
  }

  // Função que retorna um procedimento
  getById(procedimentoId): Observable<Procedimento> {
    return this.http.get<Procedimento>(this.baseUrl + 'procedimento/' + procedimentoId + '/', { headers: this.httpHeaders }).pipe(
      map(data => new Procedimento().deserializable(data)));
  }

  // Função para atualizar um procedimento
  update(procedimento): Observable<any> {
    return this.http.put(this.baseUrl + 'procedimentos/' + procedimento.convenio + '/' + procedimento.id + '/', procedimento, { headers: this.httpHeaders });
  }

  // Função para excluir um procedimento
  delete(procedimento) {
    return this.http.delete(this.baseUrl + 'procedimentos/' + procedimento.convenio + '/' + procedimento.id + '/', { headers: this.httpHeaders });
  }

  // Função para salvar um procedimento
  save(procedimento) {
    return this.http.post(this.baseUrl + 'procedimentos/' + procedimento.convenio + '/', procedimento, { headers: this.httpHeaders });
  }

  getByDescription(convenioId, description): Observable<any> {
    return this.http.get(this.baseUrl + 'procedimentos/desc/' + convenioId + '/' + description + '/', { headers: this.httpHeaders });
  }
}
