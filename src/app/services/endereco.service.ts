import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {



  constructor(private http: HttpClient) { }

  getEndereco(cep: string): Observable<any> {
    return this.http.get('https://viacep.com.br/ws/' + cep + '/json/unicode/')
  }
}
