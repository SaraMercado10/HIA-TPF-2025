export class Cuota {
    _id!:string;
    monto: number;
    fechaCreacion: Date;
    fechaVencimiento: Date;
    recargoAplicado: boolean;
    fechaPago: Date | null;
    medioPago: string;
    cuponQr: string;
    pagado: boolean;

    constructor(){
        this.monto = NaN;
        this.fechaCreacion = new Date();
        this.fechaVencimiento = new Date();
        this.recargoAplicado = false;
        this.fechaPago = null;
        this.medioPago = " ";
        this.cuponQr = " ";
        this.pagado = false;
    }

}
