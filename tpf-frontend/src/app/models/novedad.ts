import { Alquiler } from "./alquiler";

export class Novedad {
    _id!: string;
    alquiler: Alquiler = new Alquiler();
    descripcion: String = '';
    estado: String = '';

    constructor(alquiler?: Alquiler, descripcion?: String, estado?: String) {
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