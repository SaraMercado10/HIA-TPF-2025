import { Component } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userform: Usuario = new Usuario(); //usuario mapeado al formulario
  returnUrl!: string;
  msglogin!: string; // mensaje que indica si no paso el loguin
  mostrarAlerta: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: UsuarioService
  ) {}
  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '';
  }
  login() {
    this.loginService
      .login(this.userform.usuario, this.userform.password)
      .subscribe(
        (result) => {
          var user = result;

          if (user.status == 1) {
            sessionStorage.setItem('user', user.usuario);
            sessionStorage.setItem('userid', user.userid);
            sessionStorage.setItem('perfil', user.perfil);
            //guardamos el tokek localmente
            sessionStorage.setItem("token", user.token);
            //redirigimos a home o a pagina que llamo
            this.router.navigateByUrl(this.returnUrl);
          } else {
            //usuario no encontrado muestro mensaje en la vista
            this.mostrarAlerta=true;
            this.msglogin = 'Credenciales incorrectas..';
          }
        },
        (error) => {
          alert('Error de conexion');
          console.log('error en conexion');
          console.log(error);
        }
      );
  }
}
