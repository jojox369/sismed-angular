import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  constructor(private http: HttpClient, private userService: UserService) { }

  token = this.userService.token;
  baseUrl = 'https://sismed-api.herokuapp.com/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);


  // Função que retorna uma lista com todos os funcionarios
  getAllFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl + 'funcionarios/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Funcionario().deserializable(data)))
    );
  };

  // Função que retorna as informações de um funcionario
  getFuncionario(funcionarioId): Observable<Funcionario> {
    return this.http.get<Funcionario>(this.baseUrl + 'funcionarios/' + funcionarioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => new Funcionario().deserializable(data))
    );
  }

  // Função que retorna uma lista com todos os medicos
  getMedicos(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl + 'medicos/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Funcionario().deserializable(data)))
    );
  };

  // Função que atualiza um funcionario
  updateFuncionario(funcionario): Observable<any> {
    return this.http.put(this.baseUrl + 'funcionarios/' + funcionario.id + '/', funcionario, { headers: this.httpHeaders });
  }

  // Função que salva um novo funcionario
  saveFuncionario(funcionario): Observable<any> {
    return this.http.post(this.baseUrl + 'funcionarios/', funcionario, { headers: this.httpHeaders });
  }

  // Função para exlcuir un funcionario
  deleteFuncionario(funcinoarioId) {
    return this.http.delete(this.baseUrl + 'funcionarios/' + funcinoarioId + '/', { headers: this.httpHeaders });
  }

  // Função de pesquisa pelo nome do funcionario
  findByName(name): Observable<any> {
    return this.http.get(this.baseUrl + 'funcionarios/nome/' + name + '/', { headers: this.httpHeaders });
  }

  // Função de pesquisa pelo cpf do funcionario

  findByCPF(cpf): Observable<any> {
    return this.http.get(this.baseUrl + 'funcionarios/cpf/' + cpf + '/', { headers: this.httpHeaders });
  }

  // Função de pesquisa pelo crm do funcionario
  findByCRM(crm): Observable<any> {
    return this.http.get(this.baseUrl + 'funcionarios/crm/' + crm + '/', { headers: this.httpHeaders });
  }

  // Função de pesquisa pela matricula(id) do funcionario
  findByMatricula(matricula): Observable<any> {
    return this.http.get(this.baseUrl + 'funcionarios/matricula/' + matricula + '/', { headers: this.httpHeaders });
  }

  // Função de pesquisa pelo celular do funcionario
  findByCelular(celular): Observable<any> {
    return this.http.get(this.baseUrl + 'funcionarios/celular/' + celular + '/', { headers: this.httpHeaders });
  }

  // Função de pesquisa pela especialidade do funcionario
  findByEspecialidade(especialidade): Observable<any> {
    return this.http.get(this.baseUrl + 'funcionarios/especialidade/' + especialidade + '/', { headers: this.httpHeaders });
  }

  recoverPassword(cpf): Observable<Funcionario> {
    return this.http.get<Funcionario>(this.baseUrl + 'recover-password/' + cpf + '/', { headers: { 'Content-Type': 'application/json' } });
  }

  getVerificarionCode(cpf): Observable<any> {
    return this.http.get<Funcionario>(this.baseUrl + 'funcionario/code/' + cpf + '/', { headers: { 'Content-Type': 'application/json' } });

  }
}
