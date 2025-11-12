const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Alquiler = require('./Alquiler');
const Cuota = sequelize.define('Cuota', {
    monto: {
        type: DataTypes.FLOAT,
        
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        
    },
    fechaVencimiento: {
        type: DataTypes.DATE,
        
    },
    recargoAplicado: {
        type: DataTypes.BOOLEAN,
        
    },
    fechaPago: {
        type: DataTypes.DATE,
    },
    medioPago: {
        type: DataTypes.STRING,
        
    },
    cuponQr: {
        type: DataTypes.STRING,
        
    },
    pagado: {
        type: DataTypes.BOOLEAN,
        
    }
}, {
    tableName: 'cuotas',
    timestamps: false
});

module.exports = Cuota;