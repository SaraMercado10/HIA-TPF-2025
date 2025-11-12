import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalService } from '../../services/local.service';
import { Local } from '../../models/local';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tabal-local',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-local.component.html',
  styleUrl: './tabla-local.component.css',
})
export class TablaLocalComponent {
  locales: Array<Local>;
  accion: string = 'new';

  constructor(
    private localService: LocalService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.locales = new Array();
    this.obtenerLocales();
  }

  public obtenerLocales() {
    this.locales = [];
    this.localService.obtenerLocales().subscribe(
      (result) => {
        console.log(result);
        this.locales = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  agregarLocal(){
    this.router.navigate(['local-form/',0]);
  }

  modificarLocal(id: string) {
    this.router.navigate(['local-form/', id]);
  }

  public eliminarLocal(id: string) {
    this.localService.eliminarLocal(id).subscribe(
      (result) => {
        console.log(result);
        this.toastr.warning("Local eliminado");
        this.obtenerLocales();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.msg);
      }
    );
  }
}

