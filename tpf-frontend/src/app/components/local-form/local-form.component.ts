import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Local } from '../../models/local';
import { LocalService } from '../../services/local.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptorService } from '../../services/token-interceptor.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-form-local',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './local-form.component.html',
  styleUrl: './local-form.component.css',
})
export class LocalFormComponent implements OnInit{
  
  modalVisible: boolean = false;
  mostrarForm!: boolean;
  accion: string = 'new';
  locales!: Local[];
  local!: Local;
  esImgLogo: boolean=false;
  numeroLocal!: string;

  @ViewChild('formLocal') formLocal!: NgForm;

  constructor(
    private localService: LocalService,
    private router: Router,
    private activatedRoute: ActivatedRoute, private toastr: ToastrService
  ) {
    this.generarNumeroLocal();
  }

  ngOnInit(): void {
    this.iniciarVariables();
    this.cargarFormulario();
    /*if(this.accion == "new"){
      this.generarNumeroLocal();
    }*/
    if (localStorage.getItem('localCreated') === 'true') {
      this.toastr.success('Local creado');
      localStorage.removeItem('localCreated');
    }
  }

  public generarNumeroLocal() {
    this.localService.generarNumeroLocal().subscribe(
      (data: string) => {
        this.numeroLocal = data + '';
        //this.local.numero = this.numeroLocal;
        console.log(this.local.numero)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  iniciarVariables(){
    this.local = new Local();
    this.locales = [];
    this.mostrarForm = true;
    this.numeroLocal = "";
  }
  /**Muestra o no los datos precargados de un local, según el parametro enviado por la url.*/
  cargarFormulario(){
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] == '0') {
        this.accion = 'new';
      } else {
        this.accion = 'update';
        this.cargarLocal(params['id']);
      }
    });
  }
  limpiarFormulario() {
    this.formLocal.reset();
  }

  public verLocales() {
    this.router.navigate(['/local-tabla']);
  }

  public registrarLocal() {
    this.local.numero = this.numeroLocal;
    this.local.rubro = "Sin asignar";
    this.local.nombre = "Sin asignar";
    this.local.alquilado = false;
    this.localService.crearLocal(this.local).subscribe(
      (result: any) => {
        if (result.status == 1) {
          //this.limpiarFormulario();
          //this.showModal();
          //this.router.navigate(['/local-tabla']);
          localStorage.setItem('localCreated', 'true');
          window.location.reload();
        }
        console.log(result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  cargarLocal(id: string): void {
    console.log(id);

    this.localService.obtenerLocalPorId(id).subscribe(
      (result: any) => {
        Object.assign(this.local, result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  modificarLocal(localModificado: Local) {
    this.localService.modificarLocal(localModificado).subscribe(
      (result) => {
        if (result.status == 1) {
          this.toastr.info('Local modificado');
          this.router.navigate(['/local-tabla']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private showModal() {
    this.modalVisible = true;
    this.mostrarForm = false;
  }

  /*public closeModal() {
    this.modalVisible = false;
    this.limpiarFormulario();
    this.mostrarForm = true;
  }*/

  aceptarModal() {
    window.location.reload();
    this.limpiarFormulario();
    this.mostrarForm = true;
  }

  //Guardar Imagenes
  archivoSeleccionado(event: any,tipoImg: string) { 
    const files = event.target.files;
    if(files.length > 0) {
      const file = files[0];
      this.convertirBase64(file,tipoImg);
    } 
  }
  convertirBase64(file: File, tipoImg: string){
    const reader = new FileReader();
      reader.onload = () => {
        let  base64 = reader.result as string;
        switch(tipoImg){
          case 'esImagen': this.local.setImagen(base64); break;
          case 'esLogo': this.local.setLogo(base64);break;
        }
      }; 
      reader.readAsDataURL(file); 
  }
}