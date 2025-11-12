const Novedad = require('../models/novedad');
const novedadCtrl = {}

/**Guarda una novedad*/
novedadCtrl.save = async (req, res) => {
    var novedad = new Novedad(req.body);
    try {
        await novedad.save();
        res.json({
            'status': '1',
            'msg': 'Novedad guardada'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando operacion'
        })
    }
}

/**Obtiene todas las novedades*/
novedadCtrl.getAll = async (req, res) => {
    try{
        const novedades = await Novedad.find().populate({
            path: 'alquiler',
            populate: [
                { path: 'usuario' },
                { path: 'local' }
            ]
        });
        res.json(novedades);
    }catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operacion'
        });
    }
}

/**Obtiene una novedad por id*/
novedadCtrl.getById = async (req, res) => {    
    try {       
        const novedad = await Novedad.find({_id: req.params.id }); 
        res.json(novedad);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operacion'
        });
    }
}

/**Busca novedades por descripcion estado*/
novedadCtrl.search = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query) {
            return res.status(400).json({
                status: '0',
                msg: 'Debe proporcionar un término de búsqueda'
            });
        }

        const regex = new RegExp(query, 'i'); // Crear una expresión regular para la búsqueda insensible a mayúsculas

        const novedades = await Novedad.find({
            $or: [
                { descripcion: regex },
                { estado: regex },
            ]
        }).populate({
            path: 'alquiler',
            populate: [
                { path: 'local', match: { nombre: regex } },
                { path: 'usuario', match: { nombre: regex } }
            ]
        });

        const filteredNovedades = novedades.filter(novedad => novedad.alquiler.local || novedad.alquiler.usuario || regex.test(novedad.estado) || regex.test(novedad.descripcion));

        res.json(filteredNovedades);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación'
        });
    }
};

/**Obtiene novedades segun el id de un alquiler */
novedadCtrl.getByAlquiler = async (req, res) => {    
    try {      
        const alquilerId = req.params.id;
        const novedades = await Novedad.find({ alquiler: alquilerId })
            .populate('alquiler')
        
        res.json(novedades);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación'
        });
    }
};

/**Obtener novedades segun el id de un usuario */
novedadCtrl.getByUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        // Buscar todas las novedades y poblar los datos anidados
        const novedades = await Novedad.find().populate({
            path: 'alquiler',
            populate: {
                path: 'usuario',
                model: 'Usuario'
            }
        });

        // Filtrar las novedades según el usuarioId
        const filteredNovedades = novedades.filter(novedad => 
            novedad.alquiler.usuario._id.toString() === usuarioId
        );

        res.json(filteredNovedades);
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: 'Error procesando la operación'
        });
    }
};

/**Elimina una novedad por id*/
novedadCtrl.delete = async (req, res) => {
    try {
        await Novedad.deleteOne({ _id: req.params.id });
        res.json({
            status: '1',
            msg: 'Novedad eliminada'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}

/**Actualiza una novedad por id*/
novedadCtrl.edit = async (req, res) => {
    const vnovedad = new Novedad(req.body);
    try {
        await Novedad.updateOne({ _id: req.body._id }, vnovedad);
        res.json({
            'status': '1',
            'msg': 'Novedad actualizada'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operacion'
        })
    }
}

module.exports = novedadCtrl;