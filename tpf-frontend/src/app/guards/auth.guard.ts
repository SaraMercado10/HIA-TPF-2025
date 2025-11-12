import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Verificar si el usuario está autenticado utilizando tu servicio UsuarioService
    if (this.usuarioService.userLoggedIn()) {
      return true; // Permitir la activación de la ruta si el usuario está autenticado
    } else {
      // Si el usuario no está autenticado, redirigir al componente de login y retornar false o UrlTree
      
      this.router.navigateByUrl('');
      return false;
    }
  }
}