const Local = require('../models/local');
const localCtrl = {}

/**
 * Obtiene todos los locales
 */
localCtrl.getLocales = async (req, res) => {
    var locales = await Local.find();
    res.json(locales);
}

/**
 * Genera un número de alquiler
 */
localCtrl.generarNumeroLocal = async (req, res) => {
    try {
        const lastLocal = await Local.findOne().sort({ numero: -1 }).exec();

        if (!lastLocal) {
            return res.send('L001');
        }

        const lastNumber = parseInt(lastLocal.numero.substring(1));

        const newNumber = lastNumber + 1;

        const newLocalNumber = `L${newNumber.toString().padStart(3, '0')}`;

        return res.send(newLocalNumber);
    } catch (error){
        return res.send({ message: 'Error al generar el número de local' });
    }
};

/**
 * Da de alta un local
 */
localCtrl.createLocal = async (req, res) => {
    var local = new Local(req.body);
    try{
        await local.save();
        res.json({
        'status': '1',
        'msg': 'Local creado.'})
    }catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al crear el local.'
        })
    }
}

/**
 * Obtiene un local por ID
 */
localCtrl.getLocal = async (req, res) => {
    const local = await Local.findById(req.params.id);
    res.json(local);
}

localCtrl.findByFiltros = async (req, res) => {
    try{
        let filter = {};

        if(req.body.nombre)
            filter.nombre = {$regex : req.body.nombre, $options: 'i'};

        const resultado = await Local.find(filter);
        res.json(resultado);
    }catch(error){
        res.status(400).json({
            status : '0',
            msg : 'No se pudo realizar la busqueda'
        })
    }
}

/**
 * Modifica un local
 */
localCtrl.editLocal = async (req, res) => {
    const vlocal = new Local(req.body);
    try{
        await Local.updateOne({_id: req.body._id}, vlocal);
        res.json({
           'status': '1',
           'msg': 'Local modificado.'
        })
    } catch (error) {
        res.status(400).json({
           'status': '0',
           'msg': 'Error al modificar el local.'
        })
    }
}

/**
 * Elimina un local
 */
 localCtrl.deleteLocal = async (req, res) => {
    try{
        await Local.deleteOne({_id: req.params.id});
        res.json({
           status: '1',
           msg: 'Local eliminado.'
        })
    } catch (error) {
        res.status(400).json({
           'status': '0',
           'msg': error.message
        })
    }
}

/**
 * Obtiene un Local por nombre Local
 */
localCtrl.getLocalByNombreLocal= async (req, res) => {
    try{
        const local = await Local.find({nombreLocal: req.params.nombreLocal});
        res.json(local);
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al obtener el local.'
        });
    }
}

/**
 * Obtiene Local por rubro
 */
localCtrl.getLocalesByRubro = async (req, res) => {
    try{
        const {rubro} = req.query;
        var locales = await Local.find({rubro});
        res.json(locales);
    } catch (error) {
        res.status(400).json({
           'status': '0',
           'msg': 'Error al obtener los locales.'
        })
    }
}

module.exports = localCtrl;