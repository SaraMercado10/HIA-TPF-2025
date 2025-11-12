//controladores para el manejo de CRUD
const novedadCtrl = require('../controllers/novedad.controller.sql');
const autCtrl = require('./../controllers/auth.controller');

//manejador de rutas
const express = require('express');
const router = express.Router();

//definimos las rutas para la gestion de novedad
router.post('/', novedadCtrl.save);
router.get('/',  novedadCtrl.getAll);
router.get('/busqueda', novedadCtrl.search);
router.get('/usuario/:id', novedadCtrl.getByUsuario);
router.get('/alquiler/:id', novedadCtrl.getByAlquiler);
router.get('/:id',novedadCtrl.getById);
router.delete('/:id', novedadCtrl.delete);
router.put('/:id', novedadCtrl.edit);

//exportamos el modulo de rutas
module.exports = router;