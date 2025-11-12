//defino controlador para el manejo de CRUD
const usuarioCtrl = require('../controllers/usuario.controller.sql');
const autCtrl = require('./../controllers/auth.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();
//definimos las rutas para la gestion de usuarios

//Ruta para guardar un Usuario
router.post('/',  usuarioCtrl.save);

//Ruta para obtener todos los Usuarios
router.get('/',  usuarioCtrl.getAll);

//Ruta para obtener un Usuario por filtro
router.post('/filtro',  usuarioCtrl.findByFiltros);

//Ruta para obtener un Usuario por ID
router.get('/:id',  usuarioCtrl.getById);

//Ruta para obtener un Usuario por DNI
router.get('/dni/:dni',  usuarioCtrl.getByDni);

//Ruta para editar un Usuario por ID
router.put('/:id',  usuarioCtrl.edit);

//Ruta para eliminar un Usuario por ID
router.delete('/:id',  usuarioCtrl.delete);

//Ruta para iniciar sesion de un Usuario
router.post('/login', usuarioCtrl.loginUsuario);
//exportamos el modulo de rutas
module.exports = router;