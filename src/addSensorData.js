const mongoose = require('mongoose');
const Device = require('./model/device.model.js'); // Asegúrate de que la ruta sea correcta

// Reemplaza con tu cadena de conexión correcta
const mongoDBAtlasConnectionString = 'mongodb+srv://victor3041220191:WJWRDxOHBt1EPGlY@cluster0.usbre0o.mongodb.net/inte?retryWrites=true&w=majority';

// Función para generar una fecha aleatoria dentro de la última semana
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
              record = { value: Math.random() * 100, timestamp: randomDateLastWeek() };
              break;
            case 'ultrasonic':
              record = { distance: Math.random() * 100, timestamp: randomDateLastWeek() };
              break;
            case 'temperature':
              record = { temperature: Math.random() * 30 + 10, timestamp: randomDateLastWeek() }; // Genera temperatura entre 10 y 40
              break;
              case 'humidity':
                record = { temperature: Math.random() * 30 + 10, timestamp: randomDateLastWeek() }; // Genera temperatura entre 10 y 40
                break;
            default:
              continue; // Si el tipo de sensor no es reconocido, continúa con el siguiente
          }
          data.push(record);
        }
  
        // Actualiza el dispositivo con los nuevos datos generados aleatoriamente
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
  
  // ID del dispositivo extraído de tu estado actual en la captura de pantalla
  const deviceId = '65ed542988b6ad83bb31d8d8';
  addRandomSensorData(deviceId);