const Promocion = require('../models_sql/Promocion'); // Importa el modelo Promocion
const Alquiler = require('../models_sql/Alquiler'); // Importa el modelo Alquiler
const { Op } = require('sequelize'); // Operadores para consultas avanzadas

const promocionCtrl = {}

/**
 * Da de alta una promoción
 */
promocionCtrl.save = async (req, res) => {
    try {
        const promocion = await Promocion.create(req.body); // Crear la promoción en la base de datos
        res.json({
            status: '1',
            msg: 'Promoción creada.',
            promocion
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación.',
            error: error.message
        });
    }
};

/**
 * Obtiene todas las promociones
 */
promocionCtrl.getAll = async (req, res) => {
    try {
        const promociones = await Promocion.findAll({
            include: [{
                model: Alquiler,
                as: 'alquiler' // Aquí agregamos el alias 'alquiler'
            }]
        });
        res.json(promociones);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación.',
            error: error.message
        });
    }
};

/**
 * Obtiene promoción por ID
 */
promocionCtrl.getById = async (req, res) => {
    try {
        const promocion = await Promocion.findByPk(req.params.id, {
            include: [{
                model: Alquiler
            }]
        });

        if (!promocion) {
            return res.status(404).json({
                status: '0',
                msg: 'Promoción no encontrada.'
            });
        }

        res.json(promocion);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación.',
            error: error.message
        });
    }
};

/**
 * Obtiene promoción por el ID de un alquiler
 */
promocionCtrl.getByAlquiler = async (req, res) => {
    try {
        const alquilerId = req.params.id;
        const promociones = await Promocion.findAll({
            where: { alquilerId }, // Filtra por alquilerId
            include: [{
                model: Alquiler
            }]
        });

        res.json(promociones);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación.',
            error: error.message
        });
    }
};

/**
 * Modifica una promoción
 */
promocionCtrl.edit = async (req, res) => {
    try {
        const promocion = await Promocion.findByPk(req.body.id); // Busca la promoción por ID

        if (!promocion) {
            return res.status(404).json({
                status: '0',
                msg: 'Promoción no encontrada.'
            });
        }

        await promocion.update(req.body); // Actualiza los datos de la promoción
        res.json({
            status: '1',
            msg: 'Promoción actualizada.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación.',
            error: error.message
        });
    }
};

/**
 * Elimina una promoción
 */
promocionCtrl.delete = async (req, res) => {
    try {
        const promocion = await Promocion.findByPk(req.params.id);

        if (!promocion) {
            return res.status(404).json({
                status: '0',
                msg: 'Promoción no encontrada.'
            });
        }

        await promocion.destroy(); // Elimina la promoción
        res.json({
            status: '1',
            msg: 'Promoción eliminada.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación.',
            error: error.message
        });
    }
};

module.exports = promocionCtrl;
