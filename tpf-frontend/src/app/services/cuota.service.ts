import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuota } from '../models/cuota';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuotaService {

  constructor(private _http: HttpClient) { }

  url :string = 'http://localhost:3000/api/cuota';

  public crearCutoa(cuota: Cuota): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    let body: any = JSON.stringify(cuota);
    return this._http.post(this.url, body, httpOptions);
  }

  public eliminarCuota(id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.delete(this.url+'/' + id, httpOptions);
  }

  public modificarCuota(cuota: Cuota): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body: any = JSON.stringify(cuota);
    return this._http.put(this.url+'/:' + cuota.id, body, httpOptions)
  }

  public obtenerCuotaById(id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/' + id, httpOptions);
  }
  public getCuotasByDateRange(startDate: string, endDate: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = { startDate, endDate };
    return this._http.post(`${this.url}/cuotasByDateRange`, body, httpOptions);
  }
  public obtenerCuotas(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url, httpOptions);
  }
}
