import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { Registroclinico } from '../models/registroclinico';

@Injectable({
  providedIn: 'root'
})
export class RegistroclinicoService {
  baseUrl = 'https://sismed-api.herokuapp.com/';
  token = this.userService.token;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.token);

  constructor(private http: HttpClient, private userService: UserService) { }

  getRegistros(): Observable<Registroclinico[]> {
    return this.http.get<Registroclinico[]>(this.baseUrl + "registrosclinicos/", { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Registroclinico().deserializable(data)))
    );
  }

  getRegistrosAnteriores(pacienteId: number): Observable<Registroclinico[]> {
    return this.http.get<Registroclinico[]>(this.baseUrl + "registrosanteriores/" + pacienteId + '/', { headers: this.httpHeaders }).pipe(
      map(data => data.map(data => new Registroclinico().deserializable(data)))
    );
  }

  saveRegistroClinico(registroClinico: Registroclinico) {
    return this.http.post(this.baseUrl + "registroclinico/", registroClinico, { headers: this.httpHeaders });
  }
}
