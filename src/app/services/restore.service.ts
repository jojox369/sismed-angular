import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage-service.service';
import { Observable } from 'rxjs';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class RestoreService {
  token = this.tokenStorage.getToken();
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  restoreTables(restoreConfig): Observable<any> {
    return this.http.post(`${baseUrl}restore/`, restoreConfig, {
      headers: this.httpHeaders,
    });
  }
}
