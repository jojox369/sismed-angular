import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  token = this.userService.token;
  baseUrl = 'https://sismed-api.herokuapp.com/';
  message = '';
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  generateBackup(table: string): Observable<any> {
    return this.http.get(this.baseUrl + 'backup/' + table + '/', { headers: this.httpHeaders });
  }
}
