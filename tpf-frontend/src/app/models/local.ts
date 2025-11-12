export class Local{
    id!: string;
    numero: string;
    nombre: string;
    superficie: string;
    habilitado: boolean;
    costoMes: number;
    logo: string;
    imagen: string;
    alquilado: boolean;
    rubro: string;

    constructor(){
        this.numero = "";
        this.nombre = "";
        this.superficie = "";
        this.habilitado = false;
        this.costoMes = NaN;
        this.logo = "";
        this.imagen = "";
        this.alquilado = false;
        this.rubro = "";
    }

     // Getter y Setter
    setImagen(imgNuevo: string) {
        if (imgNuevo) {
           this.imagen = imgNuevo;
        } else {
            throw new Error("El nombre de imagen no puede estar vacío");
        }
    }
    setLogo(logoNuevo: string) {
        if (logoNuevo) {
           this.logo = logoNuevo;
        } else {
            throw new Error("El nombre de logo no puede estar vacío");
        }
    }  
}