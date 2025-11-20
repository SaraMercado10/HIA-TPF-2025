import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Local } from '../models/local';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private _http: HttpClient) { }

  url :string = 'http://localhost:3000/api/local';

  public crearLocal(local: Local): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    let body: any = JSON.stringify(local);
    return this._http.post(this.url, body, httpOptions);
  }

  public generarNumeroLocal(): Observable<any> {
    return this._http.get(this.url + '/generarNumeroLocal', { responseType: 'text' });
  }

  public obtenerLocales():Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url, httpOptions);
  }

  public eliminarLocal(id: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.delete(this.url+'/'+id, httpOptions);
  }

  public obtenerLocalPorId(id: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/'+id, httpOptions);
  }

  public modificarLocal(local: Local):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders ({
        'Content-Type': 'application/json'
      })
    }
    let body:any = JSON.stringify(local);
    return this._http.put(this.url+'/' +local._id, body, httpOptions)
  }

  public obtenerLocalPorNombre(nombreLocal: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/nombrelocal/'+nombreLocal, httpOptions);
  }

  public obtenerLocalesPorRubro(rubro: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/rubro'+rubro, httpOptions);
  }
  getByFiltros(filtros: {nombre: string}): Observable<any> {
    let http = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body: any = JSON.stringify(filtros);
    return this._http.post(this.url+ '/buscar/', body, http);
  }
}