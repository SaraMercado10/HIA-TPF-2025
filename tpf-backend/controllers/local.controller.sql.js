const Local = require('../models_sql/Local'); // Importa el modelo Local
const { Op } = require('sequelize'); // Para realizar consultas complejas
const localCtrl = {}

/**
 * Obtiene todos los locales
 */
localCtrl.getLocales = async (req, res) => {
    try {
        const locales = await Local.findAll(); // Encuentra todos los locales
        res.json(locales);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error obteniendo los locales.',
            error: error.message
        });
    }
};

/**
 * Genera un número de local
 */
localCtrl.generarNumeroLocal = async (req, res) => {
    try {
        const lastLocal = await Local.findOne({
            order: [['numero', 'DESC']] // Ordenamos por número en orden descendente
        });

        if (!lastLocal) {
            return res.send('L001');
        }

        const lastNumber = parseInt(lastLocal.numero.substring(1)); // Obtiene el número sin la letra L
        const newNumber = lastNumber + 1;
        const newLocalNumber = `L${newNumber.toString().padStart(3, '0')}`; // Formateamos el número con ceros a la izquierda

        return res.send(newLocalNumber);
    } catch (error) {
        return res.status(400).json({ message: 'Error al generar el número de local' });
    }
};

/**
 * Da de alta un local
 */
localCtrl.createLocal = async (req, res) => {
    try {
        const local = await Local.create(req.body); // Usamos el método create de Sequelize
        res.json({
            status: '1',
            msg: 'Local creado.',
            local: local // Puedes devolver el objeto creado si lo necesitas
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error al crear el local.',
            error: error.message
        });
    }
};

/**
 * Obtiene un local por ID
 */
localCtrl.getLocal = async (req, res) => {
    try {
        const local = await Local.findByPk(req.params.id); // Busca un local por su ID
        if (!local) {
            return res.status(404).json({
                status: '0',
                msg: 'Local no encontrado.'
            });
        }
        res.json(local);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error obteniendo el local.',
            error: error.message
        });
    }
};

/**
 * Buscar locales por filtros
 */
localCtrl.findByFiltros = async (req, res) => {
    try {
        let filter = {};

        if (req.body.nombre) {
            filter.nombre = { [Op.iLike]: `%${req.body.nombre}%` }; // Uso de Op.iLike para búsqueda insensible a mayúsculas/minúsculas
        }

        const resultado = await Local.findAll({
            where: filter
        });
        res.json(resultado);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'No se pudo realizar la búsqueda',
            error: error.message
        });
    }
};

/**
 * Modifica un local
 */
localCtrl.editLocal = async (req, res) => {
    try {
        const local = await Local.findByPk(req.body.id); // Busca el local por ID
        if (!local) {
            return res.status(404).json({
                status: '0',
                msg: 'Local no encontrado.'
            });
        }

        await local.update(req.body); // Actualiza el local con los datos recibidos
        res.json({
            status: '1',
            msg: 'Local modificado.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error al modificar el local.',
            error: error.message
        });
    }
};

/**
 * Elimina un local
 */
localCtrl.deleteLocal = async (req, res) => {
    try {
        const local = await Local.findByPk(req.params.id);
        if (!local) {
            return res.status(404).json({
                status: '0',
                msg: 'Local no encontrado.'
            });
        }

        await local.destroy(); // Esto ejecuta el `beforeDestroy` automáticamente
        res.json({
            status: '1',
            msg: 'Local eliminado.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error al eliminar el local.',
            error: error.message
        });
    }
};

/**
 * Obtiene un local por nombre
 */
localCtrl.getLocalByNombreLocal = async (req, res) => {
    try {
        const local = await Local.findAll({
            where: {
                nombre: { [Op.iLike]: `%${req.params.nombreLocal}%` } // Búsqueda insensible a mayúsculas/minúsculas
            }
        });
        res.json(local);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error al obtener el local.',
            error: error.message
        });
    }
};

/**
 * Obtiene locales por rubro
 */
localCtrl.getLocalesByRubro = async (req, res) => {
    try {
        const { rubro } = req.query;
        const locales = await Local.findAll({
            where: {
                rubro: rubro
            }
        });
        res.json(locales);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error al obtener los locales.',
            error: error.message
        });
    }
};

module.exports = localCtrl;
