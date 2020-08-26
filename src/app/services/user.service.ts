import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from 'src/app/models/funcionario';
import { User } from 'src/app/models/user';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  token = sessionStorage.getItem('token');
  baseUrl = 'http://localhost:8000/';

  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient) { }

  // Realiza a autenticação e retorna o token que sera ultilizado para realizar as requisições
  login(user): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/', user, { headers: { 'Content-Type': 'application/json' } });
  }

  // Salva o login do funcionario
  save(user): Observable<any> {
    return this.http.post(this.baseUrl + 'users/', user, { headers: this.httpHeaders });
  }

  // Pega as informações do funcionario que realizou o login
  createSession(cpf): Observable<Funcionario> {
    this.token = sessionStorage.getItem('token');
    return this.http.get<Funcionario>(this.baseUrl + 'funcionario/login/' + cpf + '/', { headers: { 'Content-Type': 'application/json' } });
  }


  // Salva as informações do funcionario na tabela de login usada no SISMED JAVA
  loginRegister(funcionario): Observable<any> {
    return this.http.post(this.baseUrl + 'login/', funcionario, { headers: this.httpHeaders });
  }

  // Retorna a lista de usarios cadastrados na tabela do DJANGO
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users/', { headers: { 'Content-Type': 'application/json' } });
  }

  deleteUser(userId): Observable<any> {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/', { headers: this.httpHeaders });
  }

  updatePassword(userId, user): Observable<any> {
    return this.http.put(this.baseUrl + 'users/' + userId + '/', user, { headers: { 'Content-Type': 'application/json' } });
  }



}
