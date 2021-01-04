import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import baseUrl from '../url';
import { TokenStorageService } from './token-storage-service.service';



@Injectable({
  providedIn: 'root',
})
export class BackupService {
  token = this.tokenStorage.getToken();


  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  generateBackup(tabelas: string[]): Observable<any> {
    return this.http.post(`${baseUrl}backup/`, tabelas, {
      headers: this.httpHeaders,
    });
  }
}
