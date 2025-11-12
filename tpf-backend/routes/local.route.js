const localCtrl = require('../controllers/local.controller.sql');
const express = require('express');
const router = express.Router();
const autCtrl = require('./../controllers/auth.controller');

router.get('/generarNumeroLocal',  localCtrl.generarNumeroLocal);

router.post('/',  localCtrl.createLocal);
router.post('/buscar',  localCtrl.findByFiltros);

router.get('/',localCtrl.getLocales);

router.get('/rubros', localCtrl.getLocalesByRubro);

router.get('/:id', localCtrl.getLocal);

router.put('/:id', localCtrl.editLocal);

router.delete('/:id', localCtrl.deleteLocal);

router.get('/nombrelocal/:nombreLocal', localCtrl.getLocalByNombreLocal);

module.exports = router;