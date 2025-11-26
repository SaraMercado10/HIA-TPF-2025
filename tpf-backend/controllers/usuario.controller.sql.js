const jwt = require('jsonwebtoken');
const Usuario = require('../models_sql/Usuario'); // Asegúrate de importar el modelo correctamente
const Sequelize = require('sequelize'); // ✅ CORRECCIÓN: Importar la librería Sequelize para acceder a 'Op'
const usuarioCtrl = {};

usuarioCtrl.save = async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body);
        res.json({
            status: '1',
            msg: 'Usuario guardado.',
            usuario: usuario // Retorna el objeto creado si es necesario
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando operación.',
            error: error.message
        });
    }
};

usuarioCtrl.getAll = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error obteniendo usuarios.',
            error: error.message
        });
    }
};

usuarioCtrl.getById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id); // findByPk es el equivalente a findOne por id
        if (!usuario) {
            return res.status(404).json({
                status: '0',
                msg: 'Usuario no encontrado.'
            });
        }
        res.json(usuario);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

usuarioCtrl.getByDni = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ where: { dni: req.params.dni } });
        if (!usuario) {
            return res.status(404).json({
                status: '0',
                msg: 'Usuario no encontrado.'
            });
        }
        res.json(usuario);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

usuarioCtrl.findByFiltros = async (req, res) => {
    try {
        const filter = {};

        // ESTA LÍNEA AHORA FUNCIONARÁ GRACIAS A LA IMPORTACIÓN DE Sequelize
        if (req.body.usuario) filter.usuario = { [Sequelize.Op.iLike]: `%${req.body.usuario}%` }; // Buscar sin importar mayúsculas/minúsculas
        if (req.body.perfil) filter.perfil = req.body.perfil;
        if (req.body.soloActivos) filter.activo = true;

        const usuarios = await Usuario.findAll({ where: filter });
        res.json(usuarios);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando los filtros.',
            error: error.message
        });
    }
};

usuarioCtrl.delete = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({
                status: '0',
                msg: 'Usuario no encontrado.'
            });
        }
        await usuario.destroy(); // Eliminar usuario
        res.json({
            status: '1',
            msg: 'Usuario eliminado.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

usuarioCtrl.edit = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.body.id);
        if (!usuario) {
            return res.status(404).json({
                status: '0',
                msg: 'Usuario no encontrado.'
            });
        }

        // Aquí puedes actualizar los campos según el request
        await usuario.update(req.body);
        res.json({
            status: '1',
            msg: 'Usuario actualizado.'
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación.',
            error: error.message
        });
    }
};

usuarioCtrl.loginUsuario = async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const user = await Usuario.findOne({ where: { usuario, password } });

        // Es importante notar que si la base de datos no tiene el usuario o la contraseña es incorrecta,
        // este controlador devuelve 404, aunque lo correcto en seguridad sería 401 (Unauthorized).
        if (!user) {
            return res.status(404).json({
                status: '0',
                msg: 'Usuario no encontrado o credenciales incorrectas.'
            });
        }

        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });

        res.json({
            status: '1',
            msg: 'Login exitoso.',
            usuario: user.usuario,
            perfil: user.perfil,
            userid: user.id,
            token
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando el login.',
            error: error.message
        });
    }
};

module.exports = usuarioCtrl;