import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Log, LogSave } from '../models/log';
import { map } from 'rxjs/operators';
import baseUrl from '../url';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: HttpClient, private userService: UserService) {}

  token = this.userService.token;
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  getLogs(): Observable<Log[]> {
    return this.http
      .get<Log[]>(baseUrl + 'log/', { headers: this.httpHeaders })
      .pipe(map((data) => data.map((data) => new Log().deserializable(data))));
  }

  save(log: LogSave): Observable<any> {
    return this.http.post(baseUrl + 'log/', log, { headers: this.httpHeaders });
  }
}
