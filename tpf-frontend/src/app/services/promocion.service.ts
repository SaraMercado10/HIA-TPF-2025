import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Promocion } from '../models/promocion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocionService {

  constructor(private _http: HttpClient) { }

  url :string = 'http://localhost:3000/api/promocion';

  public save(promocion: Promocion): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    let body: any = JSON.stringify(promocion);
    return this._http.post(this.url, body, httpOptions);
  }

  public getAll(): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url, httpOptions);
  }

  public getById(id: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/' + id, httpOptions);
  }

  public getByAlquiler(id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url + '/alquiler/' + id, httpOptions);
  }

  public update(promocion: Promocion): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body: any = JSON.stringify(promocion);
    return this._http.put(this.url+'/' + promocion.id, body, httpOptions);
  }

  public delete(id: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.delete(this.url+'/' + id, httpOptions);
  }

}

