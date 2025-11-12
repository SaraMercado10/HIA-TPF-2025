// models/Promocion.js
const {  DataTypes } = require('sequelize');
const sequelize = require('../database'); // Suponiendo que tienes un archivo de configuración de conexión a MySQL
const Alquiler = require('./Alquiler');

const Promocion = sequelize.define('Promocion', {
    fechaInicio: {
        type: DataTypes.DATE,
        
    },
    fechaFin: {
        type: DataTypes.DATE,
        
    },
    descripcion: {
        type: DataTypes.STRING,
        
    },
    imagen: {
        type: DataTypes.STRING,
        
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        
    }
}, {
    tableName: 'promociones',
    timestamps: false
});



module.exports = Promocion;