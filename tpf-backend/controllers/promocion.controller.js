const Promocion = require('../models/promocion');
const promocionCtrl = {}

/**
 * Da de alta una promocion
 */
promocionCtrl.save = async (req, res) => {
    var promocion = new Promocion(req.body);
    try {
        await promocion.save();
        res.json({
            'status': '1',
            'msg': 'Promocion creada.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando operacion.'
        })
    }
}
/**
 * Obtiene todas las promociones
 */
promocionCtrl.getAll = async (req, res) => {
    var promociones = await Promocion.find().populate('alquiler');
    res.json(promociones);
}
/**
 * Obtiene promocion por id
 */
promocionCtrl.getById = async (req, res) => {    
    try {       
        const promocion = await Cuota.find({_id: req.params.id }); 
        res.json(promocion);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operacion.'
        });
    }
}

/**Obtiene promocion por el id de un alquiler */
promocionCtrl.getByAlquiler = async (req, res) => {
    try {
        const alquilerId = req.params.id;
        const promocion = await Promocion.find({ alquiler: alquilerId }).populate('alquiler')

        res.json(promocion);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación'
        });
    }
};

/**
 * Modifica una promocion
 */
promocionCtrl.edit = async (req, res) => {
    const vpromocion = new Promocion(req.body);
    try {
        await Promocion.updateOne({ _id: req.body._id }, vpromocion);
        res.json({
            'status': '1',
            'msg': 'Promocion updated'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}
/**
 * Elimina una promocion
 */
promocionCtrl.delete = async (req, res) => {
    try {
        await Promocion.deleteOne({ _id: req.params.id });
        res.json({
            status: '1',
            msg: 'Promocion removed'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}

module.exports = promocionCtrl;