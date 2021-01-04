import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procedimento } from 'src/app/models/procedimento';
import { map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage-service.service';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class ProcedimentoService {
  token = this.tokenStorage.getToken();
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);


  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }



  getAll(convenioId): Observable<Procedimento[]> {
    return this.http
      .get<Procedimento[]>(baseUrl + 'procedimento/' + convenioId + '/', {
        headers: this.httpHeaders,
      })
      .pipe(
        map((data) =>
          data.map((data) => new Procedimento().deserializable(data))
        )
      );
  }


  getById(procedimentoId): Observable<Procedimento> {
    return this.http
      .get<Procedimento>(baseUrl + 'procedimento/detalhes/' + procedimentoId + '/', {
        headers: this.httpHeaders,
      })
      .pipe(map((data) => new Procedimento().deserializable(data)));
  }


  update(procedimento): Observable<any> {
    return this.http.put(`${baseUrl}procedimento/`, procedimento,
      { headers: this.httpHeaders }
    );
  }


  delete(procedimento) {
    return this.http.delete(`${baseUrl}procedimento/${procedimento.id}`,
      { headers: this.httpHeaders }
    );
  }


  save(procedimento) {
    return this.http.post(`${baseUrl}procedimento/`, procedimento,
      { headers: this.httpHeaders }
    );
  }

  getByDescription(convenioId, description): Observable<any> {
    return this.http.get(
      `${baseUrl}procedimento/desc/${description}/convenio/${convenioId}`,
      { headers: this.httpHeaders }
    );
  }
}
