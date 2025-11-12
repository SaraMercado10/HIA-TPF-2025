// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Suponiendo que tienes un archivo de configuración de conexión a MySQL
const Alquiler = require('./Alquiler');

const Usuario = sequelize.define('Usuario', {
    email: {
        type: DataTypes.STRING,
        
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        
    },
    perfil: {
        type: DataTypes.STRING,
        
    },
    nombres: {
        type: DataTypes.STRING,
        
    },
    apellido: {
        type: DataTypes.STRING,
       
    },
    dni: {
        type: DataTypes.STRING,
        
    },
    telefono: {
        type: DataTypes.STRING,
        
    }
},{
    tableName: 'usuarios',
    timestamps: false
});



// Middleware para evitar eliminación si existen alquileres asociados
Usuario.beforeDestroy(async (usuario, options) => {
    const alquileres = await Alquiler.findAll({ where: { usuarioId: usuario.id } });
    if (alquileres.length > 0) {
        throw new Error('No se puede eliminar el usuario debido a que hay alquileres asociados');
    }
});

module.exports = Usuario;