const mongoose = require('mongoose');
const { Schema } = mongoose;
const Cuota = require ('./cuota')
const Usuario = require ('./usuario')
const Local = require ('./local');
const AlquilerSchema = new Schema({
    numeroAlquiler: { type: String, unique: true, required: true },
    cantidadMesAlquiler: { type: Number, required: true },
    plazoMes: { type: Number, required: true },
    costoAlquiler: { type: Number, required: true },
    fechaAlquiler: { type: Date, required: true },
    cuota: [{ type: Cuota.schema, required: true }],
    usuario: { type: Schema.Types.ObjectId, ref: Usuario, required: true }, 
    local: { type: Schema.Types.ObjectId, ref: Local, required: true }
})

module.exports = mongoose.models.Alquiler || mongoose.model('Alquiler', AlquilerSchema);