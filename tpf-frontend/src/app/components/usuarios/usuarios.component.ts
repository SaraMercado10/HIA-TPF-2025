import { Component } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  usuarios!: Array<Usuario>;
  iUsuario: string = "";
  perfil: string = "";
  activo: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.iniciarVariables();
    this.cargarUsuarios();
  }

  iniciarVariables(): void {
    this.usuarios = new Array<Usuario>();
  }
  cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe(
      (data) => {
        this.usuarios = data;
        console.log(this.usuarios);
      },
      (error) => {
        console.log(error)
      }
    )
  }
  agregar(): void {
    this.router.navigate(['usuario-form', 0]);
  }
  modificar(id: string) {
    this.router.navigate(['usuario-form', id]);
  }
  eliminar(id: string) {
    this.usuarioService.delete(id).subscribe(
      result => {
        if (result.status == 1) {

          this.toastr.warning("Usuario eliminado");
          this.router.navigate(['usuarios'])
          this.cargarUsuarios();
        }

      },
      error => {
        console.log(error);
        this.toastr.error(error.error.msg);
      })

  }
  filtrarUsuarios(){
    this.usuarioService.getByFiltros({
      usuario : this.iUsuario,
      perfil : this.perfil,
      soloActivos : this.activo
    }).subscribe(
      result => {
        this.usuarios = new Array<Usuario>;
       Object.assign(this.usuarios, result);
      }
    )
  }
}
