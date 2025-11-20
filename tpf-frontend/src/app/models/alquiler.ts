import { Cuota } from "./cuota"
import { Local } from "./local";
import { Usuario } from "./usuario"

export class Alquiler {
    _id!: string;
    numeroAlquiler: string; 
    cantidadMesAlquiler: number | null;
    plazoMes: number;
    costoAlquiler: number;
    fechaAlquiler: Date;
    cuota: Array<Cuota>;
    usuario: Usuario | null;
    local: Local;

constructor(){
    this.numeroAlquiler = "";
    this.cantidadMesAlquiler= null;
    this.plazoMes = 10;
    this.costoAlquiler = NaN;
    this.fechaAlquiler = new Date();
    this.cuota = new Array<Cuota>();
    this.usuario = null;
    this.local = new Local();
}
}
