// /utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@token', token);
  } catch (e) {
    console.error('Error al guardar el token', e);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return token;
  } catch (e) {
    console.error('Error al recuperar el token', e);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('@token');
  } catch (e) {
    console.error('Error al eliminar el token', e);
  }
};
