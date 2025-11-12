const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Cuota = require('./Cuota');
const Novedad = require('./Novedad');
const Local = require('./Local');

const Alquiler = sequelize.define('Alquiler', {
    numeroAlquiler: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cantidadMesAlquiler: {
        type: DataTypes.INTEGER,
        
    },
    plazoMes: {
        type: DataTypes.INTEGER,
        
    },
    costoAlquiler: {
        type: DataTypes.FLOAT,
        
    },
    fechaAlquiler: {
        type: DataTypes.DATE,
        
    },




}, {
    tableName: 'alquileres',
    timestamps: false
});

// Relaciones

Alquiler.belongsTo(Local, { foreignKey: 'localId' , as: 'local'});
Alquiler.hasMany(Cuota, { foreignKey: 'alquilerId', as: 'cuotas'});

module.exports = Alquiler;