//************************* */

// Importar dependencias
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const sequelize = require('./database'); // Importa sequelize desde tu archivo de configuración
const helmet = require('helmet'); // <-- NUEVO: Para protección de headers
//const { connectWithRetry } = require('./database'); // Importa la función de conexión
// Importar modelos
const Usuario = require('./models_sql/Usuario');
const Alquiler = require('./models_sql/Alquiler');
const Local = require('./models_sql/Local');
const Cuota = require('./models_sql/Cuota');
const Novedad = require('./models_sql/Novedad');
const Promocion = require('./models_sql/Promocion');

// Establecer las relaciones entre los modelos

Alquiler.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });  // Alquiler pertenece a Usuario
Usuario.hasMany(Alquiler, { foreignKey: 'usuarioId', as: 'alquileres' }); // Usuario tiene muchos Alquileres
Alquiler.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Local.hasMany(Alquiler, { foreignKey: 'localId', as: 'alquileres' });
Alquiler.belongsTo(Local, { foreignKey: 'localId'});
Alquiler.hasMany(Cuota, { foreignKey: 'alquilerId' });
Alquiler.hasMany(Promocion, { foreignKey: 'alquilerId', as: 'promociones' });
Alquiler.hasMany(Novedad, { foreignKey: 'alquilerId', as: 'novedades' }); // Relación con Novedades
Novedad.belongsTo(Alquiler, { foreignKey: 'alquilerId', as: 'alquiler',onDelete: 'CASCADE' });
Promocion.belongsTo(Alquiler, { foreignKey: 'alquilerId', as: 'alquiler', onDelete: 'CASCADE' });

// Configuración de express y otros middlewares
const app = express();
dotenv.config();

// Middlewares
app.use(helmet()); // <-- NUEVO: Aplica headers de seguridad
app.disable('x-powered-by'); // <-- NUEVO: Oculta la identidad del servidor (Express)
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:4200',
    'http://backend:3000' // si ambos están en docker
  ],
  credentials: true
}));

// Conexión a la base de datos
// Función para conectar con reintentos
// Definir connectWithRetry en el mismo archivo
const connectWithRetry = async () => {
  let retries = 1000;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("Conexión a la base de datos exitosa.");
      return sequelize;
    } catch (err) {
      console.error("Error conectando a la base de datos. Reintentando...", err);
      retries -= 1;
      if (retries === 0) {
        console.error("No se pudo conectar a la base de datos. Abortando.");
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

// Usar connectWithRetry directamente
connectWithRetry()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    sequelize.sync({ })
      .then(() => {
        console.log("Tablas sincronizadas correctamente");
      })
      .catch((error) => {
        console.error("Error al sincronizar tablas", error);
      });
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
// Aquí seguirían las rutas de tu aplicación y la configuración de la API
app.use('/api/usuario', require('./routes/usuario.route.js'));
app.use('/api/alquiler', require('./routes/alquiler.route.js'));
app.use('/api/local', require('./routes/local.route.js'));
app.use('/api/novedad', require('./routes/novedad.route.js'));
app.use('/api/cuota', require('./routes/cuota.route.js'));
app.use('/api/promocion', require('./routes/promocion.route.js'));

// Puerto y servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});