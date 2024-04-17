import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const fetchMonitoringRequests = async () => {
  const userToken = await getAuthToken();
  const userId = await AsyncStorage.getItem('userId');
  const response = await axios.get(`http://${global.ipDireccion}:3000/api/users/${userId}/monitoring-requests`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const fetchDevices = async () => {
  try {
    const userToken = await getAuthToken();
    const endpoint = `http://${global.ipDireccion}:3000/api/users/devices`;
    const response = await axios.get(endpoint, {
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    return response;
  } catch (error) {
    
    console.error('API fetchDevices error:', error.response || error.message);
    throw error;
  }
};


export const fetchAdmins = async () => {
  const userToken = await getAuthToken();
  const response = await axios.get(`http://${global.ipDireccion}:3000/api/users/admins`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const dissociateFromDevice = async (deviceId) => {
  const userToken = await getAuthToken();
  const response = await axios.delete(`http://${global.ipDireccion}:3000/api/users/dissociateDevice/${deviceId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const dissociateFromAdmin = async (adminId) => {
  const userToken = await getAuthToken();
  const response = await axios.delete(`http://${global.ipDireccion}:3000/api/users/dissociateAdmin/${adminId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};
