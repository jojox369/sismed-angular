import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from 'src/app/models/funcionario';
import { User } from 'src/app/models/user';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  token = sessionStorage.getItem('token');
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient) { }

  // Realiza a autenticação e retorna o token que sera ultilizado para realizar as requisições
  login(user): Observable<any> {
    return this.http.post(baseUrl + 'autenticacao/', user, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Salva o login do funcionario
  save(user): Observable<any> {
    return this.http.post(baseUrl + 'users/', user, {
      headers: this.httpHeaders,
    });
  }



  // Salva as informações do funcionario na tabela de login usada no SISMED JAVA
  loginRegister(funcionario): Observable<any> {
    return this.http.post(baseUrl + 'login/', funcionario, {
      headers: this.httpHeaders,
    });
  }

  // Retorna a lista de usarios cadastrados na tabela do DJANGO
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl + 'users/', {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteUser(userId): Observable<any> {
    return this.http.delete(baseUrl + 'users/' + userId + '/', {
      headers: this.httpHeaders,
    });
  }

  updatePassword(userId, user): Observable<any> {
    return this.http.put(baseUrl + 'users/' + userId + '/', user, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
