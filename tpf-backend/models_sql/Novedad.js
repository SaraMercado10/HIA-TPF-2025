// models/Novedad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Suponiendo que tienes un archivo de configuración de conexión a MySQL
const Alquiler = require('./Alquiler');

const Novedad = sequelize.define('Novedad', {
    descripcion: {
        type: DataTypes.STRING,
       
    },
    estado: {
        type: DataTypes.STRING,
        
    }
}, {
    tableName: 'novedades',
    timestamps: false
});


module.exports = Novedad;