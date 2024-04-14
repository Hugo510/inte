import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './AddDeviceScreen.styles'; // Asegúrate de tener este archivo de estilos

const AddDeviceScreen = () => {
  const [devices, setDevices] = useState([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [deviceId, setDeviceId] = useState(''); // ID del dispositivo a asociar
  const [room, setRoom] = useState(''); // Room para asociar al dispositivo

  // Cargar dispositivos al montar el componente
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.get(`http://${global.ipDireccion}:3000/api/devices/byAdmin`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
      Alert.alert("Error", "No se pudieron obtener los dispositivos.");
    }
  };

  const addDevice = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await axios.post(`http://${global.ipDireccion}:3000/api/admins/associate-device`, 
      { deviceId, room }, // Aquí enviamos el ID del dispositivo y la room
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        Alert.alert("Éxito", "Dispositivo asociado correctamente.");
        setNewDeviceName('');
        setDeviceId('');
        setRoom('');
        fetchDevices(); // Recargar lista de dispositivos
      }
    } catch (error) {
      console.error('Error associating device:', error);
      Alert.alert("Error", "No se pudo asociar el dispositivo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asociar Dispositivo</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDeviceId}
        value={deviceId}
        placeholder="ID del Dispositivo"
      />
      <TextInput
        style={styles.input}
        onChangeText={setRoom}
        value={room}
        placeholder="Room"
      />
      <Button title="Asociar" onPress={addDevice} />
      <Text>Lista de Dispositivos Asociados</Text>
      
      <FlatList
        data={devices}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{`- ${item.room || 'Sin room'}`}</Text>}
      />
    </View>
  );
};

export default AddDeviceScreen;
