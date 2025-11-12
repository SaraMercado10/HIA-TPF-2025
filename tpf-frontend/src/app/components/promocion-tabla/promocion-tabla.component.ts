import { Component } from '@angular/core';
import { Promocion } from '../../models/promocion';
import { ToastrService } from 'ngx-toastr';
import {  Router } from '@angular/router';
import { PromocionService } from '../../services/promocion.service';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promocion-tabla',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './promocion-tabla.component.html',
  styleUrl: './promocion-tabla.component.css'
})
export class PromocionTablaComponent {

  accion: string = 'new';
  promociones: Array<Promocion>;

  constructor(private promocionService: PromocionService, private router: Router, private toastr: ToastrService, private loginService: UsuarioService){
    this.promociones = new Array();
    this.obtenerPromociones();
  }

  public obtenerPromociones(){
    this.promociones = [];
    this.promocionService.getAll().subscribe(
      (result: any) => {
        let vAlquiler: Promocion = new Promocion();
        result.forEach((element: any) => {
          Object.assign(vAlquiler, element);
          this.promociones.push(vAlquiler);
          vAlquiler = new Promocion();
        });
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  public eliminarPromocion(id: string){
    this.promocionService.delete(id).subscribe(
      (result) => {
        console.log(result);
        this.toastr.warning('Promoción eliminada');
        this.obtenerPromociones();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error al eliminar la promoción!');
      }
    )
  }

}
