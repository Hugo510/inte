const mongoose = require('mongoose');
const Device = require('./model/device.model.js'); // Asegúrate de que la ruta sea correcta

const mongoDBAtlasConnectionString = 'mongodb+srv://victor3041220191:WJWRDxOHBt1EPGlY@cluster0.usbre0o.mongodb.net/inte?retryWrites=true&w=majority';

function randomDateLastWeek() {
  const now = new Date();
  const sevenDaysAgo = now.getDate() - 7;
  const randomDate = new Date();
  randomDate.setDate(sevenDaysAgo + Math.floor(Math.random() * 7));
  return randomDate;
}

async function addRandomSensorData(deviceId) {
  try {
    await mongoose.connect(mongoDBAtlasConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conexión a MongoDB establecida con éxito.');

    const sensorTypes = ['gasDetector', 'ultrasonic', 'temperature', 'humidity'];

    for (let type of sensorTypes) {
      const data = [];
      for (let i = 0; i < 15; i++) {
        let record;
        switch (type) {
          case 'gasDetector':
            record = { concentration: Math.random() * 1000, timestamp: randomDateLastWeek() };
            break;
          case 'ultrasonic':
            record = { distance: Math.random() * 10, timestamp: randomDateLastWeek() };
            break;
          case 'temperature':
            record = { temperature: Math.random() * 30 + 10, timestamp: randomDateLastWeek() };
            break;
          case 'humidity':
            record = { humidity: Math.random() * 100, timestamp: randomDateLastWeek() };
            break;
          default:
            continue;
        }
        data.push(record);
      }

      await Device.findByIdAndUpdate(
        deviceId,
        { $push: { [`sensors.${type}.data`]: { $each: data } } },
        { new: true, upsert: true }
      );
    }

    console.log('Datos de sensores añadidos con éxito al dispositivo con ID:', deviceId);
  } catch (error) {
    console.error('Error al añadir datos de sensores:', error);
  } finally {
    await mongoose.connection.close();
  }
}

async function createDevices() {
  try {
    await mongoose.connect(mongoDBAtlasConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conexión a MongoDB establecida con éxito.');

    const rooms = ['Sala', 'Cocina', 'Baño', 'Dormitorio', 'Garaje'];
    const deviceIds = [];

    for (const room of rooms) {
      const newDevice = new Device({
        adminUser: '65bc08ba1d400c69823ae7be',
        monitoredUsers: [mongoose.Types.ObjectId()], // Genera un ObjectId aleatorio para el ejemplo
        room: room,
        sensors: {
          gasDetector: { parameters: { sensitivity: 500 } },
          ultrasonic: { parameters: { range: 5 } },
          temperature: { parameters: { max: 40, min: 0 } },
          humidity: { parameters: { max: 100, min: 20 } },
          // Ignoramos smoke
        }
      });
      const savedDevice = await newDevice.save();
      deviceIds.push(savedDevice._id);
      console.log(`Dispositivo creado en la habitación: ${room} con ID: ${savedDevice._id}`);
    }

    return deviceIds;
  } catch (error) {
    console.error('Error al crear dispositivos:', error);
  } finally {
    await mongoose.connection.close();
  }
}

async function initializeDevices() {
  const deviceIds = await createDevices();
  deviceIds.forEach(deviceId => addRandomSensorData(deviceId));
}

initializeDevices();
