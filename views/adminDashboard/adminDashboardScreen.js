import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './adminDashboardScreen.styles';


const AdminDashboardScreen = () => {
  const [monitoringRequests, setMonitoringRequests] = useState([]);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
      }, []);

      const loadData = async () => {
        setIsLoading(true);
        await fetchMonitoringRequests();
        await fetchDevices();
        await fetchUsers();
        await assignUserToDevice();
        await unassignUserFromDevice();
        await sendMonitoringRequest();
        await removeUser();
        await deleteDevice();
        await addDevice();
        setIsLoading(false);
    };

    const fetchMonitoringRequests = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const adminId = await AsyncStorage.getItem('adminId'); // Asegúrate de que guardas y recuperas el adminId correctamente
      try {
        const response = await axios.get(`http://${global.ipDireccion}:3000/api/admin/${adminId}/monitoring-requests`, {
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
        if (response.status === 200) {
          setMonitoringRequests(response.data);
        } else {
          Alert.alert("Error", "No se pudo obtener las solicitudes de monitoreo.");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Ocurrió un error al obtener las solicitudes de monitoreo.");
      }
    };
    

  const fetchDevices = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const endpoint = `http://${global.ipDireccion}:3000/api/devices/byAdmin`;
    try {
      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        setDevices(response.data);
      } else {
        Alert.alert("Error", "No se pudo obtener la lista de dispositivos.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al obtener los dispositivos.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(`http://${global.ipDireccion}:3000/api/admins/byAdmin`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMonitoringRequest = async (userEmail) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/admins/sendMonitoringRequest/${userEmail}`, {
        userEmail,
      }, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Solicitud de monitoreo enviada exitosamente.");
        loadData(); // Recargar datos para reflejar los cambios
      } else {
        Alert.alert("Error", "No se pudo enviar la solicitud de monitoreo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al enviar la solicitud de monitoreo.");
    }
  };
  

  const assignUserToDevice = async (deviceId, userIds) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/devices/${deviceId}/assignUsers`, { userIds }, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Usuario(s) asignado(s) exitosamente al dispositivo.");
        loadData();
      } else {
        Alert.alert("Error", "No se pudo asignar el usuario al dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al asignar el usuario al dispositivo.");
    }
  };
  
  const unassignUserFromDevice = async (deviceId, userIds) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/devices/${deviceId}/unassignUsers`, { userIds }, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Usuario(s) desasignado(s) exitosamente del dispositivo.");
        loadData();
      } else {
        Alert.alert("Error", "No se pudo desasignar el usuario del dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al desasignar el usuario del dispositivo.");
    }
  };

  const removeUser = async (userEmail) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.delete(`http://${global.ipDireccion}:3000/api/admin/removeUser/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
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

  const deleteDevice = async (deviceId) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.delete(`http://${global.ipDireccion}:3000/api/devices/${deviceId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Dispositivo eliminado exitosamente.");
        loadData(); // Recargar datos para reflejar los cambios
      } else {
        Alert.alert("Error", "No se pudo eliminar el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al eliminar el dispositivo.");
    }
  };

  const addDevice = async (deviceDetails) => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/devices`, deviceDetails, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.status === 201) {
        Alert.alert("Éxito", "Dispositivo añadido exitosamente.");
        loadData(); // Recargar datos para reflejar los cambios
      } else {
        Alert.alert("Error", "No se pudo añadir el dispositivo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Ocurrió un error al añadir el dispositivo.");
    }
  };
  
  

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Dispositivos y Usuarios</Text>
      {isLoading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          <FlatList
            data={devices}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{`Dispositivo: ${item.room}`}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {/* Acción para manejar el dispositivo */}}>
                  <Text style={styles.buttonText}>Gestionar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{`Usuario: ${item.firstName} ${item.lastName}`}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {/* Acción para manejar el usuario */}}>
                  <Text style={styles.buttonText}>Gestionar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}

<Text style={styles.title}>Solicitudes de Monitoreo</Text>
      <FlatList
        data={monitoringRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{`Solicitud de: ${item.userName}`}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleAcceptRequest(item._id)}>
                <Text>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleRejectRequest(item._id)}>
                <Text>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};


export default AdminDashboardScreen;
