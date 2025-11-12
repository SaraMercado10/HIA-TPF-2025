const { VirtualType } = require('mongoose');
const Usuario = require('../models/usuario');
const usuarioCtrl = {};
//importamos el manejador de token
const jwt = require('jsonwebtoken');
usuarioCtrl.save = async (req, res) => {
    var usuario = new Usuario(req.body);
    try {
        await usuario.save();
        res.json({
            'status': '1',
            'msg': 'Usuario guardado.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando operacion.'
        })
    }
}

usuarioCtrl.getAll = async (req, res) => {
    var usuarios = await Usuario.find();
    res.json(usuarios);
}

usuarioCtrl.getById = async (req, res) => {
    try {
        const usuario = await Usuario.find({ _id: req.params.id });
        res.json(usuario);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operacion.'
        });
    }
}

usuarioCtrl.getByDni = async (req, res) => {
    try {
        const usuario = await Usuario.find({ dni: req.params.dni });
        res.json(usuario);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operacion.'
        });
    }
}

usuarioCtrl.findByFiltros = async (req, res) => {
    try{
        let filter = {};

        if(req.body.usuario)
            filter.usuario = {$regex : req.body.usuario, $options: 'i'};
        if(req.body.perfil)
            filter.perfil = req.body.perfil;
        if(req.body.soloActivos)
            filter.activo =  true;

        const resultado = await Usuario.find(filter);
        res.json(resultado);
    }catch(error){
        res.status(400).json({
            status : '0',
            msg : 'no se pudio'
        })
    }
}

usuarioCtrl.delete = async (req, res) => {
    try {
        await Usuario.deleteOne({ _id: req.params.id });
        res.json({
            status: '1',
            msg: 'Usuario removed'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': error.message
        })
    }
}

usuarioCtrl.edit = async (req, res) => {
    const vusuario = new Usuario(req.body);
    try {
        await Usuario.updateOne({ _id: req.body._id }, vusuario);
        res.json({
            'status': '1',
            'msg': 'Usuario updated'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}

usuarioCtrl.loginUsuario = async (req, res) => {
    //en req.body se espera que vengan las credenciales de login
    //defino los criterios de busqueda en base al username y password recibidos
    const criteria = {
        usuario: req.body.usuario,
        password: req.body.password
    }
    try {
        //el método findOne retorna un objeto que cumpla con los criterios de busqueda
        const user = await Usuario.findOne(criteria);
        if (!user) {
            res.json({
                status: 0,
                msg: "not found"
            })
        } else {
            const unToken = jwt.sign({id: user._id}, "secretkey");
            res.json({
                status: 1,
                msg: "success",
                usuario: user.usuario, //retorno información útil para el frontend
                perfil: user.perfil, //retorno información útil para el frontend
                userid: user._id, //retorno información útil para el frontend
                token: unToken,
                
            })
        }
    } catch (error) {
        res.json({
            status: 0,
            msg: 'error'
        })
    }
}


module.exports = usuarioCtrl;