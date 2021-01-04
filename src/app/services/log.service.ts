import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Log, LogSave } from '../models/log';
import { map } from 'rxjs/operators';
import baseUrl from '../url';
import { TokenStorageService } from './token-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class LogService {

  token = this.tokenStorage.getToken();
  httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }



  getLogs(): Observable<Log[]> {
    return this.http
      .get<Log[]>(baseUrl + 'log/', { headers: this.httpHeaders })
      .pipe(map((data) => data.map((data) => new Log().deserializable(data))));
  }

  save(log: LogSave): Observable<any> {
    return this.http.post(baseUrl + 'log/', log, { headers: this.httpHeaders });
  }
}
