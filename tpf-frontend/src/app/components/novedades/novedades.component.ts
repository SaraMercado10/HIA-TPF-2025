import { Component, OnInit } from '@angular/core';
import { Novedad } from '../../models/novedad';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators} from '@angular/forms';
import { Alquiler } from '../../models/alquiler';
import { NovedadService } from '../../services/novedad.service';
import { AlquilerService } from '../../services/alquiler.service';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.css'
})
export class NovedadesComponent implements OnInit{
  alquileres: Alquiler[] = [];
  novedades: Novedad[] = [];
  
  isModificar: boolean = false;
  formHabilitado: boolean = false;
  
  novedad: Novedad = new Novedad();

  descripcion = new FormControl('',Validators.required);

  constructor(
    private novedadService: NovedadService,
    private alquilerService: AlquilerService,
    private loginService: UsuarioService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.cargarNovedades();
  }
//TABLA ALQUILERES
  /**Carga la lista de novedades, sin las novedades archivadas*/
  cargarNovedades():void{
      this.novedadService.getAll().subscribe(
        (result) => {
          if(this.userPerfil()==='propietario')
            this.cargarNovedadesByUsuario(result);
          else
            this.novedades=result;
        },
        (error) => {
          console.log(error)
        }
      )
  }

  cargarNovedadesByUsuario(result: any):void{
    this.novedades=[];
    for(let i=0;i< result.length;i++){
      if(result[i].alquiler.usuario?._id===this.userId()!){
        this.novedades.push(result[i]);
      }
    }
    console.log(this.novedades);
  }

/**Carga la lista de alquileres */
  cargarAlquileres(): void{
    this.alquilerService.obtenerAlquileres().subscribe(
      (result)=>{
        if(this.userPerfil()==='propietario')
          this.cargarAlquileresByUsuario(result);
          else
          this.alquileres=result; 

      },
      (error)=>{
        console.log(error)
      }
    )
  }

  cargarAlquileresByUsuario(result: any):void{
    this.alquileres=[];
    for(let i=0;i< result.length;i++){
      if(result[i].usuario._id===this.userId()!){
        this.alquileres.push(result[i]);
      }
    }
  }

  /**Carga variables para una nueva novedad */
  nuevo(): void {
    this.formHabilitado = true;
    this.cargarAlquileres();
  }

  /**Registra una nueva novedad */
  guardar(): void {
    if(this.userPerfil()==='propietario')
      this.novedad.setEstado('Pendiente');
    this.novedadService.add(this.novedad).subscribe(
      (result: any) => {
        if (result.status == 1) {
          this.toastr.success("Novedad registrada")
        }
        this.reset();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  /**Cancela el registro o modificacion de una novedad */
  cancelar(){
    this.toastr.warning("No se guardaron los cambios");
    this.reset();
  }
  /**Limpia variables */
  reset(){
    this.formHabilitado=false;
    this.cargarNovedades();
    this.novedad=new Novedad();
  }

  /**Modifica una novedad */
  modificar(novedad: Novedad): void {
    this.isModificar = true;
    this.formHabilitado = true;
    this.novedad = novedad;
  }

  /**Actualiza una novedad */
  actualizar(): void {
    this.novedadService.update(this.novedad).subscribe(
      result => {
        if(result.status==1){
          this.toastr.success("Novedad actualizada");
          this.cargarNovedades();
          this.reset();
        }
      },
        error=>{
        console.log(error);
      }
    )    
  }

  /**Elimina una novedad */
  eliminar(id: string): void {
    this.novedadService.remove(id).subscribe(
      result=>{
        if(result.status==1){
          this.toastr.warning("Novedad eliminada");
          console.log(result);
          this.cargarNovedades();
        }
    },
    error=>{
      console.log(error);
    })    
  }

  //USUARIO
  /**Retorna el perfil del usuario logueado*/
  userPerfil(): string|null{
    return this.loginService.perfilLogged();
  }
  /**Retorna el id del usuario logueado */
  userId(){
    return this.loginService.idLogged();
  }
}