
const mongoose = require('mongoose');
const Admin = require('./model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
const User = require('./model/user.model.js'); // Asegúrate de que la ruta sea correcta

// Reemplaza con tu cadena de conexión correcta
const mongoDBAtlasConnectionString = 'mongodb+srv://victor3041220191:WJWRDxOHBt1EPGlY@cluster0.usbre0o.mongodb.net/inte?retryWrites=true&w=majority';

// ID del administrador y del usuario como ejemplo
const adminId = '65bc08ba1d400c69823ae7be';
const userId = '65dcf2f3c1e449a1ed623c5c';

// Función principal async para manejar la lógica de conexión y actualización
async function main() {
    try {
        // Espera a que la conexión se establezca
        await mongoose.connect(mongoDBAtlasConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Conexión a MongoDB Atlas establecida con éxito.');

        if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid ID format');
            return;
          }
        
          try {
            // Encuentra al admin por ID
            const admin = await Admin.findById(adminId);
        
            if (!admin) {
              console.error('Admin not found');
              return;
            }
        
            // Actualizar el estado de la solicitud de monitoreo a 'accepted'
            const request = admin.sentMonitoringRequests.id('65e661e2e38da23469d3c5a3'); // Reemplaza con el ID real de la solicitud
            if (request) {
              request.status = 'accepted';
            } else {
              console.error('Monitoring request not found');
              return;
            }
        
            // Añadir el usuario a 'monitoredUsers' si no está ya incluido
            if (!admin.monitoredUsers.some(uId => uId.toString() === userId)) {
              admin.monitoredUsers.push(userId);
            }
        
            // Guardar el documento actualizado
            await admin.save();
            console.log('Admin record updated successfully');
          } catch (error) {
            console.error('Error updating admin record:', error);
          }
    } catch (err) {
        console.error('Error al actualizar las colecciones:', err);
    } finally {
        // Cierra la conexión al finalizar
        await mongoose.connection.close();
    }
}

// Ejecuta la función principal
main();
