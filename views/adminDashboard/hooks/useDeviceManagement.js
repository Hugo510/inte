// useDeviceManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import * as DeviceService from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const useDeviceManagement = () => {
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [monitoringRequests, setMonitoringRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userEmail, setUserEmail] = useState('');

  // Carga inicial de dispositivos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const deviceResponse = await DeviceService.fetchDevices();
      const userResponse = await DeviceService.fetchUsers();
      const monitoringRequestResponse = await DeviceService.fetchMonitoringRequests();
      if (deviceResponse.status === 200) {
        setDevices(deviceResponse.data);
      } else {
        console.error('Error fetching devices:', deviceResponse.status);
      }
      if (userResponse.status === 200) {
        setUsers(userResponse.data);
      } else {
        console.error('Error fetching users:', userResponse.status);
      }
      if (monitoringRequestResponse.status === 200) {
        setMonitoringRequests(monitoringRequestResponse.data);
      } else {
        console.error('Error fetching monitoring requests:', monitoringRequestResponse.status);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para agregar un nuevo dispositivo
  const addDevice = async (deviceDetails) => {
    try {
      const response = await DeviceService.addDevice(deviceDetails);
      if (response.status === 201) {
        setDevices([...devices, response.data]);
      } else {
        console.error('Error adding device:', response.status);
      }
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  // Función para actualizar un dispositivo
  const updateDevice = async (deviceId, deviceDetails) => {
    try {
      const response = await DeviceService.updateDevice(deviceId, deviceDetails);
      if (response.status === 200) {
        setDevices(devices.map((device) => (device._id === deviceId ? response.data : device)));
      } else {
        console.error('Error updating device:', response.status);
      }
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const assignDeviceToUser = async (deviceId, userId) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(
        `http://${global.ipDireccion}:3000/api/admins/assignDevicesToUsers`,
        { userIds: [userId] },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      if (response.status === 200) {
        const updatedDevice = response.data;
        setDevices(prevDevices => prevDevices.map(device =>
          device._id === deviceId ? updatedDevice : device
        ));
        Alert.alert("Dispositivo asignado exitosamente");
      } else {
        Alert.alert("Error", "No se pudo asignar el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error al asignar dispositivo", error.message || "Ocurrió un error al asignar el dispositivo.");
    }
  };
  
  const unassignDeviceFromUser = async (deviceId, userId) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(
        `http://${global.ipDireccion}:3000/api/unassignDevicesFromUsers`,
        { userIds: [userId] },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      if (response.status === 200) {
        const updatedDevice = response.data;
        setDevices(prevDevices => prevDevices.map(device =>
          device._id === deviceId ? updatedDevice : device
        ));
        Alert.alert("Dispositivo desasignado exitosamente");
      } else {
        Alert.alert("Error", "No se pudo desasignar el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error al desasignar dispositivo", error.message || "Ocurrió un error al desasignar el dispositivo.");
    }
  };
  
  

  // Función para eliminar un dispositivo
  const deleteDevice = async (deviceId) => {
    try {
      const response = await DeviceService.deleteDevice(deviceId);
      if (response.status === 200) {
        setDevices(devices.filter((device) => device._id !== deviceId));
      } else {
        console.error('Error deleting device:', response.status);
      }
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const removeUser = async (userEmail) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      // Nota: Axios.delete no incluye un body de manera directa, por lo que se usa el parámetro `data` en la configuración.
      const response = await axios.delete(`http://${global.ipDireccion}:3000/api/admins/removeUser`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
        data: { userEmail }, // Incluir `userEmail` en el cuerpo de la solicitud
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Usuario eliminado exitosamente.");
        loadData(); // Recargar datos para reflejar los cambios
      } else {
        Alert.alert("Error", "No se pudo eliminar el usuario.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al eliminar el usuario.");
    }
  };
  
  
  // Función para asignar usuarios al dispositivo seleccionado
  const assignUsersToSelectedDevice = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      await axios.post(
        `http://${global.ipDireccion}:3000/api/admins/devices/${selectedDevice._id}/assignUsers`,
        { userIds: selectedUsers },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      Alert.alert("Usuarios asignados exitosamente");
      closeModal();
      loadData(); // Recargar la lista de dispositivos para reflejar los cambios
    } catch (error) {
      Alert.alert("Error al asignar usuarios", error.message || "Ocurrió un error al asignar usuarios.");
    }
  };
  
  // Función para desasignar usuarios del dispositivo seleccionado
  const unaAssignUsersToSelectedDevice = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      await axios.post(
        `http://${global.ipDireccion}:3000/api/admins/devices/${selectedDevice._id}/unassignUsers`,
        { userIds: selectedUsers },
        { headers: { 'Authorization': `Bearer ${userToken}` } }
      );
      Alert.alert("Usuarios asignados exitosamente");
      closeModal();
      loadData(); // Recargar la lista de dispositivos para reflejar los cambios
    } catch (error) {
      Alert.alert("Error al asignar usuarios", error.message || "Ocurrió un error al asignar usuarios.");
    }
  };


  return {
    devices,
    users,
    monitoringRequests,
    isLoading,
    loadData,
    setSelectedDevice,
    selectedDevice,
    addDevice,
    updateDevice,
    assignDeviceToUser,
    unassignDeviceFromUser,
    removeUser,
    deleteDevice,
    assignUsersToSelectedDevice,
    unaAssignUsersToSelectedDevice,
  };
};

export default useDeviceManagement;
