import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import baseUrl from '../url';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  token = this.tokenStorage.getToken();
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);


  getAllFuncionarios(): Observable<Funcionario[]> {
    return this.http
      .get<Funcionario[]>(`${baseUrl}funcionario/`, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) =>
          data.map((data) => new Funcionario().deserializable(data))
        )
      );
  }


  getFuncionario(funcionarioId): Observable<Funcionario> {
    return this.http
      .get<Funcionario>(`${baseUrl}funcionario/${funcionarioId}/`, {

        headers: this.httpHeaders,
      })
      .pipe(map((data) => new Funcionario().deserializable(data)));
  }


  getMedicos(): Observable<Funcionario[]> {
    return this.http
      .get<Funcionario[]>(`${baseUrl}funcionario/listar/medicos/`, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) =>
          data.map((data) => new Funcionario().deserializable(data))
        )
      );
  }


  updateFuncionario(funcionario): Observable<any> {
    return this.http.put(`${baseUrl}funcionario/`, funcionario, {
      headers: this.httpHeaders,
    });
  }


  saveFuncionario(funcionario): Observable<any> {
    console.log(funcionario)
    return this.http.post(`${baseUrl}funcionario/`, funcionario, {
      headers: this.httpHeaders,
    });
  }


  deleteFuncionario(funcinoarioId) {
    return this.http.delete(baseUrl + 'funcionario/' + funcinoarioId + '/', {
      headers: this.httpHeaders,
    });
  }


  findByName(nome): Observable<any> {
    return this.http.get(`${baseUrl}funcionario/nome/${nome}/`, {
      headers: this.httpHeaders,
    });
  }



  findByCPF(cpf): Observable<any> {
    return this.http.get(`${baseUrl}funcionario/cpf/${cpf}/`, {
      headers: this.httpHeaders,
    });
  }


  findByCRM(crm): Observable<any> {
    return this.http.get(`${baseUrl}funcionario/crm/${crm}/`, {
      headers: this.httpHeaders,
    });
  }


  findByMatricula(matricula): Observable<any> {
    return this.http.get(`${baseUrl}funcionario/matricula/${matricula}/`, {
      headers: this.httpHeaders,
    });
  }


  findByCelular(celular): Observable<any> {
    return this.http.get(`${baseUrl}funcionario/celular/${celular}/`, {

      headers: this.httpHeaders,
    });
  }


  findByEspecialidade(especialidade): Observable<any> {
    return this.http.get(
      baseUrl + 'funcionario/especialidade/' + especialidade + '/',
      { headers: this.httpHeaders }
    );
  }


  updatePassword(funcionario): Observable<any> {
    return this.http.post(`${baseUrl}funcionario/atualizarSenha/`, funcionario, { headers: this.httpHeaders })
  }
}
