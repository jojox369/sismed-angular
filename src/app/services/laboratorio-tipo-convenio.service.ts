import { Laboratorio } from './../models/laboratorio';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Convenio } from '../models/convenio';
import { map } from 'rxjs/operators';
import { TipoConvenioPaciente } from '../models/tipo-convenio';
import baseUrl from '../url';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class LaboratorioTipoConvenioService {
  token = this.tokenStorage.getToken();

  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }


  getAcceptedConvenios(laboratorioId: string): Observable<Convenio[]> {
    return this.http
      .get<Convenio[]>(
        `${baseUrl}laboratorioTconvenio/conveniosAceitos/${laboratorioId}/`,
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) => data.map((data) => new Convenio().deserializable(data)))
      );
  }


  getAcceptedConveniosTipos(
    laboratorioId: string
  ): Observable<TipoConvenioPaciente[]> {
    return this.http
      .get<TipoConvenioPaciente[]>(
        `${baseUrl}laboratorioTconvenio/tiposAceitos/todos/${laboratorioId}/`,
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) =>
          data.map((data) => new TipoConvenioPaciente().deserializable(data))
        )
      );
  }


  getUnAcceptedConvenios(laboratorioId: string): Observable<Convenio[]> {
    return this.http
      .get<Convenio[]>(
        `${baseUrl}laboratorioTconvenio/conveniosNaoAceitos/${laboratorioId}/`,
        { headers: this.httpHeaders }
      )
      .pipe(
        map((data) => data.map((data) => new Convenio().deserializable(data)))
      );
  }


  getTiposAccepted(laboratorioId, convenioId): Observable<any> {
    return this.http.get(
      `${baseUrl}laboratorioTconvenio/${laboratorioId}/${convenioId}/`,

      { headers: this.httpHeaders }
    );
  }


  getTiposUnAccepted(laboratorioId, convenioId): Observable<any> {
    return this.http.get(
      `${baseUrl}laboratorioTconvenio/${laboratorioId}/tiposNaoAceitos/${convenioId}/`,
      { headers: this.httpHeaders }
    );
  }


  save(laboratorioTipo): Observable<any> {
    return this.http.post(baseUrl + 'laboratorioTconvenio/', laboratorioTipo, {
      headers: this.httpHeaders,
    });
  }


  delete(laboratorioTipo): Observable<any> {
    const options = {
      headers: this.httpHeaders,
      body: laboratorioTipo,
    };
    return this.http.delete(
      baseUrl + 'laboratorioTconvenio/',
      options
    );
  }
}
