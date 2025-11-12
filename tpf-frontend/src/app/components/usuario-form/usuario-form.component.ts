import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent {
  accion: string = "new";  
  propietario: Usuario;
  modalVisible: boolean = false;
  mostrarForm: boolean;

  @ViewChild('formPropietario') formPropietario!: NgForm;
  Propietario:  Usuario;
  
  
  constructor(
    private usuarioService:UsuarioService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private toastr: ToastrService
    
  ) { 
    this.Propietario= new Usuario(),
    this.propietario = new Usuario(),
    this.mostrarForm = true;
  }
  iniciarVariable():void{
    this.propietario = new Usuario();
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] == "0") {
        this.accion = "new";   
        if (localStorage.getItem('localCreated') === 'true') {
          this.toastr.success('Usuario creado');
          localStorage.removeItem('localCreated');
        }     
      } else {
        this.accion = "update";
        this.cargarPropietario(params['id']);
      }
    });
  }

  limpiarFormulario() {
    this.formPropietario.reset();
  }

  public verPropietarios() {
    this.router.navigate(['/usuarios']);
  }

  cargarPropietario(id: string): void {
    this.usuarioService.getById(id).subscribe(
      (result) => {
        console.log(result); // Verifica que aquí ves el objeto esperado
        this.propietario = result; // Asigna directamente el objeto recibido
      },
      (error) => {
        console.error('Error al cargar el propietario:', error);
      }
    );
  }

  registrarPropietario(): void {
    console.log(this.propietario);
    this.usuarioService.add(this.propietario).subscribe(
      (result) => {
        if (result.status == 1) {
          localStorage.setItem('localCreated', 'true');
          window.location.reload();
        }
      },
      (error) => {
        console.log(error);
      })
  }

  actualizarPropietario(propietario:Usuario):void{
    this.usuarioService.update(propietario).subscribe(
      (result) => {
        if (result.status == 1) {
          this.toastr.info('Usuario Modificado');
          this.router.navigate(['/usuarios']);
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }
  private showModal() {
    this.modalVisible = true;
    this.mostrarForm = false;
  }


  aceptarModal() {
    window.location.reload();
    this.limpiarFormulario();
    this.mostrarForm = true;
  }

}