import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  hostBase: string

  constructor(private _http: HttpClient) {
    this.hostBase = "http://localhost:3000/api/usuario/";
  }

  //CRUD
  add(propietario: Usuario): Observable<any> {
    let http = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body: any = JSON.stringify(propietario);
    return this._http.post(this.hostBase, body, http);

  }
  getAll(): Observable<any> {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get(this.hostBase, httpOption);
  }
  getById(id: string): Observable<any> {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get(this.hostBase + id, httpOption);
  }
  getByDni(dni: string): Observable<any> {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get(this.hostBase + 'dni/' + dni, httpOption);
  }

  getByFiltros(filtros: {usuario: string, perfil: string, soloActivos : boolean}): Observable<any> {
    let http = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body: any = JSON.stringify(filtros);
    return this._http.post(this.hostBase + 'filtro/', body, http);
  }

  delete(id: string): Observable<any> {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.delete(this.hostBase + id, httpOption);
  }
  update(propietario: Usuario): Observable<any> {
    let http = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body: any = JSON.stringify(propietario);
    return this._http.put(this.hostBase + propietario._id, body, http)
  }

  public login(usuario: String, password: String): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body = JSON.stringify({ usuario: usuario, password: password });
    console.log(body);
    return this._http.post(this.hostBase + 'login', body, httpOption);
  }
  public logout() {
    //borro el vble almacenado mediante el storage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("perfil");
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("token");
    
  }
  public userLoggedIn() {
    var resultado = false;
    var usuario = sessionStorage.getItem("user");
    if (usuario != null) {
      resultado = true;
    }
    return resultado;
  }
  public userLogged() {
    var usuario = sessionStorage.getItem("user");
    return usuario;
  }
  public idLogged() {
    var id = sessionStorage.getItem("userid");
    return id;

  }

  public perfilLogged() {
    var perfil = sessionStorage.getItem("perfil");
    return perfil;

  }
  public getToken(): string {
    if (sessionStorage.getItem("token") != null) {
      return sessionStorage.getItem("token")!;
    } else {
      return "";
    }
  }

}