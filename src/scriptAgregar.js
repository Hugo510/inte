const mongoose = require('mongoose');
const Admin = require('./model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
const User = require('./model/user.model.js'); // Asegúrate de que la ruta sea correcta

// Reemplaza con tu cadena de conexión correcta
const mongoDBAtlasConnectionString = 'mongodb+srv://victor3041220191:Oq4g0EOjTcEnRoVt@cluster0.usbre0o.mongodb.net/inte?retryWrites=true&w=majority';

// Función principal async para manejar la lógica de conexión y actualización
async function main() {
    try {
        // Espera a que la conexión se establezca
        await mongoose.connect(mongoDBAtlasConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Conexión a MongoDB Atlas establecida con éxito.');

        // Actualización de los documentos en la colección de admins
        await Admin.updateMany({}, { $set: { firstName: 'Valor por defecto', lastName: 'Valor por defecto' } });
        console.log('Colección de admins actualizada con éxito.');

        // Actualización de los documentos en la colección de users
        await User.updateMany({}, { $set: { firstName: 'Valor por defecto', lastName: 'Valor por defecto' } });
        console.log('Colección de users actualizada con éxito.');

    } catch (err) {
        console.error('Error al actualizar las colecciones:', err);
    } finally {
        // Cierra la conexión al finalizar
        await mongoose.connection.close();
    }
}

// Ejecuta la función principal
main();
