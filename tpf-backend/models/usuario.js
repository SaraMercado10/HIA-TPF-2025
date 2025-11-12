const mongoose = require('mongoose');
const { Schema } = mongoose;
const UsuarioSchema = new Schema({        
    email : {type : String, required : true},
    usuario : {type : String, required : true},
    password : {type : String, required : true},
    activo : {type : Boolean, required : true},
    perfil : {type : String, required : true},
    nombres : {type : String, required : true},
    apellido : {type : String, required : true},
    dni : {type : String, required : true},
    telefono : {type : String , required : true}
})

UsuarioSchema.pre('deleteOne', async function (next) {
    const alquiler = require('./alquiler');
    const idUsuario = this.getFilter('id', ['_id']);

    const alquileres = await alquiler.find({ usuario: idUsuario });

    if (alquileres.length > 0) {
        next(new Error('No se puede eliminar el usuario debido a que hay alquileres asociados'));
    } else {
        next();
    }
})
module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema)