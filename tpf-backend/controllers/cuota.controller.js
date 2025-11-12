const Cuota = require('../models/Cuota');
const cuotaCtrl = {}

cuotaCtrl.createCuota = async (req, res) => {
    var cuota = new Cuota(req.body);
    try {
        await cuota.save();
        res.json({
            'status': '1',
            'msg': 'Cuota guardada.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando operacion.'
        })
    }
}
cuotaCtrl.getCuotas = async (req, res) => {
    var cuotas = await Cuota.find();
    res.json(cuotas);
}

cuotaCtrl.getCuotaById = async (req, res) => {    
    try {       
        const cuota = await Cuota.find({_id: req.params.id }); 
        res.json(cuota);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operacion.'
        });
    }
}

cuotaCtrl.deleteCuota = async (req, res) => {
    try {
        await Cuota.deleteOne({ _id: req.params.id });
        res.json({
            status: '1',
            msg: 'Cuota removed'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}
cuotaCtrl.editCuota = async (req, res) => {
    const vcuota = new Cuota(req.body);
    try {
        await Cuota.updateOne({ _id: req.body._id }, vcuota);
        res.json({
            'status': '1',
            'msg': 'Cuota updated'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}
cuotaCtrl.getCuotasByDateRange = async (req, res) => {
    const { startDate, endDate } = req.body;  // Asegúrate de recibir las fechas del cuerpo de la solicitud
    try {
        const cuotas = await Cuota.find({
            fechaPago: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });
        res.json(cuotas);
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación.'
        });
    }
}

module.exports = cuotaCtrl;