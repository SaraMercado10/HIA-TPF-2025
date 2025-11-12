import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Link } from '../../models/link';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  rutasAdministrativo: Link[];
  rutasPropietario: Link[];
  rutasDuenio: Link[];
  
  home: { ruta: string, titulo: string };
  inicioSesion: Link;
  returnUrl!: string;

  constructor(
    public loginService: UsuarioService,  
    private route: ActivatedRoute,
    private router: Router,) {
    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.home = { ruta: "", titulo: "Amazone" };
    this.inicioSesion = { ruta: "login", titulo: "iniciar sesión", icono: "box-arrow-in-right" };
    
    this.rutasDuenio = [
      { ruta: "usuarios", titulo: "usuarios", icono: "person-fill-gear" },
      { ruta: "local-tabla", titulo: "locales", icono: "person-fill-gear" },
      { ruta: "alquiler-tabla", titulo: "alquileres", icono: "person-fill-gear" },
      { ruta: "novedades", titulo: "novedades", icono: "person-fill-gear" },
      /*{ ruta: "promocion", titulo: "promocion", icono: "emoji-sunglasses"},*/
      { ruta : "estadisticas", titulo : "estadisticas", icono : "person-fill-gear"},
      { ruta: "promocion-tabla", titulo: "promocion", icono: "emoji-sunglasses"}
    ];
    this.rutasAdministrativo = [      
      { ruta: "local-tabla", titulo: "locales", icono: "person-fill-gear" },
      { ruta: "alquiler-tabla", titulo: "alquileres", icono: "person-fill-gear" },
      { ruta: "novedades", titulo: "novedades", icono: "person-fill-gear" },
      
    ];
    this.rutasPropietario = [       
      { ruta: "alquiler-tabla", titulo: "alquileres", icono: "person-fill-gear" },
      { ruta: "novedades", titulo: "novedades", icono: "person-fill-gear" },
      { ruta: "promocion", titulo: "promocion", icono: "emoji-sunglasses"}
    ];
  }
  public logout() {
    this.loginService.logout();
    this.router.navigateByUrl(this.returnUrl);
  }
  public showLogin(): boolean {
    return !this.loginService.userLoggedIn();
  }
}