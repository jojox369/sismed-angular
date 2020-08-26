import { Laboratorio } from './../models/laboratorio';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Convenio } from '../models/convenio';
import { map } from 'rxjs/operators';
import { TipoConvenioPaciente } from '../models/tipo-convenio';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioTipoConvenioService {

  token = this.userService.token;
  baseUrl = 'http://localhost:8000/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);
  constructor(private http: HttpClient, private userService: UserService) { }

  // lista os convenios aceitos pelo laboratorio
  getAcceptedConvenios(laboratorioId: string): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(this.baseUrl + 'conveniosAccepted/laboratorio/' + laboratorioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Convenio().deserializable(data)))
    );
  }

  // lista os convenios aceitos pelo laboratorio
  getAcceptedConveniosTipos(laboratorioId: string): Observable<TipoConvenioPaciente[]> {
    return this.http.get<TipoConvenioPaciente[]>(this.baseUrl + 'conveniosTiposAccepted/laboratorio/' + laboratorioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new TipoConvenioPaciente().deserializable(data)))
    );
  }

  // lista os convenios aceitos pelo laboratorio
  getUnAcceptedConvenios(laboratorioId: string): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(this.baseUrl + 'conveniosUnaccepted/laboratorio/' + laboratorioId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Convenio().deserializable(data)))
    );
  }


  // lista de tipos convenios aceitos pelo laboratorio
  getTiposAccepted(laboratorioId, convenioId): Observable<any> {
    return this.http.get(this.baseUrl + 'tipos/laboratorio/' + laboratorioId + '/' + convenioId + '/', { headers: this.httpHeaders });
  }

  // lista de tipos não aceitos pelo laboratorio
  getTiposUnAccepted(laboratorioId, convenioId): Observable<any> {
    return this.http.get(this.baseUrl + 'tiposUnAccepted/' + convenioId + '/laboratorio/' + laboratorioId + '/',
      { headers: this.httpHeaders });
  }

  // salva os tipos de convenios
  save(laboratorioTipo): Observable<any> {
    return this.http.post(this.baseUrl + 'laboratorioTipos/', laboratorioTipo, { headers: this.httpHeaders });
  }

  // pega as informações da relação entre laboratorio e o tipo de convenio
  getLabTaconvenioDetails(laboratorioId, tipoId): Observable<any> {
    return this.http.get(this.baseUrl + 'laboratorioTipo/' + laboratorioId + '/' + tipoId + '/', { headers: this.httpHeaders });
  }

  // exclui a relação do laboratorio com o tipo selecionado
  delete(labTaconvenioId): Observable<any> {
    return this.http.delete(this.baseUrl + 'laboratorioTipos/' + labTaconvenioId + '/', { headers: this.httpHeaders });
  }
}
