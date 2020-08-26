import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente, PacientePost } from '../models/paciente';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  baseUrl: String = 'http://localhost:8000/';
  token = this.userService.token;
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  getAllPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.baseUrl + "pacientes/", { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Paciente().deserializable(data)))
    );
  }

  getPacienteByName(name: string): Observable<any> {
    return this.http.get(this.baseUrl + "pacientes/nome/" + name + "/", { headers: this.httpHeaders });
  }

  getPacienteByProntuario(prontuario: Number): Observable<any> {
    return this.http.get(this.baseUrl + "pacientes/prontuario/" + prontuario + "/", { headers: this.httpHeaders });
  }

  getPacienteByCpf(cpf: string): Observable<any> {
    return this.http.get(this.baseUrl + "pacientes/cpf/" + cpf + "/", { headers: this.httpHeaders });
  }

  getPacienteByCelular(celular: string): Observable<any> {
    return this.http.get(this.baseUrl + "pacientes/celular/" + celular + "/", { headers: this.httpHeaders });
  }

  getPacienteByTelefone(telefone: string): Observable<any> {
    return this.http.get(this.baseUrl + "pacientes/telefone/" + telefone + "/", { headers: this.httpHeaders });
  }

  getPaciente(id: string): Observable<PacientePost> {
    return this.http.get<PacientePost>(this.baseUrl + "pacientes/" + id + "/", { headers: this.httpHeaders }).pipe(
      map(data => new PacientePost().deserializable(data))
    );
  }

  getPacienteDetails(prontuario: string): Observable<Paciente> {
    return this.http.get<Paciente>(this.baseUrl + "paciente/details/" + prontuario + "/", { headers: this.httpHeaders });
  }


  savePaciente(paciente: PacientePost) {
    return this.http.post(this.baseUrl + "pacientes/", paciente, { headers: this.httpHeaders });
  }

  upadatePaciente(paciente: PacientePost): Observable<any> {
    return this.http.put(this.baseUrl + "pacientes/" + paciente.id + "/", paciente, { headers: this.httpHeaders });
  }

  deletePaciente(id: Number) {
    return this.http.delete(this.baseUrl + "pacientes/" + id + "/", { headers: this.httpHeaders });
  }

  lastId() {
    return this.http.get(this.baseUrl + "ultimoid/", { headers: this.httpHeaders });
  }

  preCadastro(paciente: PacientePost): Observable<any> {
    return this.http.post(this.baseUrl + "precadastro/", paciente, { headers: this.httpHeaders });
  }
}
