import { Component, OnInit } from '@angular/core';
import { LocalService } from '../../services/local.service';
import { PromocionService } from '../../services/promocion.service';
import { Local } from '../../models/local';
import { ActivatedRoute } from '@angular/router';
import { TokenInterceptorService } from '../../services/token-interceptor.service';
import { UsuarioService } from '../../services/usuario.service';
import { Promocion } from '../../models/promocion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-local',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './local.component.html',
  styleUrl: './local.component.css'
})
export class LocalComponent implements OnInit{
  local: Local = new Local();
  locales: Local[] = [];
  promociones: Promocion[] = [];

  constructor(
    private localService: LocalService,
    private promocionService: PromocionService,
    private activatedRoute: ActivatedRoute,
    public loginService: UsuarioService,
  ) {}
  
  ngOnInit(): void {
    this.cargarLocal();
    
  }
  cargarLocal(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.localService.obtenerLocalPorId(params['id']).subscribe(
        (result: any) => {
          Object.assign(this.local, result);
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  /**Carga la lista de alquileres */
  cargarAlquileres(): void{
    this.promocionService.getAll().subscribe(
      (result)=>{
        this.cargarPromocionesByLocal(result);
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  cargarPromocionesByLocal(result: any):void{
    this.activatedRoute.params.subscribe((params) => {
      this.promociones=[];
      for(let i=0;i< result.length;i++){
        if(result[i].alquiler.local.id===params['id']){
          this.promociones.push(result[i]);
        }
      }
    });
  }
}
