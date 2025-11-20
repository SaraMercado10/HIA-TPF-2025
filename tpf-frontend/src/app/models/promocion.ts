import { Alquiler } from "./alquiler";

export class Promocion {
    _id!: string;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string;
    imagen: string;
    alquiler: Alquiler;
    disponible: boolean;

    constructor(){
        this.fechaInicio = new Date();
        this.fechaFin = new Date();
        this.descripcion = "";
        this.imagen = "";
        this.alquiler = new Alquiler();
        this.disponible = true;
    }
}