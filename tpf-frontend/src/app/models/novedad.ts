import { Alquiler } from "./alquiler";

export class Novedad {
    id!: string;
    alquiler: Alquiler = new Alquiler();
    alquilerId!: string;
    descripcion: string = '';
    estado: string = '';

    constructor(alquiler?: Alquiler, descripcion?: string, estado?: string) {
        if(alquiler)
            this.alquiler = alquiler;
        if(descripcion)
            this.descripcion = descripcion;
        if(estado)
            this.estado = estado;
    }
    // Getter y Setter
    setEstado(estadoNuevo: string) {
        if (estadoNuevo) {
           this.estado = estadoNuevo;
        } else {
            throw new Error("El estado no puede estar vacío");
        }
    }
}