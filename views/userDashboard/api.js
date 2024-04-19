import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.baseURL = `http://${global.ipDireccion}:3000/api/users`;

axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (!global.ipDireccion || global.ipDireccion === 'undefined') {
    throw new Error('API base URL is undefined. Check the configuration.');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    throw new Error('No token available');
  }
  return config;
}, error => {
  console.error('Setup error:', error.message);
  return Promise.reject(error.message);
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response) {
    console.error('Error response:', {
      status: error.response.status,
      data: error.response.data
    });
    return Promise.reject(`Request failed with status ${error.response.status}: ${error.response.data}`);
  } else if (error.request) {
    console.error('Error request:', error.request);
    return Promise.reject('Request made but no response received');
  } else {
    console.error('Error setting up request:', error.message);
    return Promise.reject(error.message);
  }
});



const handleResponse = (response) => {
  if (response.data && response.status === 200) {
    return response.data;
  } else {
    throw new Error('Unexpected response format');
  }
};

export const fetchMonitoringRequests = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');
    const response = await axios.get(`/${userId}/monitoring-requests`);
    return handleResponse(response);
  } catch (error) {
    console.error('API fetchMonitoringRequests error:', error);
    throw new Error('Failed to fetch monitoring requests');
  }
};

export const fetchDevices = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');
    const response = await axios.get(`/devices/${userId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('API fetchDevices error:', error);
    throw new Error('Failed to fetch devices');
  }
};

export const fetchAdmins = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');
    const response = await axios.get(`/admins/${userId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('API fetchAdmins error:', error);
    throw new Error('Failed to fetch admins');
  }
};

export const dissociateFromDevice = async (deviceId) => {
  try {
    const response = await axios.delete(`/dissociateDevice/${deviceId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('API dissociateFromDevice error:', error);
    throw new Error('Failed to dissociate device');
  }
};

export const dissociateFromAdmin = async (adminId) => {
  try {
    const response = await axios.delete(`/dissociateAdmin/${adminId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('API dissociateFromAdmin error:', error);
    throw new Error('Failed to dissociate admin');
  }
};
