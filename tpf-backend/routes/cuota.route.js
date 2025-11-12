//defino controlador para el manejo de CRUD
const cuotaCtrl = require('../controllers/cuota.controller.sql');
const autCtrl = require('./../controllers/auth.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();
//definimos las rutas para la gestion de cuota
//Ruta para generar una nueva cuota
router.post('/', cuotaCtrl.createCuota);

//Ruta para obtener todas las cuotas
router.get('/', cuotaCtrl.getCuotas);

//Ruta para obtener una cuota por id
router.get('/:id', cuotaCtrl.getCuotaById);

//Ruta para editar una cuota por id
router.put('/:id',  cuotaCtrl.editCuota);

router.delete('/:id', cuotaCtrl.deleteCuota);

//Ruta para obtener cuotas por rango de fecha
router.post('/cuotasByDateRange', cuotaCtrl.getCuotasByDateRange);
//exportamos el modulo de rutas
module.exports = router;