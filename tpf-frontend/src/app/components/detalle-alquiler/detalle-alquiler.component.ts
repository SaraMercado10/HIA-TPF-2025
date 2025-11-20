import { Component, OnInit } from '@angular/core';
import { Alquiler } from '../../models/alquiler';
import { AlquilerService } from '../../services/alquiler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cuota } from '../../models/cuota';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MercadopagoService } from '../../services/mercadopago.service';
import { PdfService } from '../../services/pdf.service';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

Chart.register(...registerables);

@Component({
  selector: 'app-detalle-alquiler',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPayPalModule],
  templateUrl: './detalle-alquiler.component.html',
  styleUrl: './detalle-alquiler.component.css'
})
export class DetalleAlquilerComponent implements OnInit {

  myChart: Chart | null = null;
  status!: string;
  idTrasnsaccion!: string;
  bandLimpiar = true;

  alquiler!: Alquiler;
  proximaCuotaAPagar!: Cuota;
  idAlquiler!: string;
  estadoCuota!: string;
  controlAdelantar!: boolean;
  nombresMeses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  payPalConfig?: IPayPalConfig;
  conversion: number = 1400;
  clienteSb: string = 'AVNzwbPl3tv4ne2v7btWUjC0C8B4I3LiJIaHmKIZC3yHS69q7AV_6-QUOPqWY0TmWqqvClXNYdQmHOuy'
  //cuotaSeleccionada: Cuota = new Cuota();
  //idAlquilerModal:string = '';
  modalVisible: boolean = false;
  //primerCuotaPendienteIndex: number = -1;

  constructor(private alquilerService: AlquilerService, private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private mpService: MercadopagoService,
    private pdfService: PdfService,
    private loginService: UsuarioService,
    private router : Router
  ) { }


  ngOnInit(): void {
    this.initConfig();
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.status = params['collection_status'];
        this.idTrasnsaccion = params['collection_id'];
      }
    )
    this.controlAdelantar = false;
    this.cargarCuota();
  }

  cargarCuota() {
    this.activatedRoute.params.subscribe((params) => {

      this.idAlquiler = params['id'];

      this.alquilerService.obtenerAlquilerById(this.idAlquiler).subscribe(
        alq => {

          //obtengo alquiler
          this.getAlquiler(alq);

          //Obtengo ultima cuota
          this.getUltimaCuota();

          this.estadoCuota = (this.proximaCuotaAPagar.pagado) ? "Saldado" : "Pendiente";

          //verifica si es tiene una solicitud aprobada
          if ( this.status == "approved" && !this.proximaCuotaAPagar.pagado)
            this.actualizarCuota();

          //Carga Grafico
          setTimeout(() => {
            this.mostrarGrafico();
          }, 1000);
        }
      )
    });
  }

  getAlquiler(alq: any) {
    this.alquiler = new Alquiler();
    Object.assign(this.alquiler, alq);
    for (let c of this.alquiler.cuota) {
      c.fechaCreacion = new Date(c.fechaCreacion);
    }
  }

  getUltimaCuota() {
    this.proximaCuotaAPagar = new Cuota();
    Object.assign(this.proximaCuotaAPagar, this.alquiler.cuota[this.alquiler.cuota.length - 1]);
  }

  mostrarGrafico() {
    this.cargarGraficoLinea(this.calcularMontosPorMes(this.alquiler.cuota));
  }

  calcularMontosPorMes = (cuotas: Cuota[]): { meses: string[], montos: number[] } => {
    const sumasMensuales: { [key: string]: number } = {};

    for (let c of cuotas) {
      if (c.pagado) {
        const mes = this.nombresMeses[c.fechaCreacion.getMonth()];
        if (!sumasMensuales[mes]) {
          sumasMensuales[mes] = 0;
        }
        sumasMensuales[mes] += c.monto;
      }
    }

    const meses: string[] = [];
    const montos: number[] = [];

    for (const [mes, sum] of Object.entries(sumasMensuales)) {
      meses.push(mes);
      montos.push(sum);
    }

    return { meses, montos };
  }

  cargarGraficoLinea(datos: any) {
    const data = {
      labels: datos.meses,
      datasets: [{
        label: 'Monto de Dinero',
        data: datos.montos,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        tension: 0.1
      }]
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'white'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'white'
            }
          },
          y: {
            ticks: {
              color: 'white'
            }
          }
        }
      },
    };

    if (this.myChart)
      this.myChart.destroy();

    const ctx = document.getElementById('grafico') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, config);
  }

  pagarCuota() {
    this.mpService.getPagoLink(this.proximaCuotaAPagar.monto, this.alquiler._id).subscribe(
      result => {
        window.location.href = result.init_point;
      }
    )
  }

  actualizarCuota() {
    this.proximaCuotaAPagar.pagado = true;
    this.proximaCuotaAPagar.medioPago = "Mercado Pago";
    this.proximaCuotaAPagar.fechaPago = new Date();
    this.proximaCuotaAPagar.cuponQr = "https://www.mercadopago.com.ar/tools/receipt-view/"+this.idTrasnsaccion;

    this.alquilerService.actualizarCuota(this.alquiler._id, this.proximaCuotaAPagar._id, this.proximaCuotaAPagar).subscribe(
      res => {
        this.toastr.success("Pago realizado");
        this.router.navigate(['alquiler-detalle/', this.idAlquiler]);
        this.cargarCuota();
      },
      error => {
        this.toastr.error("Pago no realizado");
        console.error("Error al actualizar la cuota:", error);
      }
    )
    this.alquilerService.obtenerAlquilerById(this.idAlquiler).subscribe(
      alq => {
        this.getAlquiler(alq);
        setTimeout(() => {
          this.getUltimaCuota();
        }, 100);
        this.estadoCuota = (this.proximaCuotaAPagar.pagado) ? "Saldado" : "Pendiente";
      }
    )
  }

  asignarAlquiler(alq: any) {
    this.alquiler = new Alquiler();
    Object.assign(this.alquiler, alq);
    for (let c of this.alquiler.cuota) {
      c.fechaCreacion = new Date(c.fechaCreacion);
    }
  }

  private async initConfig() {
    this.payPalConfig = {
      currency: 'USD',
      clientId: this.clienteSb,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (this.proximaCuotaAPagar ? (this.proximaCuotaAPagar.monto).toFixed(2) : '0.00'),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (this.proximaCuotaAPagar ? (this.proximaCuotaAPagar.monto).toFixed(2) : '0.00')
              }
            }
          },
          items: [{
            name: 'Pago de Alquiler',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: (this.proximaCuotaAPagar ? (this.proximaCuotaAPagar.monto).toFixed(2) : '0.00'),
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
      onClientAuthorization: async (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point',
          JSON.stringify(data));
        try {
          const result = await this.generarPDF(data);
          console.log('PDF generado correctamente:', result);
          data.purchase_units[0].amount.value = this.proximaCuotaAPagar.monto.toString();
          this.proximaCuotaAPagar.fechaPago = new Date(data.create_time);
          this.generarPDF(data);
          console.log('fin pdf generado!!!!!')
          console.log(this.proximaCuotaAPagar);
          console.log('Actualizando cuota!!!!!')
          this.actualizarCuotaPagada();
          console.log('Finctualizando cuota!!!!!')
          // this.showModal(this.proximaCuotaAPagar);

          // Actualizar cuota después de generar el PDF y QR
          this.proximaCuotaAPagar.cuponQr = result.qrCode;
          await this.actualizarCuotaPagada();
          window.location.reload();
        } catch (error) {
          console.error('Error al generar el PDF:', error);
        }

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

  public mostrarPayPal() {
    this.initConfig();
  }

  private async actualizarCuotaPagada() {
    this.proximaCuotaAPagar.pagado = true;
    this.proximaCuotaAPagar.medioPago = 'Paypal';
    this.proximaCuotaAPagar.fechaPago = new Date();
    this.alquilerService.actualizarCuota(this.idAlquiler, this.proximaCuotaAPagar._id, this.proximaCuotaAPagar).subscribe(
      (response) => {
        console.log('Cuota actualizada correctamente:', response);
        this.status = "";
      },
      (error) => {
        console.error('Error al actualizar la cuota:', error);
      }
    );
  }
  public userPerfil() {
    return this.loginService.perfilLogged();
  }

  aceptarModal() {
    window.location.reload();
  }
  private showModal(c: Cuota) {
    this.modalVisible = true;

  }
  public generarPDF(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pdfService.generatePDF(data).subscribe(
        (result) => {
          resolve(result);
          console.log(result);
          console.log('URL del PDF:', result.pdfUrl);
          console.log('QR Code:', result.qrCode);
          console.log('Asignando QR')
          this.proximaCuotaAPagar.cuponQr = result.qrCode;
          console.log('QR Asignado')
          console.log('File Code:', result.pdfFilePath);

          const pdfFileName = result.pdfUrl.replace('http://localhost:3000/temp/', '');
          console.log('Nombre del archivo PDF:', pdfFileName);
          console.log('PDF Generado FIN:', pdfFileName);
          //const url = window.URL.createObjectURL(pdfFileName);
          //window.open(pdfFileName);


        },
        (error) => {
          reject(error);
          console.error('Error al generar el PDF:', error);
        }
      );
    });
  }

  public adelantarCuota(alquiler: Alquiler) {
    let ultimaCuota = alquiler.cuota.length - 1;
    if (alquiler.cuota[ultimaCuota].pagado && !this.controlAdelantar) {
      if (alquiler.cuota.length < alquiler.cantidadMesAlquiler!){
        this.agregarCuota(alquiler);
        this.controlAdelantar = true;
        this.toastr.success('Cuota agregada');
        setTimeout(() => {
          this.cargarCuota();
        }, 1000);
      } else{
        this.toastr.info('Ya realizaste todos los pagos');
      }
    } else {
      this.toastr.warning('Debes pagar la cuota pendiente');
    }
  }

  public agregarCuota(alquiler: Alquiler) {
    var cuota: Cuota;
    cuota = new Cuota();
    this.alquilerService.obtenerAlquilerByNumero(alquiler.numeroAlquiler).subscribe(
      (result: any) => {
        Object.assign(alquiler, result);
        cuota.monto = alquiler.local.costoMes;
        this.alquilerService.agregarCuota(alquiler._id, cuota).subscribe(
          (result) => {
            console.log(result);
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
}



