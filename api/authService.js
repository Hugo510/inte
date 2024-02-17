import { AsyncStorage } from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000/api';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem('@token', json.token);
      return json;
    } else {
      throw new Error(json.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || 'Registro fallido');
      }
      return json; // asumiendo que el servidor responde con el usuario y el token
    } catch (error) {
      throw error;
    }
  };