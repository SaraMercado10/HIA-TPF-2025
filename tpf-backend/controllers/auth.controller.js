const jwt = require('jsonwebtoken');
const authCtrl = {};

authCtrl.verifyToken = async (req, res, next) => {
    // Verificar si hay un header de autorización
    if (!req.headers.authorization) {
        return res.status(403).json({ 'status': '0', 'msg': 'Unauthorized request.' });
    }

    // Se espera formato -> Bearer XXX, interesa el token en pos(1) del arrayTexto
    var arrayTexto = req.headers.authorization.split(' ');
    var token = null;
    token = (arrayTexto.length >= 2) ? arrayTexto[1] : null;

    // Verificar si el token es nulo
    if (token == null) {
        return res.status(403).json({ 'status': '0', 'msg': 'Unauthorized request.' });
    }

    // Verificar el token
    try {
        const payload = jwt.verify(token, "secretkey");
        // payload retorna la información del user que se usó en el método de login
        req.userId = payload._id;
        next(); // se pasa a procesar el siguiente método del stack de la petición
    } catch (error) {
        return res.status(500).json({ 'status': '0', 'msg': 'Unauthorized request.' });
    }
};

// Exportamos el manejador de token
module.exports = authCtrl;