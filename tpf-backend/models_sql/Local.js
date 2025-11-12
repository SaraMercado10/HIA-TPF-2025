const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Alquiler = require('./Alquiler');
const Local = sequelize.define('Local', {
    numero: {
        type: DataTypes.STRING,
        
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        
    },
    superficie: {
        type: DataTypes.STRING,
        
    },
    habilitado: {
        type: DataTypes.BOOLEAN,
        
    },
    costoMes: {
        type: DataTypes.FLOAT,
        
    },
    logo: {
        type: DataTypes.STRING,
       
    },
    imagen: {
        type: DataTypes.STRING,
        
    },
    alquilado: {
        type: DataTypes.BOOLEAN,
        
    },
    rubro: {
        type: DataTypes.STRING,
        
    }
}, {
    tableName: 'locales',
    timestamps: false
});

// Evitar eliminar un local si tiene alquileres asociados
Local.beforeDestroy(async (local, options) => {
    const alquileres = await local.getAlquileres(); // Usa la relación 'alquileres'
    if (alquileres.length > 0) {
        throw new Error('No se puede eliminar el local debido a que hay alquileres asociados.');
    }
});

module.exports = Local;