const mongoose = require('mongoose');
const { Schema } = mongoose;
const Alquiler = require('./alquiler');
const PromocionSchema = new Schema({     
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, required: true },//url de una imagen para mostrar
    alquiler: {type: Schema.Types.ObjectId, ref: Alquiler, required: true},
    disponible: {type: Boolean, required: true}
})
module.exports = mongoose.models.Promocion || mongoose.model('Promocion', PromocionSchema)
