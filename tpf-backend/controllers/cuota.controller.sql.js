const Cuota = require('../models_sql/Cuota'); // Asegúrate de importar correctamente el modelo Cuota
const { Op } = require('sequelize'); // Importamos operadores para hacer consultas complejas
const cuotaCtrl = {};

cuotaCtrl.createCuota = async (req, res) => {
    try {
        const cuota = await Cuota.create(req.body); // Usamos create para insertar un nuevo registro
        res.json({
            status: '1',
            msg: 'Cuota guardada.',
            cuota: cuota // Puedes devolver el objeto creado si lo necesitas
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

cuotaCtrl.getCuotas = async (req, res) => {
    try {
        const cuotas = await Cuota.findAll(); // Encuentra todas las cuotas
        res.json(cuotas);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error obteniendo las cuotas.',
            error: error.message
        });
    }
};

cuotaCtrl.getCuotaById = async (req, res) => {
    try {
        const cuota = await Cuota.findByPk(req.params.id); // Busca la cuota por su ID
        if (!cuota) {
            return res.status(404).json({
                status: '0',
                msg: 'Cuota no encontrada.'
            });
        }
        res.json(cuota);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

cuotaCtrl.deleteCuota = async (req, res) => {
    try {
        const cuota = await Cuota.findByPk(req.params.id);
        if (!cuota) {
            return res.status(404).json({
                status: '0',
                msg: 'Cuota no encontrada.'
            });
        }
        await cuota.destroy(); // Elimina la cuota
        res.json({
            status: '1',
            msg: 'Cuota eliminada.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

cuotaCtrl.editCuota = async (req, res) => {
    try {
        const cuota = await Cuota.findByPk(req.body.id);
        if (!cuota) {
            return res.status(404).json({
                status: '0',
                msg: 'Cuota no encontrada.'
            });
        }
        await cuota.update(req.body); // Actualiza la cuota con los datos recibidos
        res.json({
            status: '1',
            msg: 'Cuota actualizada.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

cuotaCtrl.getCuotasByDateRange = async (req, res) => {
    const { startDate, endDate } = req.body; // Se asume que las fechas vienen en el cuerpo de la solicitud
    try {
        const cuotas = await Cuota.findAll({
            where: {
                fechaPago: {
                    [Op.gte]: new Date(startDate), // Filtra por fechas mayores o iguales a startDate
                    [Op.lte]: new Date(endDate)    // Filtra por fechas menores o iguales a endDate
                }
            }
        });
        res.json(cuotas);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

module.exports = cuotaCtrl;
