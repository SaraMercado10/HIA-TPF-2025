const mongoose = require('mongoose');
const Alquiler = require('./alquiler');

const { Schema } = mongoose;

const NovedadSchema = new Schema({    
    alquiler: {type: Schema.Types.ObjectId, ref: Alquiler, required: true},
    descripcion: { type: String, required: true },
    estado: { type: String, required: true }
})

module.exports = mongoose.models.Novedad || mongoose.model('Novedad', NovedadSchema)