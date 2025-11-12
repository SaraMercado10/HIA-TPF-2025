import { Component } from '@angular/core';
import { Alquiler } from '../../models/alquiler';
import { AlquilerService } from '../../services/alquiler.service';
import { LocalService } from '../../services/local.service';
import { CuotaService } from '../../services/cuota.service';
import { PromocionService } from '../../services/promocion.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Local } from '../../models/local';
import { Cuota } from '../../models/cuota';
import { Promocion } from '../../models/promocion';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';

import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../services/usuario.service';
import { NovedadService } from '../../services/novedad.service';
import { Novedad } from '../../models/novedad';



import { PdfService } from '../../services/pdf.service';

// Import library module


@Component({
  selector: 'app-tabla-alquiler',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPayPalModule],
  templateUrl: './tabla-alquiler.component.html',
  styleUrl: './tabla-alquiler.component.css',
  
})
export class TablaAlquilerComponent {
  alquileres: Array<Alquiler>;
  alquiler: Alquiler
  accion: string = 'new';
  local: Local;
  cuotas: Array<Cuota>;
  public payPalConfig?: IPayPalConfig;
  conversion: number = 1400;
  clienteSb: string = 'AVNzwbPl3tv4ne2v7btWUjC0C8B4I3LiJIaHmKIZC3yHS69q7AV_6-QUOPqWY0TmWqqvClXNYdQmHOuy'
  cuotaSeleccionada: Cuota = new Cuota();
  idAlquilerModal:string = '';
  modalVisible: boolean = false;
  primerCuotaPendienteIndex: number = -1;
  
  constructor(private alquilerService: AlquilerService,
    private localService: LocalService,
    private cuotaService: CuotaService,
    private loginService: UsuarioService,
    private router: Router,
    private novedadService: NovedadService,
    //private toastr: ToastrService
    private toastr: ToastrService,
    private pdfService: PdfService,
    private promocionService: PromocionService
  ) {
    this.alquileres = new Array();
    this.alquiler = new Alquiler();
    this.local = new Local();
    this.cuotas = new Array<Cuota>;

  }

  ngOnInit() {
    this.obtenerAlquileres();
    //this.initConfig();
  }
  public obtenerAlquileres() {
    this.alquileres = new Array();
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

  public agregarAlquiler() {
    this.router.navigate(['alquiler-form/', 0]);
  }

  public modificarAlquiler(id: string) {
    this.router.navigate(['alquiler-form/', id]);
  }

  public eliminarAlquiler(alquiler: Alquiler) {
    this.eliminarNovedades(alquiler);
    this.eliminarPromociones(alquiler);
    this.modificarLocal(alquiler.local);
    this.eliminarCuota(alquiler);
    this.alquilerService.eliminarAlquiler(alquiler.id).subscribe(
      (result) => {
        console.log(result);
        this.toastr.info('Alquiler eliminado');
        this.obtenerAlquileres();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Eliminar promociones que se hayan registrdo en un alquiler
  public eliminarPromociones(alquiler: Alquiler): void {
    this.promocionService.getByAlquiler(alquiler.id).subscribe(
      (result) => {
        let promociones: Promocion[] = result;
        this.toastr.info('Promociones Asociadas al alquiler '+alquiler.numeroAlquiler+' eliminadas');
        promociones.forEach(promocion => {
          this.eliminarPromocion(promocion.id);
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }

  /**Elimina una promocion por id */
  public eliminarPromocion(id: string): void {
    this.promocionService.delete(id).subscribe(
      (result: any) => {
        if (result.status == 1) {
          console.log('Promocion eliminada...')
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  /**Elimina las novedades que se hayan registrado de un alquiler*/
  public eliminarNovedades(alquiler: Alquiler): void{
    this.novedadService.getByAlquiler(alquiler.id).subscribe(
      (result) => {
        let novedades: Novedad[] = result;
        this.toastr.info('Novedades Asociadas al alquiler ' + alquiler.numeroAlquiler + ' eliminadas');
        novedades.forEach(novedad => {
          novedad.estado='Archivado';
          this.eliminarNovedad(novedad.id);
        });
      },
      (error) => {
        console.log(error);
      }
    )
  }
  /**Elimina una novedad por id */
  public eliminarNovedad(id: string): void{
    this.novedadService.remove(id).subscribe(
      (result: any) => {
        if (result.status == 1) {
          console.log('Novedad eliminada...')
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  public modificarLocal(local: Local) {
    local.alquilado = false;
    local.nombre = "";
    local.rubro = "";
    this.localService.modificarLocal(local).subscribe(
      (result: any) => {
        console.log(result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  public eliminarCuota(alquiler: Alquiler) {
    for (let i = 0; i < alquiler.cuota.length; i++) {
      this.cuotaService.eliminarCuota(alquiler.cuota[i].id).subscribe(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
    }

  }

  public obtenerCuotas(alquiler: Alquiler) {
    this.alquiler = alquiler;
    this.idAlquilerModal=alquiler.id;
    this.cuotas = new Array<Cuota>();
    this.cuotas = alquiler.cuota;
    for(let c of this.cuotas){
      c.fechaVencimiento = new Date(c.fechaVencimiento);
      if(c.fechaPago)
        c.fechaPago = new Date(c.fechaPago);
    }
  }

  //Agregar una cuota a un alquiler
  public agregarCuota(alquiler: Alquiler) {
    var cuota: Cuota;
    cuota = new Cuota();
    this.alquilerService.obtenerAlquilerByNumero(alquiler.numeroAlquiler).subscribe(
      (result: any) => {
        Object.assign(alquiler, result);
        cuota.monto = alquiler.local.costoMes;
        this.alquilerService.agregarCuota(alquiler.id, cuota).subscribe(
          (result) => {
            console.log(result);
            this.toastr.success('Cuota agregada');
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


  public adelantarCuota(alquiler: Alquiler) {
    let ultimaCuota = alquiler.cuota.length - 1;
    if (alquiler.cuota[ultimaCuota].pagado) {
      this.agregarCuota(alquiler);
    } {
      this.toastr.info('Debes pagar la cuota anterior');
    }
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: this.clienteSb,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (this.cuotaSeleccionada ? (this.cuotaSeleccionada.monto / this.conversion).toFixed(2) : '0.00'),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (this.cuotaSeleccionada ? (this.cuotaSeleccionada.monto / this.conversion).toFixed(2) : '0.00')
              }
            }
          },
          items: [{
            name: 'Pago de Alquiler',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: (this.cuotaSeleccionada ? (this.cuotaSeleccionada.monto / 1400).toFixed(2) : '0.00'),
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point',
          JSON.stringify(data));
          data.purchase_units[0].amount.value = this.cuotaSeleccionada.monto.toString();
          this.cuotaSeleccionada.fechaPago = new Date(data.create_time);          
          this.generarPDF(data);
          this.actualizarCuotaPagada(this.cuotaSeleccionada!);
          this.showModal(this.cuotaSeleccionada);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);

      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);

      }
    };
  }
  public mostrarPayPal(cuota: Cuota) {
    this.cuotaSeleccionada = cuota;    
    this.initConfig();
  }
  private actualizarCuotaPagada(cuota: Cuota) {
    cuota.pagado = true;
    //cuota.fechaPago = new Date();
    cuota.medioPago = 'Paypal';
    this.alquilerService.actualizarCuota(this.idAlquilerModal, cuota.id, cuota).subscribe(
      (response) => {
        console.log('Cuota actualizada correctamente:', response);
        
      },
      (error) => {
        console.error('Error al actualizar la cuota:', error);
        
      }
    );
    this.cuotaService.modificarCuota(cuota).subscribe(
      (result: any) => {
        console.log(result);
      },
      (error: any) => {
        console.log(error);
      }
    );
    
  }
 public userPerfil(){
  return this.loginService.perfilLogged();
 }

 aceptarModal() {
  window.location.reload();
}
private showModal(c:Cuota) {
  this.modalVisible = true;
  
}
public generarPDF(data:any):void {
  
  this.pdfService.generatePDF(data).subscribe(
    (result) => {
      console.log(result);        
      console.log('URL del PDF:', result.pdfUrl);
      console.log('QR Code:', result.qrCode);
      console.log('QR Code:', result.pdfFilePath);
      const pdfFileName = result.pdfUrl.replace('http://localhost:3000/temp/', '');
      console.log('Nombre del archivo PDF:', pdfFileName);
      this.cuotaSeleccionada.cuponQr=result.qrCode;
      //const url = window.URL.createObjectURL(pdfFileName);
      //window.open(pdfFileName);

      
    },
    error => {
      console.error('Error al generar el PDF:', error);
    }
  );

}
determinarPrimerCuotaPendiente(listaCuotas: Array<Cuota>) {
  // Recorremos el arreglo de cuotas
  this.primerCuotaPendienteIndex = -1;
  for (let i = 0; i < listaCuotas.length; i++) {
    // Si encontramos una cuota que no está pagada
    if (!this.cuotas[i].pagado) {
      // Almacenamos el índice de esta cuota como la primera pendiente
      this.primerCuotaPendienteIndex = i;
      // Salimos del bucle, ya que solo necesitamos el primer índice pendiente
      break;
    }
  }
}

 public verDetalle(id : string){
   this.router.navigate(['alquiler-detalle/', id]);
 }
}
