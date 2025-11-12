import { Cuota } from "./cuota"
import { Local } from "./local";
import { Usuario } from "./usuario"

export class Alquiler {
    id!: string;
    numeroAlquiler: string; 
    cantidadMesAlquiler: number | null;
    plazoMes: number;
    costoAlquiler: number;
    fechaAlquiler: Date;
    cuota: Array<Cuota>;
    usuario: Usuario | null;
    local: Local;
    localId: string | null; // Nueva propiedad auxiliar

constructor(){
    this.numeroAlquiler = "";
    this.cantidadMesAlquiler= null;
    this.plazoMes = 10;
    this.costoAlquiler = NaN;
    this.fechaAlquiler = new Date();
    this.cuota = new Array<Cuota>();
    this.usuario = null;
    this.local = new Local();
    this.localId = null; // Inicializar en null
    }

    // Método para obtener un JSON con solo los IDs de usuario y local
    public obtenerJson(): any {
        return {
            id: this.id,
            numeroAlquiler: this.numeroAlquiler,
            cantidadMesAlquiler: this.cantidadMesAlquiler,
            plazoMes: this.plazoMes,
            costoAlquiler: this.costoAlquiler,
            fechaAlquiler: this.fechaAlquiler,
            localId: this.local ? this.local.id : this.localId, // Enviar localId si está disponible
            usuarioId: this.usuario ? this.usuario.id : null,  // Aquí usamos solo el ID
            cuota: this.cuota
        };
    }
}
