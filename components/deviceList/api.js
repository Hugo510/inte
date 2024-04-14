import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Asegúrate de reemplazar esta URL base con la URL de tu propia API
const API_BASE_URL = `http://192.168.1.11:3000/api/devices`;

export const fetchUserDevices = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      throw new Error('User token not available');
    }

    const headers = {
      Authorization: `Bearer ${userToken}`
    };

    const response = await axios.get(`${API_BASE_URL}/byAdmin`, { headers });
    return response.data;
  } catch (error) {
    // Este es un ejemplo de cómo podrías manejar los errores específicos de la API y los errores de red de forma diferente
    if (error.response) {
      // La solicitud se hizo y el servidor respondió con un estado de error
      console.error('Error response from the server:', error.response.status, error.response.data);
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error('No response received for the request:', error.request);
    } else {
      // Algo más causó el error
      console.error('Error:', error.message);
    }
    throw error;
  }
};
