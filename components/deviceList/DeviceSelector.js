import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserDevices } from './api'; // Ajusta la ruta según sea necesario
import { Card, List, IconButton } from 'react-native-paper';


const DeviceSelector = ({ onDeviceSelected }) => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    const loadDevices = async () => {
      try {
        const fetchedDevices = await fetchUserDevices();
        console.log(fetchedDevices);
        setDevices(fetchedDevices);
        setFilteredDevices(fetchedDevices); // Inicializa los dispositivos filtrados con todos los dispositivos
      } catch (error) {
        console.log(error);
      }
    };

    loadDevices();
  }, []);

  useEffect(() => {
    const filterDevices = devices.filter(device =>
      device.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDevices(filterDevices);
  }, [searchQuery, devices]);

  const handleSelectDevice = async (deviceId) => {
    try {
      if (!deviceId) {
        throw new Error('Device ID is undefined');
      }
      await AsyncStorage.setItem('@selected_device', deviceId.toString()); // Convierte el deviceId a string
      console.log('Dispositivo seleccionado guardado:', deviceId);
      onDeviceSelected(deviceId.toString()); // Notifica al componente padre
      setModalVisible(false);
    } catch (error) {
      console.log('Error al guardar el dispositivo seleccionado:', error);
    }
  };
  

  return (
    <>
      <TouchableOpacity style={styles.openButton} onPress={() => setModalVisible(true)}>
        <Text>Seleccionar Dispositivo</Text> 
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <IconButton icon="close" onPress={() => setModalVisible(false)} /> 
          <TextInput
            placeholder="Buscar por sala..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredDevices}
            keyExtractor={item => item._id ? item._id.toString() : "default-id"}
            renderItem={({ item }) => (
              <List.Accordion
                title={item.room}
                left={props => <List.Icon {...props} icon="devices" />}
              >
                <List.Item title="Seleccionar" onPress={() => handleSelectDevice(item._id)} />
              </List.Accordion>
            )}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
    elevation: 2,
  },
  searchInput: {
    margin: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 2,
    padding: 10,
  },
});

export default DeviceSelector;