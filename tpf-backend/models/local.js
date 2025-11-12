const mongoose = require('mongoose');
const { Schema } = mongoose;
const LocalSchema = new Schema({
    numero: {type: String, required: true, unique: true},
    nombre: {type: String, required: true},
    superficie: {type: String, required: true},
    habilitado: {type: Boolean, required: true},
    costoMes: {type: Number, required: true},
    logo: {type: String, required: true},
    imagen: {type: String, required: true},
    alquilado: {type: Boolean, required: true},
    rubro: {type: String, required: true}
})

LocalSchema.pre('deleteOne', async function(next){
    const alquiler = require('./alquiler');
    const idLocal = this.getFilter('id',['_id']);
    
    const alquileres = await alquiler.find({local: idLocal});

    if(alquileres.length > 0){
        next(new Error('No se puede eliminar el local debido a que hay alquileres asociados')); 
    } else{
        next();
    }
})
module.exports = mongoose.models.Local || mongoose.model('Local', LocalSchema);