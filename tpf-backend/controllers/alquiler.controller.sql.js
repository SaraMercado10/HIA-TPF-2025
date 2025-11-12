//const { Alquiler, Cuota, Usuario, Local } = require('../models_sql');
const Alquiler = require('../models_sql/Alquiler');
const Cuota = require('../models_sql/Cuota');
const Usuario = require('../models_sql/Usuario');
const Local = require('../models_sql/Local');
const QRCode = require('qrcode');
const alquilerCtrl = {};

// Función para generar un nuevo número de alquiler
alquilerCtrl.generarNumeroAlquiler = async (req, res) => {
    try {
        const lastAlquiler = await Alquiler.findOne({
            order: [['numeroAlquiler', 'DESC']]
        });

        if (!lastAlquiler) {
            return res.send('A001');
        }

        const lastNumber = parseInt(lastAlquiler.numeroAlquiler.substring(1));
        const newNumber = lastNumber + 1;
        const newRentalNumber = `A${newNumber.toString().padStart(3, '0')}`;

        return res.send(newRentalNumber);
    } catch (error) {
        return res.send({ message: 'Error al generar el número de alquiler' });
    }
};

// Dar de alta un Alquiler (POST)
alquilerCtrl.create = async (req, res) => {
    try {
        const alquiler = await Alquiler.create(req.body);
        res.json({
            'status': '1',
            'msg': 'Alquiler guardado.'
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.',
            error
        });
    }
};

// Eliminar un alquiler (DELETE)
alquilerCtrl.delete = async (req, res) => {
    try {
        await Alquiler.destroy({ where: { id: req.params.id } });
        res.json({
            status: '1',
            msg: 'Alquiler eliminado.'
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        });
    }
};

// Modificar un alquiler (PUT)
alquilerCtrl.edit = async (req, res) => {
    try {
        await Alquiler.update(req.body, { where: { id: req.body.id } });
        res.json({
            'status': '1',
            'msg': 'Alquiler Modificado.'
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion.'
        });
    }
};

// Recuperar TODOS los alquileres (GET)
alquilerCtrl.getAll = async (req, res) => {
    try {
        const alquileres = await Alquiler.findAll({
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Local, as: 'local' },
                { model: Cuota, as: 'cuotas' }
            ]
        });
        res.json(alquileres);
    } catch (error) {
        res.status(400).json({ message: 'Error obteniendo los alquileres', error });
    }
};

// Obtener UN alquiler (GET)
alquilerCtrl.getById = async (req, res) => {
    try {
        const alquilerBase = await Alquiler.findByPk(req.params.id); // Obtiene solo el alquiler
        if (!alquilerBase) {
            return res.status(404).json({ message: 'Alquiler no encontrado' });
        }

        // Consulta las relaciones después de validar la existencia
        const alquiler = await Alquiler.findOne({
            where: { id: req.params.id },
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Local, as: 'local' },
                { model: Cuota, as: 'cuotas' }
            ]
        });

        res.json(alquiler);
    } catch (error) {
        res.status(400).json({ message: 'Error obteniendo el alquiler', error });
    }
};

// Obtener alquiler por número de alquiler
alquilerCtrl.getByNumero = async (req, res) => {
    try {
        const { numeroAlquiler } = req.params;
        const alquiler = await Alquiler.findOne({
            where: { numeroAlquiler },
            include: [
               // { model: Usuario, as: 'usuario' },
                { model: Local, as: 'local' },
                { model: Cuota, as: 'cuotas' }
            ]
        });
        res.json(alquiler);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el alquiler', error });
    }
};

// Obtener alquileres por rango de fecha
alquilerCtrl.getByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const alquileres = await Alquiler.findAll({
            where: {
                fechaAlquiler: {
                    [Sequelize.Op.gte]: new Date(startDate),
                    [Sequelize.Op.lte]: new Date(endDate)
                }
            },
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Local, as: 'local' }
            ]
        });
        res.json(alquileres);
    } catch (error) {
        res.status(400).json({ error: 'Error procesando la operacion' });
    }
};

// Obtener alquileres por propietario
alquilerCtrl.getByPropietario = async (req, res) => {
    const { usuarioId } = req.query;
    try {
        const alquileres = await Alquiler.findAll({
            where: { usuarioId: usuarioId },
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Local, as: 'local' }
            ]
        });
        res.json(alquileres);
    } catch (error) {
        console.error('Error al obtener los alquileres:', error);
        res.status(500).json({ error: 'Error procesando la operación.' });
    }
};

// Añadir una cuota a un alquiler
alquilerCtrl.addCuota = async (req, res) => {
    try {
        const cuota = await Cuota.create(req.body);
        cuota.fechaVencimiento.setDate(cuota.fechaVencimiento.getDate() + 10);

        const alquiler = await Alquiler.findByPk(req.params.id);
        await alquiler.addCuota(cuota);

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
};

// Eliminar una cuota de un alquiler
alquilerCtrl.deleteCuota = async (req, res) => {
    try {
        const alquiler = await Alquiler.findByPk(req.params.id);
        const cuota = await Cuota.findByPk(req.params.idCuota);
        await alquiler.removeCuota(cuota);

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
};

// Editar una cuota de un alquiler
alquilerCtrl.updateCuota = async (req, res) => {
    try {
        const cuota = await Cuota.findByPk(req.params.idCuota);
        await cuota.update(req.body);

        if (cuota.pagado && cuota.medioPago === 'Mercado Pago') {
            cuota.cuponQr = await QRCode.toDataURL(cuota.cuponQr);
        }

        res.json({
            'status': '1',
            'msg': 'Cuota Modificada'
        });
    } catch (err) {
        res.status(400).json({
            status: '0',
            msg: 'Error realizando la operación',
            error: err.message
        });
    }
};

// Generar cuotas para todos los alquileres
alquilerCtrl.generarCuotas = async (req, res) => {
    try {
        let today = new Date();
        const alquileres = await Alquiler.findAll({
            include: [{ model: Local, as: 'local' }]
        });

        for (const alquiler of alquileres) {
            let ultimaCuota = alquiler.cuotas.length - 1;
            if (alquiler.cuotas.length < alquiler.cantidadMesAlquiler) {
                let dateCuota = new Date(alquiler.cuotas[ultimaCuota].fechaCreacion);
                let diferenciaDias = (today - dateCuota) / (1000 * 3600 * 24);
                if (diferenciaDias >= 30) {
                    console.log("Se generó una cuota para el alquiler: ", alquiler.numeroAlquiler);
                    await agregarCuota(alquiler);
                }
            } else {
                console.log("El Alquiler", alquiler.numeroAlquiler, "ya tiene la cantidad de cuotas totales, debe renovarse");
            }
        }

        res.status(200).json({ message: 'Cuotas verificadas exitosamente' });
    } catch (error) {
        console.error('Error al verificar cuotas:', error);
        res.status(500).json({ error: 'Error al verificar cuotas' });
    }
};

// Agregar cuota generada
async function agregarCuota(alquiler) {
    try {
        const cuota = await Cuota.create({
            monto: alquiler.local.costoMes,
            fechaCreacion: new Date(),
            fechaVencimiento: new Date(),
            recargoAplicado: false,
            fechaPago: null,
            medioPago: ' ',
            cuponQr: ' ',
            pagado: false
        });

        alquiler.addCuota(cuota);
        console.log("Cuota agregada exitosamente para alquiler con numeroAlquiler", alquiler.numeroAlquiler);
    } catch (error) {
        console.error('Error al agregar cuota:', error);
        throw error;
    }
}

// Comprobar vencimiento de cuotas
alquilerCtrl.verificarCuotasVencidas = async (req, res) => {
    try {
        const alquileres = await Alquiler.findAll({
            include: [{ model: Local, as: 'local' }]
        });
        let today = new Date();

        for (const alquiler of alquileres) {
            for (let cuota of alquiler.cuotas) {
                let fechaVencimiento = new Date(cuota.fechaVencimiento);
                if (today > fechaVencimiento && !cuota.recargoAplicado && !cuota.pagado) {
                    cuota.monto += cuota.monto * 0.10;
                    cuota.recargoAplicado = true;
                    await cuota.save();
                }
            }
        }
        res.status(200).json({ message: 'Cuotas verificadas y actualizadas exitosamente' });
    } catch (error) {
        console.error('Error al verificar y actualizar cuotas:', error);
        res.status(500).json({ error: 'Error al verificar y actualizar cuotas' });
    }
};

module.exports = alquilerCtrl;