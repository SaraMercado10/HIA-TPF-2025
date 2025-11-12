const Novedad = require('../models_sql/Novedad'); // Importa el modelo Novedad
const Alquiler = require('../models_sql/Alquiler'); // Importa el modelo Alquiler
const { Op } = require('sequelize'); // Para realizar consultas complejas
const Usuario = require('../models_sql/Usuario'); // Ajusta la ruta si es necesario
const Local = require('../models_sql/Local'); // Importa el modelo Local
const novedadCtrl = {}

/**Guarda una novedad*/
novedadCtrl.save = async (req, res) => {
    try {
        const { alquilerId, descripcion, estado } = req.body;

        if (!alquilerId) {
            return res.status(400).json({
                status: '0',
                msg: 'El alquilerId es necesario para crear la novedad.'
            });
        }

        const novedad = await Novedad.create({
            alquilerId,
            descripcion,
            estado
        });

        // Buscamos el alquiler relacionado y lo incluimos en la respuesta
        const novedadConAlquiler = await Novedad.findOne({
            where: { id: novedad.id },
            include: {
                model: Alquiler,
                as: 'alquiler'
            }
        });

        res.json({
            status: '1',
            msg: 'Novedad guardada',
            novedad: novedadConAlquiler
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación',
            error: error.message
        });
    }
};

/**Obtiene todas las novedades*/
novedadCtrl.getAll = async (req, res) => {
    try {
        const novedades = await Novedad.findAll({
            include: [{
                model: Alquiler, // Incluye la relación con Alquiler
                as: 'alquiler',
                include: [
                    { model: Usuario, as:'usuario'  },  // Incluye el usuario relacionado con el alquiler
                    { model: Local, as: 'local'}     // Incluye el local relacionado con el alquiler
                ]
            }]
        });
        res.json(novedades);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación',
            error: error.message
        });
    }
};

/**Obtiene una novedad por id*/
novedadCtrl.getById = async (req, res) => {
    try {
        const novedad = await Novedad.findByPk(req.params.id, {
            include: [{
                model: Alquiler,
                include: [
                    { model: Usuario },
                    { model: Local }
                ]
            }]
        });
        if (!novedad) {
            return res.status(404).json({
                status: '0',
                msg: 'Novedad no encontrada'
            });
        }
        res.json(novedad);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación',
            error: error.message
        });
    }
};

/**Busca novedades por descripcion estado*/
novedadCtrl.search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: '0',
                msg: 'Debe proporcionar un término de búsqueda'
            });
        }

        const regex = new RegExp(query, 'i'); // Expresión regular para búsqueda insensible a mayúsculas

        const novedades = await Novedad.findAll({
            where: {
                [Op.or]: [
                    { descripcion: { [Op.iLike]: `%${query}%` } },
                    { estado: { [Op.iLike]: `%${query}%` } }
                ]
            },
            include: [{
                model: Alquiler,
                include: [
                    { model: Usuario, where: { nombre: { [Op.iLike]: `%${query}%` } }, required: false },
                    { model: Local, where: { nombre: { [Op.iLike]: `%${query}%` } }, required: false }
                ]
            }]
        });

        res.json(novedades);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación',
            error: error.message
        });
    }
};

/**Obtiene novedades según el id de un alquiler */
novedadCtrl.getByAlquiler = async (req, res) => {
    try {
        const alquilerId = req.params.id;
        const novedades = await Novedad.findAll({
            where: { alquilerId },
            include: [{
                model: Alquiler
            }]
        });
        res.json(novedades);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación',
            error: error.message
        });
    }
};

/**Obtiene novedades según el id de un usuario */
novedadCtrl.getByUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        // Validar que el usuarioId esté presente
        if (!usuarioId) {
            return res.status(400).json({
                status: '0',
                msg: 'El usuarioId es requerido.'
            });
        }

        // Consultar novedades asociadas al usuario
        const novedades = await Novedad.findAll({
            include: [
                {
                    model: Alquiler,
                    as: 'alquiler',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            where: { id: usuarioId },
                            attributes: ['nombres', 'apellido'], // Atributos específicos
                        },
                    ],
                },
            ],
        });

        // Manejar caso de no encontrar resultados
        if (novedades.length === 0) {
            return res.status(404).json({
                status: '0',
                msg: 'No se encontraron novedades para este usuario.'
            });
        }

        res.json(novedades);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación',
            error: error.message,
        });
    }
};
/**Elimina una novedad por id*/
novedadCtrl.delete = async (req, res) => {
    try {
        const novedad = await Novedad.findByPk(req.params.id);
        if (!novedad) {
            return res.status(404).json({
                status: '0',
                msg: 'Novedad no encontrada'
            });
        }
        await novedad.destroy();
        res.json({
            status: '1',
            msg: 'Novedad eliminada'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación',
            error: error.message
        });
    }
};

/**Actualiza una novedad por id*/
novedadCtrl.edit = async (req, res) => {
    try {
        const novedad = await Novedad.findByPk(req.body.id);
        if (!novedad) {
            return res.status(404).json({
                status: '0',
                msg: 'Novedad no encontrada'
            });
        }

        await novedad.update(req.body);
        res.json({
            status: '1',
            msg: 'Novedad actualizada'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación',
            error: error.message
        });
    }
};

module.exports = novedadCtrl;
