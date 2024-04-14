
import AsyncStorage from '@react-native-async-storage/async-storage';
import getChartData from '../components/GetChartData'; // Make sure this is the correct path
import mapSensorType from '../components/mapSensorType'; // Make sure this is the correct path


// Función para validar los datos del sensor
export const validateSensorData = (sensorData, sensorType) => {
  if (!Array.isArray(sensorData) || sensorData.length === 0) {
      throw new Error("Sensor data is either not an array or it's empty.");
  }

  let invalidEntries = [];
  const validatedData = sensorData.filter(entry => {
      let hasValidTimestamp = entry.hasOwnProperty('timestamp') && !isNaN(new Date(entry.timestamp).getTime());
      let hasValidValue = false;

      switch (sensorType) {
          case 'ultrasonic':
              hasValidValue = entry.hasOwnProperty('distance') && typeof entry.distance === 'number';
              if (!hasValidValue) {
                  entry.distance = 5.0; // Valor predeterminado para distancia ultrasonica
                  hasValidValue = true; // Consideramos válido tras asignar un valor predeterminado
              }
              break;
          case 'humidity':
              hasValidValue = entry.hasOwnProperty('humidity') && typeof entry.humidity === 'number';
              if (!hasValidValue) {
                  entry.humidity = 50; // Valor predeterminado para humedad
                  hasValidValue = true;
              }
              break;
          case 'temperature':
              hasValidValue = entry.hasOwnProperty('temperature') && typeof entry.temperature === 'number';
              if (!hasValidValue) {
                  entry.temperature = 22.0; // Valor predeterminado para temperatura
                  hasValidValue = true;
              }
              break;
          case 'gasDetector':
              hasValidValue = entry.hasOwnProperty('value') && !isNaN(entry.value);
              if (!hasValidValue) {
                  entry.value = 0; // Valor predeterminado para la concentración de gas
                  hasValidValue = true;
              }
              break;
          default:
              hasValidValue = false; // No valida ningún valor si no se reconoce el tipo
              break;
      }

      if (!hasValidValue || !hasValidTimestamp) {
          invalidEntries.push({
              entry,
              reasons: (!hasValidValue ? 'Invalid value' : '') + (!hasValidTimestamp ? ' Invalid timestamp' : '')
          });
      }

      return hasValidValue && hasValidTimestamp;
  });

  if (invalidEntries.length > 0) {
      console.error(`Invalid entries found for sensor type ${sensorType}:`, invalidEntries);
  }

  if (validatedData.length === 0) {
      throw new Error(`No valid entries found after validation for sensor type ${sensorType}. Check the console for more details.`);
  }

  return validatedData;
};




export const fetchDataForSensor = async (sensorType = 'ALL', setGraphData, setIsLoading, setError) => {
  setIsLoading(true);
  setError('');
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) throw new Error('User token not available');
    const deviceId = await AsyncStorage.getItem('@selected_device');
    let sensorTypes = mapSensorType(sensorType);
    if (!Array.isArray(sensorTypes)) {
      sensorTypes = [sensorTypes];
    }

    let allChartData = {};
    for (const type of sensorTypes) {
      const endpoint = `http://${global.ipDireccion}:3000/api/devices/${deviceId}/sensors/${type}/data`;
      const headers = { Authorization: `Bearer ${userToken}` };
      const response = await fetch(endpoint, { method: 'GET', headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to fetch data for sensor: ${type}`);
      console.log('Raw sensor data:', data);
      const validatedData = validateSensorData(data, type);
      if (validatedData.length === 0) continue; // Skip if no valid data
      allChartData[type] = getChartData(validatedData, type); // Transform data for chart
    }

    if (Object.keys(allChartData).length === 0) {
      throw new Error('No chart data found for any sensors');
    }
    
    console.log("data recibida despues de getChartData",allChartData);
    setGraphData(allChartData);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
