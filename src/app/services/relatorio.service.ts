import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Relatorio, RelatorioList } from '../models/relatorio';
import { Observable } from 'rxjs';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  token = this.userService.token;
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  /*Metodo que salva relatorio de acordo com as informações do agendamento */
  saveReport(relatorio: Relatorio): Observable<any> {

    return this.http.post(baseUrl + 'relatorio/', relatorio, {
      headers: this.httpHeaders,
    });
  }

  generate(relatorio): Observable<RelatorioList> {

    return this.http.post<RelatorioList>(`${baseUrl}relatorio/`, relatorio, {
      headers: this.httpHeaders,
    });
  }
}
