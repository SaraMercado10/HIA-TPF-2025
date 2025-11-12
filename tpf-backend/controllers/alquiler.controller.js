const Alquiler = require('../models/alquiler');
const mongoose = require('mongoose');
const Cuota = require('../models/cuota');
const QRCode = require('qrcode');
const alquilerCtrl = {}


// Función para generar un nuevo número de alquiler
alquilerCtrl.generarNumeroAlquiler = async (req, res) => {
    try {
        // Buscar el alquiler con el número más alto
        const lastAlquiler = await Alquiler.findOne().sort({ numeroAlquiler: -1 }).exec();

        if (!lastAlquiler) {
            return res.send('A001');
        }

        // Extraer el número de la última entrada y convertirlo a un número
        const lastNumber = parseInt(lastAlquiler.numeroAlquiler.substring(1));

        // Incrementar el número
        const newNumber = lastNumber + 1;

        // Formatear el número con ceros a la izquierda
        const newRentalNumber = `A${newNumber.toString().padStart(3, '0')}`;

        // Enviar el número de alquiler formateado como respuesta
        return res.send(newRentalNumber);
    } catch (error) {
        return res.send({ message: 'Error al generar el número de alquiler' });
    }
};

//Dar de alta un Alquiler (POST)
alquilerCtrl.create = async (req, res) => {
    var alquiler = new Alquiler(req.body);
    try {
        await alquiler.save();
        res.json({
            'status': '1',
            'msg': 'Alquiler guardado.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.',
            error
        });
    }
}

//Eliminar un alquiler (DELETE)
alquilerCtrl.delete = async (req, res) => {
    try {
        await Alquiler.deleteOne({ _id: req.params.id });
        res.json({
            status: '1',
            msg: 'Alquiler eliminado.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}

//Modificar un alquiler (PUT)
alquilerCtrl.edit = async (req, res) => {
    const alquiler = new Alquiler(req.body);
    try {
        await Alquiler.updateOne({ _id: req.body._id }, alquiler);
        res.json({
            'status': '1',
            'msg': 'Alquiler Modificado.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.'
        })
    }
}

//Recuperar TODOS los alquileres (GET)
alquilerCtrl.getAll = async (req, res) => {
    var alquileres = await Alquiler.find().populate('usuario local cuota');
    res.json(alquileres);
}

//Obtener UN alquiler (GET)

alquilerCtrl.getById = async (req, res) => {
    var alquiler = await Alquiler.findById(req.params.id).populate('local cuota');
    res.json(alquiler);
}

//FILTROS

//Obtener alquiler por número de alquiler
alquilerCtrl.getByNumero = async (req, res) => {
    try {
        const { numeroAlquiler } = req.params;
        const alquiler = await Alquiler.findOne({ numeroAlquiler }).populate('usuario').populate('local').populate('cuota');
        res.json(alquiler);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener el alquiler', 
            error 
        });
    }
};

//Obtener alquileres por rango de fecha
alquilerCtrl.getByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const alquileres = await Alquiler.find({
            fechaAlquiler: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('usuario local');

        res.json(alquileres);
    } catch (error) {
        res.status(400).json({ 
            error: 'Error procesando la operacion' });
    }
}

//Obtener alquileres por propietario
alquilerCtrl.getByPropietario = async (req, res) => {
    const { usuarioId } = req.query;
    try {
        const alquileres = await Alquiler.find({ usuario: new mongoose.Types.ObjectId(usuarioId) }).populate('usuario local');
        res.json(alquileres);
    } catch (error) {
        console.error('Error al obtener los alquileres:', error);
        res.status(500).json({ error: 'Error procesando la operación.' });
    }
};

//CUOTA

// Añadir una cuota a un alquiler
alquilerCtrl.addCuota = async (req, res) => {
    try {
        const cuota = new Cuota(req.body);
        cuota.fechaVencimiento.setDate( cuota.fechaVencimiento.getDate() + 10);
        const alquiler = await Alquiler.findById(req.params.id);
        await cuota.save();
        alquiler.cuota.push(cuota);
        await alquiler.save();
        res.json({
            status: '1',
            msg: 'Cuota añadida al alquiler.'
        });
    } catch (err) {
        res.status(400).json({
            status: '0',
            msg: 'Error realizando la operación',
            error: err.message
        });
    }
}

//Eliminar una cuota de un alquiler 
alquilerCtrl.deleteCuota = async (req, res) => {
    try {
        const alquiler = await Alquiler.findById(req.params.id);
        alquiler.cuota.pull(req.params.idCuota);
        await alquiler.save();

        res.json({
            status: '1',
            msg: 'Cuota eliminada del alquiler.'
        });
    } catch (err) {
        res.status(400).json({
            status: '0',
            msg: 'Error realizando la operación',
            error: err.message 
        });
    }

}

//Editar una cuota de un alquiler 
alquilerCtrl.updateCuota = async (req, res) => {
    try {
        const alquilerId = req.params.id;
        const cuotaId = req.params.idCuota;
        const alquiler = await Alquiler.findById(alquilerId);
        const cuota = alquiler.cuota.id(cuotaId);
        Object.assign(cuota, req.body);
        if(cuota.pagado == true && cuota.medioPago == "Mercado Pago")
            cuota.cuponQr = await QRCode.toDataURL(cuota.cuponQr);
        await alquiler.save();
        const updatedCuota = await Cuota.findByIdAndUpdate(cuotaId, req.body);
        res.json({
            'status': '1',
            'msg': 'Cuota Modificada'
        })
    } catch (err) {
        res.status(400).json({
            status: '0',
            msg: 'Error realizando la operación',
            error: err.message
        });
    }
}



//CONTROLAR CUOTAS DE CADA MES

//Generar cuotas para todos los alquileres
alquilerCtrl.generarCuotas = async (req, res) => {
    try {
        let today = new Date();
        const alquileres = await Alquiler.find().populate('local');
        for (const alquiler of alquileres) {
            try {
                let ultimaCuota = alquiler.cuota.length - 1;
                if (alquiler.cuota.length < alquiler.cantidadMesAlquiler){
                    let dateCuota = new Date(alquiler.cuota[ultimaCuota].fechaCreacion);
                    let diferenciaTiempo = today - dateCuota;
                    let diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
                    if (diferenciaDias >= 30) {
                        console.log("Se genero una cuota para el alquiler: ", alquiler.numeroAlquiler)
                        await agregarCuota(alquiler);
                    }
                }else{
                    console.log("El Alquiler ",alquiler.numeroAlquiler," ya tiene la cantidad de cuotas totales, debe renovarse")
                }
            } catch (error) {
                console.error(`Error al agregar cuota: ${error.message}`);
            }
        }
        res.status(200).json({ message: 'Cuotas verificadas exitosamente' });
    } catch (error) {
        console.error('Error al verificar cuotas:', error);
        res.status(500).json({ error: 'Error al verificar cuotas' });
    }
}

// Agregar cuota generada
async function agregarCuota(alquiler) {
    try {
        const valquiler = alquiler;

        const fechaCreacion = new Date();
        const fechaVencimiento = new Date(fechaCreacion);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 10);

        const cuota = new Cuota({
            monto: valquiler.local.costoMes,
            fechaCreacion: fechaCreacion,
            fechaVencimiento: fechaVencimiento,
            recargoAplicado: false,
            fechaPago: null,
            medioPago: ' ',
            cuponQr: ' ',
            pagado: false,
        });

        await cuota.save();
        valquiler.cuota.push(cuota);
        await valquiler.save();
        console.log("Cuota agregada exitosamente para alquiler con numeroAlquiler", valquiler.numeroAlquiler);
    } catch (error) {
        console.error('Error al agregar cuota:', error);
        throw error;
    }

}

//Comprobar vencimiento de cuotas
alquilerCtrl.verificarCuotasVencidas = async (req, res) => {
    try {
        const alquileres = await Alquiler.find().populate('local');
        let today = new Date();

        for (const alquiler of alquileres) {
            try {
                for (let cuota of alquiler.cuota) {
                    let fechaVencimiento = new Date(cuota.fechaVencimiento);

                    // Verificar si la cuota está vencida
                    if (today > fechaVencimiento && !cuota.recargoAplicado && !cuota.pagado) {
                        cuota.monto += cuota.monto * 0.10;
                        cuota.recargoAplicado = true; 
                        await alquiler.save();
                        await Cuota.updateOne({ _id: cuota._id }, cuota);
                    }
                }
            } catch (error) {
                console.error(`Error al actualizar cuota: ${error.message}`);
            }
        }
        res.status(200).json({ message: 'Cuotas verificadas y actualizadas exitosamente' });
    } catch (error) {
        console.error('Error al verificar y actualizar cuotas:', error);
        res.status(500).json({ error: 'Error al verificar y actualizar cuotas' });
    }
};




module.exports = alquilerCtrl;
