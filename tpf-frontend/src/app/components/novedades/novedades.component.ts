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
  alquilerId: string = '';  // Variable auxiliar para el alquilerId
  descripcion = new FormControl('',Validators.required);

  constructor(
    private novedadService: NovedadService,
    private alquilerService: AlquilerService,
    private loginService: UsuarioService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.cargarNovedades();
    //this.novedad = new Novedad();
  }
//TABLA ALQUILERES
cargarNovedades(): void {
  this.novedades = []; // Limpiar la lista antes de cargar
  console.log("id loggeg");
  console.log(this.loginService.idLogged()!);
  this.novedadService.getAll().subscribe(
    (result: any) => {
      console.log(this.userPerfil());
      console.log(result);

      if (this.userPerfil() === 'propietario') {
        // Filtrar novedades solo del propietario
        this.cargarNovedadesByUsuario(result);
      } else {
        // Mostrar todas las novedades
        this.novedades = result.map((element: any) => {
          let novedad = new Novedad();  // Crear una nueva instancia de Novedad
          Object.assign(novedad, element); // Asignar los valores del elemento a la instancia
          return novedad;
        });
      }
    },
    (error: any) => {
      console.log(error);
    }
  );
}

cargarNovedadesByUsuario(result: any): void {
  console.log(typeof this.loginService.idLogged()!);
  console.log("ID logueado:", this.loginService.idLogged());
  console.log(typeof this.loginService.idLogged());
  this.novedades = result.filter((novedad: any) => {
    console.log("Novedad usuario ID:", novedad.alquiler?.usuario?.id);console.log(typeof novedad.alquiler?.usuario?.id);
    return String(novedad.alquiler?.usuario?.id) === this.loginService.idLogged();
  }).map((element: any) => {
    let novedad = new Novedad(); 
    Object.assign(novedad, element); 
    return novedad;
  });
  console.log("Novedades filtradas:", this.novedades);
}  


/**Carga la lista de alquileres */
  cargarAlquileres(): void{
    this.alquileres = new Array();
    console.log(this.loginService.idLogged()!);
    if(this.userPerfil() == 'propietario'){
      this.alquilerService.obtenerAlquilerByUsuario(this.loginService.idLogged()!).subscribe(
        (result: any) => {
          let vAlquiler: Alquiler = new Alquiler();
          result.forEach((element: any) => {
            Object.assign(vAlquiler, element);
            this.alquileres.push(vAlquiler);
            vAlquiler = new Alquiler();
          });
        },
        (error: any) => {
          console.log(error);
        }
      )
    }else{
      this.alquilerService.obtenerAlquileres().subscribe(
        (result: any) => {
          let vAlquiler: Alquiler = new Alquiler();
          result.forEach((element: any) => {
            Object.assign(vAlquiler, element);
            this.alquileres.push(vAlquiler);
            vAlquiler = new Alquiler();
          });
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
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
    console.log("this.novedad.descripcion");
    console.log(this.novedad.descripcion)
    console.log("this.novedad");
    console.log(this.novedad)
    this.novedad.alquilerId = this.alquilerId; // Asignamos el alquilerId a la novedad
    console.log("this.novedad.alquilerId")
    console.log(this.novedad.alquilerId);
    console.log("this.alquilerId")
    console.log(this.alquilerId);
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
    this.alquilerId = ''; // Limpiar alquilerId
  }

  /**Modifica una novedad */
  modificar(novedad: Novedad): void {
    this.isModificar = true;
    this.formHabilitado = true;
    this.novedad = novedad;
    this.alquilerId = novedad.alquilerId; // Asignar alquilerId
  }

  /**Actualiza una novedad */
  actualizar(): void {
    this.alquileres=[];
    this.novedadService.update(this.novedad).subscribe(
      result => {
        if(result.status==1){
          this.toastr.success("Novedad actualizada");        
          this.novedades = [];        
          //this.cargarNovedades();
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