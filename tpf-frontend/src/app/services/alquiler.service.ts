import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alquiler } from '../models/alquiler';
import { Cuota } from '../models/cuota';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  constructor(private _http: HttpClient) { }

  url :string = 'http://localhost:3000/api/alquiler';

  public generarNumeroAlquiler(): Observable<any> {
    return this._http.get(this.url + '/generarNumeroAlquiler', { responseType: 'text' });
  }


  public crearAlquiler(alquiler: Alquiler): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    let body: any = JSON.stringify(alquiler);
    return this._http.post(this.url, body, httpOptions);
  }

  public obtenerAlquileres(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url, httpOptions);
  }

  public eliminarAlquiler(id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.delete(this.url+'/' + id, httpOptions);
  }

  public obtenerAlquilerById(id: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/' + id, httpOptions);
  }

  public modificarAlquiler(alquiler: Alquiler): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body: any = JSON.stringify(alquiler);
    return this._http.put(this.url+'/' + alquiler.id, body, httpOptions)
  }

  public obtenerAlquileresByFecha(desde: Date, hasta: Date): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url + "/fecha?startDate=" + desde + "&endDate=" + hasta, httpOptions);
  }

  public obtenerAlquilerByUsuario(usuarioId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url + '/propietario?usuarioId=' + usuarioId, httpOptions); 
  }

  public obtenerAlquilerByNumero(numeroId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url + '/numero/' + numeroId, httpOptions);
  }

  public agregarCuota(alquilerId: string,cuota: Cuota): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    let body: any = JSON.stringify(cuota);
    return this._http.post(this.url+"/"+alquilerId+"/cuota", body, httpOptions);
  }

  public actualizarCuota(idAlquiler:string,idCuota:string, cuota:Cuota):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    let body: any = JSON.stringify(cuota);
    return this._http.put(this.url+'/' + idAlquiler+'/cuota/'+idCuota, body, httpOptions)
  }
  
}
