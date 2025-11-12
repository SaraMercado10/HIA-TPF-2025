const express = require('express');
const router = express.Router();

const mpController = require('../controllers/mp.controller.js');
const mpService = require('../services/mp.service.js');

const mpInstancia = new mpController(new mpService());

router.post('/pago', (req, res) => mpInstancia.getPagoLink(req, res));

module.exports = router;