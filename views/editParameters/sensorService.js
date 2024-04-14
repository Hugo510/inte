import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

const getDeviceId = async () => {
    return await AsyncStorage.getItem('@selected_device');
  };

const API_URL = `http://192.168.1.15:3000/api/devices`; // Cambia esto por la URL base de tu API

// Función para obtener los datos actuales de los sensores
export const fetchSensorData = async () => {
  try {
    const deviceId = await getDeviceId();
    if (!deviceId) throw new Error("No se ha seleccionado ningún dispositivo.");

    const token = await getAuthToken();
    if (!token) throw new Error("No se ha proporcionado un token de autenticación.");

    const response = await axios.get(`${API_URL}/${deviceId}/sensors/parameters`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    return response.data;
    
  } catch (error) {
    if (error.response) {
      // La petición se hizo y el servidor respondió con un estado fuera del rango 2xx
      console.error("Error en la respuesta del servidor:", error.response.status, error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      console.error("No se recibió respuesta para la petición:", error.request);
    } else {
      // Algo más causó el error
      console.error("Error al hacer la petición:", error.message);
    }
    throw error; // Re-lanza el error para manejarlo más arriba si es necesario
  }
};


// Función para actualizar el parámetro de un sensor específico
export const updateSensorParameter = async (sensorId, parameters) => {
  try {
    const deviceId = await AsyncStorage.getItem('@selected_device');
    if (!deviceId) throw new Error("No se ha seleccionado ningún dispositivo."); // Asegúrate de manejar este error adecuadamente en la interfaz de usuario

    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error("No se ha proporcionado un token de autenticación."); // Igualmente, maneja este error en la interfaz de usuario

    const response = await axios.put(`${API_URL}/${deviceId}/sensors/${sensorId}/parameters`, parameters, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Respuesta al actualizar el sensor ${sensorId}:`, response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // La petición se hizo y el servidor respondió con un estado fuera del rango 2xx
      console.error("Error en la respuesta del servidor al actualizar el sensor:", error.response.status, error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      console.error("No se recibió respuesta para la petición de actualización del sensor:", error.request);
    } else {
      // Algo más causó el error
      console.error("Error al hacer la petición de actualización del sensor:", error.message);
    }
    throw error; // Re-lanza el error para manejarlo más arriba si es necesario
  }
};
