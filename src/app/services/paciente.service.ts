import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente, PacientePost } from '../models/paciente';
import { UserService } from './user.service';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  token = this.userService.token;
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  getAllPacientes(): Observable<Paciente[]> {
    return this.http
      .get<Paciente[]>(baseUrl + 'paciente/', { headers: this.httpHeaders })
      .pipe(
        map((data) => data.map((data) => new Paciente().deserializable(data)))
      );
  }

  getPacienteByName(name: string): Observable<any> {
    return this.http.get(baseUrl + 'paciente/nome/' + name + '/', {
      headers: this.httpHeaders,
    });
  }

  getPacienteByProntuario(prontuario: Number): Observable<any> {
    return this.http.get(baseUrl + 'paciente/prontuario/' + prontuario + '/', {
      headers: this.httpHeaders,
    });
  }

  getPacienteByCpf(cpf: string): Observable<any> {
    return this.http.get(baseUrl + 'paciente/cpf/' + cpf + '/', {
      headers: this.httpHeaders,
    });
  }

  getPacienteByCelular(celular: string): Observable<any> {
    return this.http.get(baseUrl + 'paciente/celular/' + celular + '/', {
      headers: this.httpHeaders,
    });
  }

  getPacienteByTelefone(telefone: string): Observable<any> {
    return this.http.get(baseUrl + 'paciente/telefone/' + telefone + '/', {
      headers: this.httpHeaders,
    });
  }

  getPaciente(prontuario: string): Observable<Paciente> {

    return this.http
      .get<Paciente>(baseUrl + 'paciente/' + prontuario + '/', {
        headers: this.httpHeaders,
      })
      .pipe(map((data) => new Paciente().deserializable(data)));
  }

  getPacienteDetails(prontuario: string): Observable<Paciente> {
    return this.http.get<Paciente>(
      baseUrl + 'paciente/details/' + prontuario + '/',
      { headers: this.httpHeaders }
    );
  }

  savePaciente(paciente: PacientePost) {
    return this.http.post(baseUrl + 'paciente/', paciente, {
      headers: this.httpHeaders,
    });
  }

  upadatePaciente(paciente: PacientePost): Observable<any> {
    return this.http.put(baseUrl + 'paciente/', paciente, {
      headers: this.httpHeaders,
    });
  }

  deletePaciente(prontuario: Number) {
    return this.http.delete(baseUrl + 'paciente/' + prontuario + '/', {
      headers: this.httpHeaders,
    });
  }

  lastId() {
    return this.http.get(baseUrl + 'ultimoid/', { headers: this.httpHeaders });
  }

  preCadastro(paciente: PacientePost): Observable<any> {
    return this.http.post(baseUrl + 'precadastro/', paciente, {
      headers: this.httpHeaders,
    });
  }
}
