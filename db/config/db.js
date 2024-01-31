const mongoose = require('mongoose');

// Asegúrate de que esta es la cadena de conexión correcta para tu base de datos MongoDB Atlas
const MONGO_URL = 'mongodb+srv://victor3041220191:Oq4g0EOjTcEnRoVt@cluster0.usbre0o.mongodb.net/inte?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Conectado a MongoDB Atlas");
    } catch (err) {
        console.error(err);
        throw err; // Lanzar el error para ser manejado por el llamador
    }
};

module.exports = { connectDB };
