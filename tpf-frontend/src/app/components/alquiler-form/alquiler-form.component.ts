import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlquilerService } from '../../services/alquiler.service';
import { Alquiler } from '../../models/alquiler';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Local } from '../../models/local';
import { LocalService } from '../../services/local.service';
import { Cuota } from '../../models/cuota';
import { ToastrService } from 'ngx-toastr';
 

@Component({
  selector: 'app-alquiler-form',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './alquiler-form.component.html',
  styleUrl: './alquiler-form.component.css'
})
export class AlquilerFormComponent {

  numeroAlquiler!:string;
  accion: string = 'new';
  modalVisible: boolean = false;
  mostrarForm!: boolean;
  locales!: Array<Local>;
  alquileres!: Array<Alquiler>;
  propietarios!: Array<Usuario>;

  @ViewChild('formAlquiler') formAlquiler!: NgForm;
  local!: Local | null;
  alquiler!: Alquiler;

  constructor(private localService: LocalService,
              private alquilerService: AlquilerService,
              private usuarioService: UsuarioService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastrService) {

    this.inicializarVariables();
  }

  public inicializarVariables(){
    this.generarNumeroAlquiler();
    this.numeroAlquiler = '';
    this.locales = new Array();
    this.local = null;
    this.alquiler = new Alquiler();
    this.alquileres = new Array();
    this.propietarios = new Array();
    this.mostrarForm = true;
    this.recuperarLocales();
    this.recuperarUsuariosPropietarios();
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] == '0') {
        this.accion = 'new';
      } else {
        this.accion = 'update';
        this.cargarAlquiler(params['id']);
      }
    });
  }

  public limpiarFormulario() {
    this.formAlquiler.reset();
  }

  public verAlquileres() {
    this.router.navigate(['/alquiler-tabla']);
  }

  public registrarAlquiler() {
    if (this.local != null) {
        this.local.alquilado = true;
        this.modificarLocal(this.local); // Asegúrate de que esta función realmente actualice el local
        this.alquiler.local = this.local; // Asignar el local al alquiler
    }

    this.alquiler.numeroAlquiler = this.numeroAlquiler; // Asegúrate de que el número de alquiler esté definido

    // Obtenemos el JSON adecuado con solo los IDs de usuario y local
    const alquilerData = this.alquiler.obtenerJson();

    this.alquilerService.crearAlquiler(alquilerData).subscribe(
      (result: any) => {
        this.toastr.success('Alquiler creado');
        console.log(result);
        this.agregarCuota(this.alquiler); // Asegúrate de que esta función también reciba correctamente el alquiler
        setTimeout(() => {
          this.router.navigate(['/alquiler-tabla']);
        }, 1000);
      },
      (error: any) => {
        console.log(error);
      }
    );
}

  public modificarLocal(local: Local ){
    this.localService.modificarLocal(local).subscribe(
      (result: any) => {
        console.log(result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  public cargarAlquiler(id: string): void {
    this.alquilerService.obtenerAlquilerById(id).subscribe(
      (result: any) => {
        Object.assign(this.alquiler, result);
        this.cargarLocal(result.local.id);        
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  public cargarLocal(id:string){
    this.localService.obtenerLocalPorId(id).subscribe(
      (result: any) => {
        Object.assign(this.alquiler.local, result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  public modificarAlquiler(alquilerModificado: Alquiler) {
    console.log("alquilerModificado");
    console.log(alquilerModificado);
    if (alquilerModificado.local) {
      alquilerModificado.localId = alquilerModificado.local.id; // Establecer el localId desde el objeto Local
      console.log("asigno id alguiler");
      const localModificado = new Local(); 
      Object.assign(localModificado, alquilerModificado.local);
      this.localService.modificarLocal(localModificado).subscribe(
        (result) => {
          if (result.status == 1) {
            this.toastr.info('Alquiler Modificado');
              this.router.navigate(['/alquiler-tabla']);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }   
  
  }

  public recuperarUsuariosPropietarios(){
    this.usuarioService.getAll().subscribe(
      (result: any) => {
        let vPropietario: Usuario = new Usuario();
        result.forEach((element: any) => {
          Object.assign(vPropietario, element);
          if (vPropietario.perfil=="propietario") {
            this.propietarios.push(vPropietario);
          }
          vPropietario = new Usuario();
        })
        console.log(this.propietarios)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  public recuperarLocales(){
    this.localService.obtenerLocales().subscribe(
      (result:any) => {
        let vLocal: Local = new Local();
        result.forEach((element:any)=>{
          Object.assign(vLocal, element);
          if (vLocal.habilitado==true && vLocal.alquilado != true) {
            this.locales.push(vLocal);
          }
          vLocal = new Local();
        })
        console.log(this.locales)
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  public calcularTotal(){

    if(this.local !=null)
      this.alquiler.local = this.local;
    if (this.alquiler.cantidadMesAlquiler != null && this.local != null) {
      this.alquiler.costoAlquiler = this.alquiler.cantidadMesAlquiler * this.local.costoMes;
    }
  }


  //Agregar una cuota a un alquiler
  public agregarCuota(alquiler:Alquiler){
    let cuota: Cuota;
    cuota = new Cuota();
    console.log("NumeroID Al generar Cuota:",alquiler.numeroAlquiler)
    this.alquilerService.obtenerAlquilerByNumero(alquiler.numeroAlquiler).subscribe(
      (result: any) => {
        Object.assign(alquiler, result);
        if(alquiler.local!=null){
          cuota.monto = alquiler.local.costoMes;
        }
        cuota.fechaVencimiento.setDate( cuota.fechaVencimiento.getDate() + 10);
        console.log("ID Al generar Cuota:", alquiler.id)
        this.alquilerService.agregarCuota(alquiler.id, cuota).subscribe(
          (result) => {
            console.log(result);
            this.toastr.info('Cuota agregada');
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  public generarNumeroAlquiler() {
    this.alquilerService.generarNumeroAlquiler().subscribe(
      (data: string) => {
        this.numeroAlquiler = data + '';
      },
      (error) => {
        console.log(error);
      }
    );
  }
  public userLogin():boolean{
    return this.usuarioService.userLoggedIn()
  }
}
