// Asegúrate de que esto sea lo primero en ejecutarse para cargar las variables de entorno
require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/db');

// La consola debe imprimir la clave secreta si dotenv está cargado correctamente
console.log(process.env.JWT_SECRET_KEY, "<<");

// Iniciar la conexión a la base de datos y luego el servidor
connectDB()
    .then(() => {
        app.listen(3000, () => {
            console.log('La aplicación está escuchando en el puerto 3000');
        });
    })
    .catch((err) => {
        console.error('Error al conectar con la base de datos:', err);
        process.exit(1);
    });
