const app = require('./app');
const { connectDB } = require('./config/db');

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
