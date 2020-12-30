import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class RestoreService {
  token = this.userService.token;
  message: string;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  restoreTables(restoreConfig): Observable<any> {
    return this.http.post(`${baseUrl}restore/`, restoreConfig, {
      headers: this.httpHeaders,
    });
  }
}
