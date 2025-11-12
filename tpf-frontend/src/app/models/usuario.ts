export class Usuario {
    id!:string;
    email : String;
    usuario : String;
    password : String;
    activo : Boolean;
    perfil : String;
    nombres : String;
    apellido : String;
    dni : String;
    telefono : String ;

    constructor(){
        this.email = "";
        this.usuario = "";
        this.password = "";
        this.activo = true;
        this.perfil = "";
        this.nombres = "";
        this.apellido = "";
        this.dni = "";
        this.telefono = "";
    }

    // Getter y Setter
    getPerfil(): String {
        return this.perfil;
    }
    setPerfil(nuevoPerfil: String) {
        if (nuevoPerfil.length > 0) {
           this.perfil = nuevoPerfil;
        } else {
            throw new Error("El nombre no puede estar vacío");
        }
    }    
}
