import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Novedad } from '../models/novedad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NovedadService {
  
  url :string = '/api/novedad';

  constructor(private _http: HttpClient) { }

  /**Agrega una nueva novedad*/
  public add(novedad: Novedad): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    let body: any = JSON.stringify(novedad);
    return this._http.post(this.url, body, httpOptions);
  }

  /**Obtiene todas las novedades*/
  public getAll():Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url, httpOptions);
  }

  /**Obtiene las una novedad por id*/
  public getById(id: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/'+id, httpOptions);
  }

  /**Obtiene las novedades segun una busqueda ingresada*/
  public getBusqueda():Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/busqueda', httpOptions);
  }

  /**Obtiene las novedades por id del alquiler*/
  public getByAlquiler(id: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/alquiler/'+id, httpOptions);
  }
  
  /**Obtiene las novedades por id del usuario*/
  public getByUsuario(id: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.get(this.url+'/usuario/'+id, httpOptions);
  }
  /**Elimina una novedad por id*/
  public remove(id: string):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }
    return this._http.delete(this.url+'/'+id, httpOptions);
  }

  /**Actualiza una novedad por id*/
  public update(novedad: Novedad):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders ({
        'Content-Type': 'application/json'
      })
    }
    let body:any = JSON.stringify(novedad);
    return this._http.put(this.url+'/'+novedad._id, body, httpOptions)
  }
}
