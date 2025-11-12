import { Alquiler } from "./alquiler";

export class Promocion {
    id!: string;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string;
    imagen: string;
    alquiler: Alquiler; // Aquí usas el ID de la relación, no el objeto completo
    alquilerId!: string; // Variable adicional para enviar solo el ID
    disponible: boolean;

    constructor(){
        this.fechaInicio = new Date();
        this.fechaFin = new Date();
        this.descripcion = "";
        this.imagen = "";
        this.alquiler=new Alquiler();
        this.disponible = true;
    }
}