import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalService } from '../../services/local.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Local } from '../../models/local';
import {  Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  locales : {_id:string,logo:SafeUrl,numero:string}[] = [];
  nombre: string = "";

  constructor(
    private localService: LocalService,
    private domSanitizer: DomSanitizer,
    private router: Router
  ){}

  ngOnInit(){
    this.obtenerLocales();
  }
//Servicios
  obtenerLocales():void{
    this.localService.obtenerLocales().subscribe(
      (result) => {
        this.cargarListaLocales(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  //Métodos
  cargarListaLocales(locales: Local[]){
    locales.forEach(local => {
      let logo:SafeUrl = this.domSanitizer.bypassSecurityTrustUrl(local.logo);
      this.locales.push({_id:local._id,logo: logo , numero: local.numero});
    });
  }
  verLocal(id: string):void{
    this.router.navigate(['local/', id]);
    console.log(id);
  }
  filtrarLocales(){
    this.localService.getByFiltros({
      nombre: this.nombre
    }).subscribe(
      result => {
        this.locales = new Array<Local>;
       Object.assign(this.locales, result);
      }
    )
  }
}