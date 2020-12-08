import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  token = this.userService.token;

  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) {}

  generateBackup(table: string): Observable<any> {
    return this.http.get(baseUrl + 'backup/' + table + '/', {
      headers: this.httpHeaders,
    });
  }
}
