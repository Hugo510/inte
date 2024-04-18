// DeviceList.js (parte de su contenido)


import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useDeviceManagement from '../hooks/useDeviceManagement'; // Asegúrate de que la ruta sea correcta

const DeviceList = () => {
  const {
    devices,
    loadData,
    setSelectedDevice,
    dissociateDevice, // Asegúrate de que esta línea esté agregada para obtener la función del hook
  } = useDeviceManagement();

  const [isModalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    loadData(); // Carga los dispositivos cuando el componente se monta
  }, []);

  const handleDissociate = (deviceId) => {
    Alert.alert(
      "Desasociar Dispositivo",
      "¿Estás seguro de que quieres desasociar este dispositivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desasociar",
          onPress: () => {
            setSelectedDevice(deviceId); // Guarda el dispositivo actual seleccionado
            dissociateDevice(deviceId); // Llama a la función para desasociar el dispositivo
          },
          style: "destructive"
        },
      ],
    );
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={devices}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.deviceListItem}>
              <Text>{item.room}</Text>
              <TouchableOpacity onPress={() => handleDissociate(item._id)}>
                <MaterialIcons name="delete" size={18} />
              </TouchableOpacity>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.userListContainer}
        />
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  deviceListItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  deviceText: {
    fontSize: 16,
    color: '#333',
    flex: 1, // Asegura que el texto se ajuste dentro del contenedor
    marginLeft: 10, // Añade un pequeño margen a la izquierda del texto,
    fontWeight: '500',
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#f0f0f0', // Un ligero fondo para destacar el área táctil
    marginLeft: 10, // Espaciado entre iconos
  },
  icon: {
    marginLeft: 10,
  },
  userListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});



export default DeviceList;
