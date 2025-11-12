import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AlquilerService } from '../../services/alquiler.service';
import { CuotaService } from '../../services/cuota.service';
import { Cuota } from '../../models/cuota';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalService } from '../../services/local.service';
Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})

export class EstadisticasComponent {

  myChart: Chart | null = null;

  totalCuotas!: Array<Cuota>;
  totalCuotasAlquiler!: Array<Cuota>;
  localesData!: number[];
  nombresMeses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  titulo! : string;

  constructor(private alquierService: AlquilerService, private cuotaService: CuotaService, private localService: LocalService) {
    this.loadCuotas();
    this.loadDataLocales();
    setTimeout(() => {
      this.getDataCuotas();
    }, 1000);
  }

  loadCuotas(): void {
    this.cuotaService.obtenerCuotas().subscribe(
      cuotas => {
        this.totalCuotas = new Array<Cuota>;
        let nCuota: Cuota;
        for (let c of cuotas) {
          nCuota = new Cuota();
          Object.assign(nCuota, c);
          nCuota.fechaCreacion = new Date(c.fechaCreacion);

          this.totalCuotas.push(nCuota);
        }

        this.totalCuotas.sort((a, b) => a.fechaCreacion.getTime() - b.fechaCreacion.getTime());
      }
    )
  }

  loadDataLocales(): void {
    this.localService.obtenerLocales().subscribe(
      locales => {
        this.localesData = [0, 0];

        for (let l of locales) {
          if (l.alquilado)
            this.localesData[0]++;
          else
            this.localesData[1]++;
        }
      }
    )
  }

  getDataCuotas() {
    this.cargarGraficoBarras(this.calcularMontosPorMes(this.totalCuotas));
    this.titulo = "Ganancias Por Mes";
  }

  getDataLocales() {
    this.cargarTorta();
    this.titulo = "Estado de Locales";
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

  cargarGraficoBarras(datos: any) {

    const data = {
      labels: datos.meses,
      datasets: [{
        label: 'Monto de Dinero',
        data: datos.montos,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks : {
              color : 'white'
            }
          },
          x : {
            ticks : {
              color : 'white'
            }
          }
        }
      }
    };

    if (this.myChart)
      this.myChart.destroy();

    this.myChart = new Chart(
      document.getElementById('grafico') as HTMLCanvasElement,
      config
    );
  }

  cargarTorta() {
    const data = {
      labels: ['Alquilado', 'No Alquilado'],
      datasets: [{
        label: 'Estado de Alquileres',
        data: this.localesData,
        backgroundColor: [
          'rgba(44, 175, 227, 0.7)',
          'rgba(252, 160, 0, 0.7)'
        ],
        borderColor: [
          'rgba(44, 175, 227, 1)',
          'rgba(252, 160, 0, 1)'
        ],
        borderWidth: 1
      }]
    };

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
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
        }
      },
    };

    if (this.myChart)
      this.myChart.destroy();

    this.myChart = new Chart(
      document.getElementById('grafico') as HTMLCanvasElement,
      config as any
    );
  }
}