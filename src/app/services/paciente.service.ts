import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente, PacientePost } from '../models/paciente';
import baseUrl from '../url';
import { TokenStorageService } from './token-storage-service.service';

interface ProximoProntuario {
  proximoProntuario: string;
}

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  token = this.tokenStorage.getToken();
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  getAllPacientes(): Observable<Paciente[]> {
    return this.http
      .get<Paciente[]>(`${baseUrl}paciente/`, { headers: this.httpHeaders })

      .pipe(
        map((data) => data.map((data) => new Paciente().deserializable(data)))
      );
  }

  getPacienteByName(name: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${baseUrl}paciente/nome/${name}/`, {

      headers: this.httpHeaders,
    });
  }

  getPacienteByProntuario(prontuario: Number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${baseUrl}paciente/prontuario/${prontuario}/`, {
      headers: this.httpHeaders,
    });
  }

  getPacienteByCpf(cpf: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${baseUrl}paciente/cpf/${cpf}/`, {
      headers: this.httpHeaders,
    });
  }

  getPacienteByCelular(celular: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${baseUrl}paciente/celular/${celular}/`, {
      headers: this.httpHeaders,
    });
  }

  getPacienteByTelefone(telefone: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(baseUrl + 'paciente/telefone/' + telefone + '/', {
      headers: this.httpHeaders,
    });
  }

  getPaciente(prontuario: string): Observable<Paciente> {

    return this.http
      .get<Paciente>(`${baseUrl}paciente/${prontuario}/`, {

        headers: this.httpHeaders,
      })
      .pipe(map((data) => new Paciente().deserializable(data)));
  }



  savePaciente(paciente: PacientePost) {
    return this.http.post(`${baseUrl}paciente/`, paciente, {
      headers: this.httpHeaders,
    });
  }

  updatePaciente(paciente: PacientePost): Observable<any> {
    return this.http.put(`${baseUrl}paciente/`, paciente, {
      headers: this.httpHeaders,
    });
  }

  deletePaciente(prontuario: Number) {
    return this.http.delete(`${baseUrl}paciente/${prontuario}/`, {
      headers: this.httpHeaders,
    });
  }

  nextProntuario(): Observable<ProximoProntuario> {
    return this.http.get<ProximoProntuario>(
      `${baseUrl}paciente/proximo/prontuario`, { headers: this.httpHeaders }
    );
  }

  preCadastro(paciente: PacientePost): Observable<any> {
    return this.http.post(`${baseUrl}paciente/preCadastro/`, paciente, {

      headers: this.httpHeaders,
    });
  }
}
