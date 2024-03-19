import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const fetchMonitoringRequests = async () => {
  const userToken = await getAuthToken();
  const adminId = await AsyncStorage.getItem('userId');
  const response = await axios.get(`http://${global.ipDireccion}:3000/api/admins/${adminId}/monitoring-requests`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const fetchDevices = async () => {
  try {
    const userToken = await getAuthToken();
    const endpoint = `http://${global.ipDireccion}:3000/api/devices/byAdmin`;
    const response = await axios.get(endpoint, {
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    return response;
  } catch (error) {
    // Manejo del error...
    console.error('API fetchDevices error:', error.response || error.message);
    throw error; // Propagar el error para manejarlo en la interfaz de usuario.
  }
};


export const fetchUsers = async () => {
  const userToken = await getAuthToken();
  const userId = await AsyncStorage.getItem('userId');
  const response = await axios.get(`http://${global.ipDireccion}:3000/api/admins/${userId}/users`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const sendMonitoringRequest = async (userEmail) => {
  const userToken = await getAuthToken();
  const response = await axios.post(`http://${global.ipDireccion}:3000/api/admins/sendMonitoringRequest`, {
    userEmail,
  }, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const assignUserToDevice = async (deviceId, userIds) => {
  const userToken = await getAuthToken();
  const response = await axios.post(`http://${global.ipDireccion}:3000/api/admins/devices/${deviceId}/assignUsers`, { userIds }, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const unassignUserFromDevice = async (deviceId, userIds) => {
  const userToken = await getAuthToken();
  const response = await axios.post(`http://${global.ipDireccion}:3000/api/admins/devices/${deviceId}/unassignUsers`, { userIds }, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const assignDeviceToUser = async (userId) => {
  const userToken = await getAuthToken();
  const response = await axios.post(
    `http://${global.ipDireccion}:3000/api/admins/assignDevicesToUsers`,
    { userIds: [userId] },
    { headers: { 'Authorization': `Bearer ${userToken}` } }
  );
  return response;
};

export const unassignDeviceFromUser = async (userId) => {
  const userToken = await getAuthToken();
  const response = await axios.post(
    `http://${global.ipDireccion}:3000/api/admins/unassignDevicesFromUsers`,
    { userIds: [userId] },
    { headers: { 'Authorization': `Bearer ${userToken}` } }
  );
  return response;
};

export const removeUser = async (userEmail) => {
  const userToken = await getAuthToken();
  const response = await axios.delete(`http://${global.ipDireccion}:3000/api/admins/removeUser`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const deleteDevice = async (deviceId) => {
  const userToken = await getAuthToken();
  const response = await axios.delete(`http://${global.ipDireccion}:3000/api/devices/${deviceId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const addDevice = async (deviceDetails) => {
  const userToken = await getAuthToken();
  const response = await axios.post(`http://${global.ipDireccion}:3000/api/devices`, deviceDetails, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return response;
};

export const updateDevice = async (deviceId, deviceDetails) => {
  const userToken = await getAuthToken();
  const response = await axios.put(`http://${global.ipDireccion}:3000/api/devices/${deviceId}`, deviceDetails, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  return response;
};
