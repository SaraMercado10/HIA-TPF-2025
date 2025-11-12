const mongoose = require('mongoose');
const { Schema } = mongoose;
const CuotaSchema = new Schema({        
    monto: { type: Number, required: true },
    fechaCreacion: { type: Date, required: true },
    fechaVencimiento: { type: Date, required: true },
    recargoAplicado: { type: Boolean, required: true },
    fechaPago: { type: Date, required: false },
    medioPago: { type: String, required: true },
    cuponQr: { type: String, required: true },
    pagado: { type: Boolean, required: true },
    
})
module.exports = mongoose.models.Cuota || mongoose.model('Cuota', CuotaSchema)