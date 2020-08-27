import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestoreService {

  token = 'Token ' + this.userService.token;
  baseUrl = 'https://sismed-api.herokuapp.com/';
  message: string;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  restoreTables(table, date): Observable<any> {
    return this.http.get(this.baseUrl + 'restore/' + table + '/' + 'date/' + date, { headers: this.httpHeaders });
  }
}
