import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from 'src/app/models/funcionario';
import { User } from 'src/app/models/user';
import baseUrl from '../url';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }


  login(user): Observable<any> {
    return this.http.post(`${baseUrl}usuario/autenticacao`, user, {
      headers: this.httpHeaders,
    });
  }


  verifyUsername(username: string): Observable<User> {
    return this.http.get<User>(`${baseUrl}usuario/verificarUsuario/${username}`, {
      headers: this.httpHeaders,
    }).pipe(map((data) => new User().deserializable(data)));
  }

  updatePassword(funcionario): Observable<any> {
    return this.http.post(`${baseUrl}usuario/atualizarSenha/`, funcionario, { headers: this.httpHeaders })
  }

}
