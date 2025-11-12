const alquilerCtrl = require('../controllers/alquiler.controller.sql');
const express = require('express');
const router = express.Router();
const autCtrl = require('./../controllers/auth.controller');

//Ruta para generar cuotas para todos los alquileres
router.post('/generarCuotas');

//Ruta para generar cuotas para todos los alquileres
router.post('/verificarCuotasVencidas');


//Ruta para generar un número de alquiler
router.get('/generarNumeroAlquiler', alquilerCtrl.generarNumeroAlquiler);

// Ruta para obtener alquileres de un usuario
router.get('/propietario',  alquilerCtrl.getByPropietario);

// Ruta para obtener un alquiler por número de alquiler
router.get('/numero/:numeroAlquiler',  alquilerCtrl.getByNumero);

// Ruta para obtener un alquiler por ID
router.get('/:id',  alquilerCtrl.getById);

// Ruta para obtener todos los alquileres
router.get('/', alquilerCtrl.getAll);

// Ruta para obtener alquileres por rango de fecha
router.get('/fecha',  alquilerCtrl.getByDate);

// Ruta para crear un alquiler
router.post('/',  alquilerCtrl.create);

// Ruta para eliminar un alquiler por ID
router.delete('/:id',  alquilerCtrl.delete);

// Ruta para editar un alquiler por ID
router.put('/:id',  alquilerCtrl.edit);

//RUTAS CUOTA

//Ruta para agregar una cuota
router.post('/:id/cuota',  alquilerCtrl.addCuota);

// Ruta para eliminar una cuota
router.delete('/:id/cuota/:idCuota',  alquilerCtrl.deleteCuota);

//Ruta para modificar una cuota
router.put('/:id/cuota/:idCuota',  alquilerCtrl.updateCuota);

module.exports = router;