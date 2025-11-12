import { Component } from '@angular/core';
import { Promocion } from '../../models/promocion';
import { Alquiler } from '../../models/alquiler';
import { AlquilerService } from '../../services/alquiler.service';
import { PromocionService } from '../../services/promocion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FacebookService, InitParams } from 'ngx-facebook';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-promocion-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './promocion-form.component.html',
  styleUrl: './promocion-form.component.css',
})
export class PromocionFormComponent {
  accion: string = 'new';
  modalVisible: boolean = false;
  mostrarForm: boolean = false;
  promocion = new Promocion();
  alquiler = new Alquiler();
  alquileres = new Array<Alquiler>();
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  selectedFile: File | null = null;
  validarFecha: boolean = false;
  fb: FacebookService;
  accessToken: string = "EAAOWtVwIpHMBO14ZAgwqXBivmxVRzkZCxflLflOpvsB6CbuGAnkwofAGH356VWZAaym3d6ZAjqR5pCFlZBta8Twq1jhePBZAIv630TcOGmuafcyhV05fboZB99XEwMHATHpmZCFAIJcH8tSmo8h8eTrHpPwnT47RSpvqj1msLynXD9Kr1ZB2WqShotfxfFHQCiA7dM0ZCPHbe6mV6Ie2NEW7htZCqzZC9ZCpkmEw6";

  constructor(
    private alquilerService: AlquilerService,
    private promocionService: PromocionService,
    fb: FacebookService,
    private http: HttpClient,
    private toastr: ToastrService,
    private loginService: UsuarioService
  ) {
    this.obtenerAlquileres();
    this.fb = fb;
    this.inciarPublishFb();
  }

  nuevaPromocion() {
    this.mostrarForm = true;
  }

  obtenerAlquileres() {
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
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.convertirBase64(this.selectedFile!);
  }

  convertirBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.promocion.imagen = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  guardarPromocion() {
    this.promocion.alquiler = this.alquiler;
    this.promocion.disponible = true;
    this.promocion.fechaInicio = new Date(this.fechaInicio);
    this.promocion.fechaFin = new Date(this.fechaFin);
    if (this.promocion.fechaFin > this.promocion.fechaInicio) {
      this.promocion.alquilerId = this.alquiler.id; // Solo pasamos el ID del alquiler
      this.promocionService.save(this.promocion).subscribe(
        (result: any) => {
          this.toastr.success('Promoción Guardada');
          console.log(result);
        },
        (error: any) => {
          console.error('Error al guardar la promoción', error);
          if (error.status === 400) {
            console.error('Solicitud incorrecta', error.error);
          }
        }
      );
    } else {
      this.validarFecha = true;
    }
  }

  inciarPublishFb() {
    let initParams: InitParams = {
      appId: '1010130607449203',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v7.0'
    };
    this.fb.init(initParams);
  }

  postImageFileFb() {
    if (this.promocion.fechaFin > this.promocion.fechaInicio) {
      if (this.selectedFile && this.accessToken) {
        const formData = new FormData();
        formData.append('source', this.selectedFile);
        formData.append('caption', this.promocion.descripcion);
        formData.append('access_token', this.accessToken);

        const headers = new HttpHeaders();

        this.http.post(`https://graph.facebook.com/v7.0/me/photos`, formData, { headers })
          .subscribe(response => {
            this.toastr.success('Promoción Publicada');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            console.log('Imagen publicada con éxito', response);
          }, error => {
            console.error('Error al publicar la imagen', error);
          });
      } else {
        console.error('No se ha seleccionado ningún archivo o el token de acceso no está disponible');
      }
    }
    }
    
}
