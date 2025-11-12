//defino controlador para el manejo de CRUD
const promocionCtrl = require('../controllers/promocion.controller.sql');
const autCtrl = require('./../controllers/auth.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();
//definimos las rutas para la gestion de Promocion

// Ruta para guardar una Promocion
router.post('/',  promocionCtrl.save);

// Ruta para obtener todas las Promociones
router.get('/',  promocionCtrl.getAll);

// Ruta para obtener una Promocion por ID
router.get('/:id',  promocionCtrl.getById);

// Ruta para obtener una Promocion por ID de alquiler
router.get('/alquiler/:id',  promocionCtrl.getByAlquiler);

// Ruta para editar una Promocion por ID
router.put('/:id',  promocionCtrl.edit);

// Ruta para eliminar una Promocion por ID
router.delete('/:id',  promocionCtrl.delete);
//exportamos el modulo de rutas
module.exports = router;