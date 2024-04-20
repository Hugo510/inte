const mongoose = require('mongoose');
const Admin = require('./model/admin.model.js'); // Asegúrate de que el nombre del archivo y la ruta sean correctos
const User = require('./model/user.model.js'); // Asegúrate de que la ruta sea correcta
const Device = require('./model/device.model.js'); // Asegúrate de que la ruta sea correcta

const mongoDBAtlasConnectionString = 'mongodb+srv://victor3041220191:WJWRDxOHBt1EPGlY@cluster0.usbre0o.mongodb.net/inte?retryWrites=true&w=majority';

async function main() {
  try {

    await mongoose.connect(mongoDBAtlasConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Conexión a MongoDB Atlas establecida con éxito.');

    // Ejemplo de cómo asignar un dispositivo a un usuario y crear una solicitud de monitoreo
    const adminId = "65bc08ba1d400c69823ae7be"; // ID del admin que envía las solicitudes
    const assignments = [
      { userId: "6620c32ccf4e225870e975db", deviceId: "65df7f4da548f31067377549" },
      { userId: "6620c32ccf4e225870e976ef", deviceId: "65df7f4da548f31067377550" },
      // Agrega más pares según sea necesario
    ];

    for (const assignment of assignments) {
      const { userId, deviceId } = assignment;

      // Actualizar registro de admin para incluir nuevas solicitudes de monitoreo
      await Admin.findByIdAndUpdate(adminId, {
        $push: {
          sentMonitoringRequests: {
            userId: userId,
            deviceId: deviceId,
            status: 'pending',
            sentAt: new Date()
          }
        }
      });

      // Actualizar registro de usuario para reflejar la recepción de nuevas solicitudes de monitoreo y asignar dispositivo
      await User.findByIdAndUpdate(userId, {
        $push: {
          monitoringRequests: {
            adminId: adminId,
            deviceId: deviceId,
            status: 'pending'
          },
          devices: deviceId // Asigna el dispositivo al usuario
        }
      });
    }


    console.log('Database update completed successfully');
  } catch (error) {
    console.error('Failed to update database:', error);
} finally {
    // Cierra la conexión al finalizar
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada.');
}
}

// Ejecuta la función principal
main();
