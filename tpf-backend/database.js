
 const { Sequelize } = require('sequelize');

// Crear una nueva instancia de Sequelize para conectarse a MySQL
/**const sequelize = new Sequelize('tpf_db_d', 'root', 'PVisual23/9-', {
  host: 'localhost',
  dialect: 'mysql',  // Usamos MySQL como dialecto
  port: 3306,        // El puerto por defecto de MySQL
});*/

const sequelize = new Sequelize({
  host: process.env.DB_HOST,  // 'mysql' (nombre del contenedor en Docker)
  dialect: 'mysql',           // Dialecto MySQL
  port: process.env.DB_PORT,  // 3306
  username: process.env.DB_USER,  // Usuario de la base de datos
  password: process.env.DB_PASSWORD,  // Contraseña de la base de datos
  database: process.env.DB_NAME,    // Nombre de la base de datos
  logging: false,              // Desactivar logging de las consultas SQL
});

// Probar la conexión
/**sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos MySQL exitosa.');
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
  });**/

module.exports = sequelize;



